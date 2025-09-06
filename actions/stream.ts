"use server"

import {revalidatePath} from "next/cache";
import prisma from "@/lib/prisma";
import {getSelf} from "@/lib/auth-service";
import { Stream } from "@/app/generated/prisma/client";

export const updateStream = async (values: Partial<Stream>) => {
    try{
        const self = await getSelf();
        const selfStream = await prisma.stream.findUnique({
            where: { userId: self.id, },
        });

        if (!selfStream) {
            throw new Error("Stream not found");
        }
        const validData = {
            thumnnailUrl: values.thumbnailUrl,
            name: values.name,
            isChatEnabled: values.isChatEnabled,
            isChatDelayed: values.isChatDelayed,
            isChatFollowersOnly: values.isChatFollowersOnly,
        }
        const stream = await prisma.stream.update({
            where:{
                id: selfStream.id,
            },
            data: {
                ...selfStream,
                ...values,
            },
        });

        revalidatePath(`/u/${self.username}/chat`);
        revalidatePath(`/u/${self.username}`);
        revalidatePath(`/${self.username}`);
        return stream;
    }catch{
        throw new Error("Internal Error");
    }
};