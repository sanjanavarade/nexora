import { headers } from "next/headers";
import { WebhookReceiver } from "livekit-server-sdk";
import prisma from "@/lib/prisma";

const receiver = new WebhookReceiver(
  process.env.LIVEKIT_API_KEY!,
  process.env.LIVEKIT_API_SECRET!
);

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const headerPayload = headers();
    const authorization = (await headerPayload).get("authorization");

    if (!authorization) {
      return new Response("No authorization header", { status: 400 });
    }

    const event = await receiver.receive(body, authorization);

    if (event.event === "ingress_started") {
      await prisma.stream.update({
        where: { ingressId: event.ingressInfo?.ingressId },
        data: { isLive: true },
      });
    }

    if (event.event === "ingress_ended") {
      await prisma.stream.update({
        where: { ingressId: event.ingressInfo?.ingressId },
        data: { isLive: false },
      });
    }

    // Always return something
    return new Response("Webhook processed", { status: 200 });
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error("Webhook error:", err.message);
    } else {
      console.error("Webhook error:", err);
    }
    return new Response("Error processing webhook", { status: 500 });
  }
}
