"use client"

import { onBlock } from '@/actions/block';
import { stringToColor, cn } from '@/lib/utils';
import { MinusCircle } from 'lucide-react';
import React, { startTransition } from 'react'
import { toast } from 'sonner';
import { Hint } from '../hint';
import { Button } from '../ui/button';
interface CommunityItemProps{
    hostName:string;
    viewerName:string;
    participantName?:string;
    participantIdentity: string;
}

const CommunityItem = ({
    hostName,
    viewerName,
    participantName,
    participantIdentity,
}: CommunityItemProps) => {
    const isPending = false; // Define isPending with a default value or logic
    const color = stringToColor(participantName || "");

    const isSelf = participantName === viewerName;
    const isHost = viewerName === hostName;

    const handleBlock=()=>{
        if(!participantName || isSelf || !isHost) return;

        startTransition(()=>{
            onBlock(participantIdentity)
             .then(() => toast.success(`Blocked ${participantName}`))
             .catch(()=> toast.error("Something went wrong"));
        });
    }

  return (
    <div className={cn(
        "group flex items-center justify-between w-full p-2 rounded-md text-sm hover:bg-white/5",
        isPending && "opacity-50 pointer-events-none"
    )}>
        <p style={{color: color}}>
            {participantName}
        </p>
        {isHost && !isSelf && (
            <Hint label="Block">
                <Button 
                disabled={isPending}
                onClick={handleBlock}
                className="h-auto w-auto p-1 opacity-0 group-hover:opacity-100 transition">
                    <MinusCircle className='h-4 w-4 text-muteed-foreground'/>
                </Button>
            </Hint>
        )}
      
    </div>
  )
}

export default CommunityItem
