"use server"

import { getStreams } from '@/lib/feed-service';
import React from 'react'
import { ResultCard, ResultCardSkeleton } from './result-card';
import { Skeleton } from '@/components/ui/skeleton';


export const Results= async () => {
  const data = await getStreams();

  return (
    <div>
      <h2 className='text-lg font-semibold mb-4'>
        Streams we think you'll like
      </h2>
      {data.length ===0 &&(
        <div className='text-muted-foreground text-sm'>
        No streams found.
        </div>
      )}
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4'>
        {data.map((result) => (
            <ResultCard
              key={result.id}
              data = {result}
            
            />
        ))}
      </div>
      
    </div>
  )
}

export const ResultsSkeleton = () =>{
    return(
        <div>
            <Skeleton className='h-8 w-[290px] mb-4'/>
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4'>
                {[...Array(4)].map((_, i)=>(
                    <ResultCardSkeleton key={i}/>
                ))}
            </div>

        </div>
    )
}
