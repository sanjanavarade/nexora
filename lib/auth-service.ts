import { currentUser } from "@clerk/nextjs/server";
import prisma from "./prisma";


export const getSelf = async() => {
    const self = await currentUser();

    if(!self || !self.username){
        throw new Error("Unauthorized");
    }

    const user = await prisma.user.findUnique({
        where: {externalUserId: self.id},
    });

    if(!user){
        throw new Error("Not Found");
    }
    return user;
}

export const getSelfByUsername = async(username:string) =>{
    const self = await currentUser();

    if(!self || !self.username){
        throw new Error("Unauthorized");
    }

    const user = await prisma.user.findUnique({
        where: {username}
    });
    if(!user){
        throw new Error("User Not Found");
    }

    if(self.username !== user.username){
        throw new Error("Unauthorized");
    }
    return user;
}