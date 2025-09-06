"use client"

import { onFollow } from "@/actions/follow";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@clerk/nextjs";
import { Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import { Skeleton } from "../ui/skeleton";

interface ActionsProps{
    isFollowing: boolean;
    isHost: boolean;
    hostIdentity: string;
}

const Actions = ({
    isFollowing,
    isHost,
    hostIdentity
}:ActionsProps) => {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();
    const { userId }= useAuth();

    const handleFollow = () =>{
        startTransition(()=>{
            onFollow(hostIdentity)
            .then((data) => toast.success(`You are now following ${data.following.username}`))
            .catch((error) => toast.error(error?.message || "Something went wrong"))
        })
    }
    const handleUnFollow = () =>{
        startTransition(()=>{
            onFollow(hostIdentity)
            .then((data) => toast.success(`You have unfollowed ${data.following.username}`))
            .catch((error) => toast.error(error?.message || "Something went wrong"))
        })
    }

    const toggleFollow = () =>{
        if(!userId){
            return router.push("/sign-in");
        }
        if(isHost) return;

        if(isFollowing){
            handleUnFollow();
        }else{
            handleFollow();
        }
    }
    
  return (
    <Button
    disabled={isPending || isHost}
     onClick={toggleFollow}
     variant="primary"
     size="sm"
     className="w-full lg:w-auto"
    >
       <Heart className={cn(
        "h-4 w-4 mr-2",
        isFollowing ? "fill-white": "fill-none"
       )}/>
       {isFollowing ? "Unfollow": "Follow" }
    </Button>
  )
}

export default Actions

export const ActionsSkeleton = () => {
    return(
        <Skeleton className="h=10 w-full lg:w-24"/>
    )
}