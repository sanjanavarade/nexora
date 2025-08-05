import prisma from "./prisma";

export const getUserByUsername= async(username:string)=>{
    const user= await prisma.user.findUnique({
        where:{
            username,
        },
    });

    return user;
}