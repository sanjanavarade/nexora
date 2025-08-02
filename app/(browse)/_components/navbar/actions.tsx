import { Button } from '@/components/ui/button';
import { SignInButton, UserButton } from '@clerk/nextjs';
import { currentUser } from '@clerk/nextjs/server'
import { Clapperboard, User } from 'lucide-react';
import Link from 'next/link';
import React from 'react'

const Actions = async () => {
    const user = await currentUser();
  return (
    <div className='flex items-center gap--x-2 justify-end ml-4 lg:ml-0'>
        {!user && (
            <SignInButton>
                <Button
                size="sm" variant = "primary"
                >
                    Login
                </Button>
            </SignInButton>
        )}
        {!!user && (
            <div className='flex items-center gap-x-4'>
                <Button
                size='sm'
                variant='ghost'
                className='text-muted-foreground hover:text-primary'
                asChild
                >
                    <Link href={`/u/${user.username}`}>
                    <Clapperboard className='h-5 w-5 lg:mr-2'/>
                    <span  className='hidden lg:block'>
                        DashBoard
                    </span>
                    
                    </Link>
                </Button>
                <UserButton
                  afterSignOutUrl="/"
                />
            </div>
        )
        }
    </div>
  )
}

export default Actions
