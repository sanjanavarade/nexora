"use server"

import { blockUser, unblockUser } from "@/lib/block-service";
import { RoomServiceClient } from "livekit-server-sdk";
import { revalidatePath } from "next/cache";


const roomService = new RoomServiceClient(
  process.env.LIVEKIT_API_URL!,   // ✅ Base URL (https://...)
  process.env.LIVEKIT_API_KEY!,   // ✅ API Key
  process.env.LIVEKIT_API_SECRET! // ✅ API Secret
);

export const onBlock = async (id: string) => {
  const self= await blockUser(id);
  let blockedUser;

  try{
  blockedUser = await blockUser(id);
  }catch{

  }

  try{
    await roomService.removeParticipant(self.id, id);
  }catch{

  }
  revalidatePath(`/u/${self.blocked.username}/community`);
  return blockedUser;
};

export const onUnblock = async (username: string) => {
  const unblockedUser = await unblockUser(username);
  revalidatePath("/");
  if (unblockedUser) {
    revalidatePath(`/${unblockedUser.blocked.username}`);
  }
  return unblockedUser;
};
