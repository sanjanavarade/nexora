import React from 'react'
import CopyButton from './copy-button';
import { Input } from '@/components/ui/input';

interface UrlCardProps {
  value: string|null;
}

const UrlCard = ({
    value,
}:UrlCardProps) => {
  return (
    <div className='rounded-xl bg-muted p-6'>
      <div className='flex items-center gap-x-10'>
        <p className='font-semibold shrink-0'>
            server Url
        </p>
        <div className='space-y-2 w-full'>
            <div className='w-full flex items-center gap-x-2'>
                <Input
                  value={value || ''}
                  disabled
                  placeholder='Server Url'
                />
                <CopyButton
                    value={value || ''}
                    
                
                />
            </div>
        </div>

      </div>
    </div>
  )
}

export default UrlCard
