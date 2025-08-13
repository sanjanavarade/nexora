"use client";

import { Switch } from '@/components/ui/switch';
import React from 'react'
import {toast} from 'sonner';
import { useTransition } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { updateStream } from '@/actions/stream';
import { start } from 'repl';

type FieldTypes= "isChatEnabled" | "isChatDelayed" | "isChatFollowersOnly";

interface ToggleCardProps {
    label: string;
    value: boolean;
    field: FieldTypes;
}

const ToggleCard = ({
    label,
    value=false,
    field,
}:ToggleCardProps) => {
    const [isPending, startTransition] = useTransition();

    const onChange =  ()=>{
        startTransition( () => {
            updateStream({ [field]:!value })
            .then(() => {
                toast.success("Stream updated successfully");
            })
            .catch((error) => {
                toast.error("something went wrong");
            });

            
        })
    }



  return (
    <div className='rounded-xl bg-muted p-6'>
       <div className='flex items-center justify-between'>
        <p className='font-semibold shrink-0'>
            {label}
        </p>
        <div className='space-y-2'>
            <Switch
                onCheckedChange={onChange}
                disabled={isPending}
                checked={value}>
                    {value ? "On" : "Off"}
            </Switch>
        </div>
       </div>
    </div>
  )
}

export default ToggleCard

export const ToggleCardSkeleton = () => {
    return(
        <Skeleton className='rounded-xl p-10 w-full' />
    )
}
