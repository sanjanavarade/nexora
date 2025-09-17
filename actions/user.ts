"use server"

import type { User } from "@/app/generated/prisma/client";
import {getSelf} from "@/lib/auth-service";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export const updateUser = async(values: Partial<User>)=>{
    
        const self = await getSelf();

        const validData = {
            bio: values.bio,
        }
        const user = await prisma.user.update({
            where: {id: self.id},
            data: {...validData},
        });

        revalidatePath(`/${self.username}`);
        revalidatePath(`/u/${self.username}`);
        return user;

}