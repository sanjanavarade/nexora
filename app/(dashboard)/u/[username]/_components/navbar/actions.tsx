import { Button } from '@/components/ui/button';
import { SignInButton, UserButton } from '@clerk/nextjs';
import { currentUser } from '@clerk/nextjs/server'
import { Clapperboard, LogOut, User } from 'lucide-react';
import Link from 'next/link';
import React from 'react'

const Actions =  () => {
    const user =  currentUser();
  return (
    <div className='flex items-center gap-x-2 justify-end'>
        <Button
         size="sm"
         variant = "ghost"
         className='text-muted-foreground hover:text-primary'
         asChild
        >
            <Link href="/">
             <LogOut  className='h-5 w-5 mr-2'/>
             Exit
            </Link>
        </Button>
        <UserButton
          afterSignOutUrl="/"
        />

    </div>
  )
}

export default Actions
