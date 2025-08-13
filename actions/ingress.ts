"use server";

import {
  IngressAudioEncodingPreset,
  IngressInput,
  IngressClient,
  IngressVideoEncodingPreset,
  RoomServiceClient,
  CreateIngressOptions,
  IngressVideoOptions,
  IngressAudioOptions,
  TrackSource,
} from "livekit-server-sdk";
import prisma from "@/lib/prisma";
import { getSelf } from "@/lib/auth-service";
import { revalidatePath } from "next/cache";

/**
 * Initialize LiveKit clients
 */
const roomService = new RoomServiceClient(
  process.env.LIVEKIT_API_URL!,   // ✅ Base URL (https://...)
  process.env.LIVEKIT_API_KEY!,   // ✅ API Key
  process.env.LIVEKIT_API_SECRET! // ✅ API Secret
);

const ingressClient = new IngressClient(
  process.env.LIVEKIT_API_URL!    // Only URL needed
);

/**
 * Remove all existing ingresses and rooms for a given host
 */
export const resetIngresses = async (hostIdentity: string) => {
  try {
    const ingresses = await ingressClient.listIngress({ roomName: hostIdentity });
    const rooms = await roomService.listRooms([hostIdentity]);

    for (const room of rooms) {
      await roomService.deleteRoom(room.name);
    }

    for (const ingress of ingresses) {
      if (ingress.ingressId) {
        await ingressClient.deleteIngress(ingress.ingressId);
      }
    }
  } catch (err) {
    console.error("Error in resetIngresses:", err);
    throw new Error("Failed to reset ingresses");
  }
};

/**
 * Create a new ingress for the current user
 */
export const createIngress = async (ingressType: IngressInput) => {
  const self = await getSelf();

  // 1. Remove old ingresses
  await resetIngresses(self.id);

  // 2. Prepare ingress options
  const options: CreateIngressOptions = {
    name: self.username,
    roomName: self.id,
    participantName: self.username,
    participantIdentity: self.id,
  };

  if (ingressType === IngressInput.WHIP_INPUT) {
    options.bypassTranscoding = true;
  } else {
    // Video setup
    options.video = new IngressVideoOptions({
      source: TrackSource.CAMERA,
      encodingOptions: {
        case: "preset",
        value: IngressVideoEncodingPreset.H264_1080P_30FPS_3_LAYERS,
      },
    });

    // Audio setup
    options.audio = new IngressAudioOptions({
      source: TrackSource.MICROPHONE,
      encodingOptions: {
        case: "preset",
        value: IngressAudioEncodingPreset.OPUS_STEREO_96KBPS,
      },
    });
  }

  // 3. Create ingress
  const ingress = await ingressClient.createIngress(ingressType, options);

  if (!ingress || !ingress.url || !ingress.streamKey) {
    throw new Error("Failed to create ingress");
  }

  // 4. Save to DB
  await prisma.stream.update({
    where: { userId: self.id },
    data: {
      ingressId: ingress.ingressId,
      serverUrl: ingress.url,
      streamKey: ingress.streamKey,
    },
  });

  // 5. Revalidate page
  revalidatePath(`/u/${self.username}/keys`);

  // 6. Return only plain JSON to client (no classes)
  return {
    ingressId: ingress.ingressId,
    url: ingress.url,
    streamKey: ingress.streamKey,
  };
};
