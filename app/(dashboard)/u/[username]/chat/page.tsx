import { getSelf } from '@/lib/auth-service';
import { getStreamByUserId } from '@/lib/stream-service';
import React from 'react'
import ToggleCard from './_components/toggle-card';

const ChatPage =async  () => {

    const self = await getSelf();
    const stream = await getStreamByUserId(self.id);
    if (!stream) {
        throw new Error("Stream not found");
    }

  return (
    <div className="p-6">
        <div>
            <h1 className="text-3xl font-bold">
                Chat Setting
            </h1>
        </div>
        <div className='space-y-4'>
            <ToggleCard
               label="Enable Chat"
                value={stream.isChatEnabled}
                field="isChatEnabled"
                
            />
            <ToggleCard
               label="Delay Chat"
                value={stream.isChatDelayed}
                field="isChatDelayed"
                
            />
            <ToggleCard
               label="Must be following Chat"
                value={stream.isChatFollowersOnly}
                field="isChatFollowersOnly"
                
            />
        </div>
    </div>
  )
}

export default ChatPage
