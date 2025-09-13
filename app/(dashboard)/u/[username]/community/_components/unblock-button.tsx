"use client"

import { onUnblock } from "@/actions/block";
import { Button } from "@/components/ui/button";
import { useTransition } from "react";
import { toast } from "sonner";

interface UnblockButtonProps{
    userId: string;
};

export const UnblockButton =({
    userId,
}:UnblockButtonProps)=>{
    const [isPending, stratTransition] = useTransition();

    const onClick = () =>{
        stratTransition(() => {
            onUnblock(userId)
            .then((result)=> toast.success(`user ${result.blocked.username} unblocked`))
            .catch(() => toast.error("Something went wrong"))
        })
    };
    return(
        <Button
         disabled={isPending}
         onClick={onClick}
         variant="link"
         size="sm"
         className="text-blue-500 w-full"
        >
            Unblock
        </Button>
    )
};
