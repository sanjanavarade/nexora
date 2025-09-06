import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { getSelf } from "@/lib/auth-service";
import  prisma  from "@/lib/prisma";

const f = createUploadthing();

export const ourFileRouter = {
  thumbnailUploader: f({
    image: {
        maxFileSize: "4MB",
        maxFileCount: 1
    }
  })
    .middleware(async() =>{
        const self = await getSelf();

        return {user: self};
    })
    .onUploadComplete(async({metadata, file})=>{
        await prisma.stream.update({
            where:{
                userId: metadata.user.id,
            },
            data:{
                thumbnailUrl: file.url,
            }
        });
        return {fileUrl: file.url};
    })
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
