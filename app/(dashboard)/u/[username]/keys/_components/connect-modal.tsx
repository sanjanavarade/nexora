"use client"

import { Alert, AlertDescription, AlertTitle
} from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogTrigger,
    DialogClose,
} from '@/components/ui/dialog';
import {createIngress} from '@/actions/ingress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertTriangle } from 'lucide-react';
import { IngressInput } from 'livekit-server-sdk';
import React, { startTransition, useState, useTransition,useRef, ElementRef } from 'react'
import { toast } from 'sonner';

const RTMP = String(IngressInput.RTMP_INPUT);
const WHIP = String(IngressInput.WHIP_INPUT);

type IngressType = typeof RTMP | typeof WHIP;

const ConnectModal = () => {
    const closeRef = useRef<ElementRef<"button">>(null);
    const [ingressType, setIngressType] = useState<IngressType>(RTMP);
    const [isPending, setTransition] = useTransition();

    const onSubmit =()=>{
        startTransition(()=>{
            createIngress(parseInt(ingressType))
            .then(()=>{toast.success("Ingress created successfully")
                closeRef.current?.click();
            })
            .catch(()=>toast.error("Failed to create ingress"));
     } );
     }
    

  return (
    <Dialog>
        <DialogTrigger asChild>
            <Button variant='primary'>Generate connection</Button>
        </DialogTrigger>
        <DialogContent>
            <DialogHeader>
            <DialogTitle>Generate Connection to Stream</DialogTitle>
            

            </DialogHeader>
            <Select
            disabled={isPending}
                value={ingressType}
                onValueChange={(value) => setIngressType(value as IngressType)}
                
            >
                <SelectTrigger className='w-full'>
                    <SelectValue placeholder='Ingress type' />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value={RTMP}>RTMP</SelectItem>
                    <SelectItem value={WHIP}>WHIP</SelectItem>
                    
                </SelectContent>
            </Select>
            <Alert>
                <AlertTriangle className='h-4 w-4'/>
                <AlertTitle> Warning!</AlertTitle>
                <AlertDescription>
                    This action will reset all active streams using the current connection.
                </AlertDescription>
            </Alert>
            <div className='flex justify-between'>
                <DialogClose ref={closeRef} asChild>
                    <Button variant='ghost'>Cancel</Button>
                </DialogClose>
                <Button onClick={onSubmit} disabled={isPending} variant='primary'>
                    Generate
                </Button>
            </div>
        </DialogContent>
    </Dialog>
  )
}

export default ConnectModal
