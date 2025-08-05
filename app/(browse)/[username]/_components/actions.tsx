"use client"

import { onFollow, onUnfollow } from "@/actions/follow";
import { Button } from "@/components/ui/button"
import { startTransition, useTransition } from "react";
import { toast } from "sonner";

interface ActionsProps{
    isFollowing:boolean;
    userId: string;
};


export const Actions=({
    isFollowing,
    userId
}:ActionsProps) =>{
    const [isPending, startTransition]=useTransition();

    const handleFollow=()=>{
        startTransition(()=>{
            onFollow("123")
            .then((data)=>toast.success(`You are now following ${data.following.username}`))
            .catch(()=>toast.error("Something went wrong"));
        })
       
    }
    const handleUnfollow=()=>{
        startTransition(()=>{
            onUnfollow("123")
            .then((data)=>toast.success(`You have unfollowed ${data.following.username}`))
            .catch(()=>toast.error("Something went wrong"));
        })
       
    }
    const onClick=()=>{
        if(isFollowing){
            handleFollow();
        }else{
            handleUnfollow();
        }
    }

    return (
        <Button 
        disabled={ isPending}
         onClick={onClick}
          variant={"primary"}
        >
            {isFollowing ? "Unfollow":"Follow"}
        </Button>
    )
}
