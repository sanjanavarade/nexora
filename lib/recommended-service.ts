
import {getSelf} from "@/lib/auth-service"
import prisma from "./prisma";

export const getRecommended = async () =>{
    let userId;
    try{
        const self = await getSelf();
        userId =self.id;
    }catch{
        userId=null;
    }
    let users =[];
    if(userId){
        users = await prisma.user.findMany({
            where:{
                AND:[{
                    NOT: {
                        id: userId,
                    },
                },
                {
                    NOT :{
                        followedBy:{
                            some:{
                                followerId:userId,
                            },
                        },
                    },
                },
                {
                    NOT :{
                        blocking:{
                            some:{
                                blockedId:userId,
                            }
                        }
                    }
                }
            ],
            },
            orderBy:{
                createdAt:"desc"
            }
        })
    }else{
        users=await prisma.user.findMany({
            orderBy:{
                createdAt:"desc"
            },
        });
    }

   // await new Promise(resolve => setTimeout(resolve,2000));
    users = await prisma.user.findMany({
        orderBy: {
            createdAt : "desc"
        },
    });

    return users;
}