import React from 'react';
import { columns } from './_components/columns';
import { DataTable } from './_components/data-table';
import { getBlockedUsers } from '@/lib/block-service';
import { format } from 'date-fns';

const CommunityPage = async () => {
  const blockedUsers = await getBlockedUsers();

  const formattedData = blockedUsers.map((block) => ({
    id: block.blocked.id,               // required 'id' prop
    userid: block.blocked.id,           // required 'userid' prop
    userId: block.blocked.id,           // keep if used elsewhere
    imageUrl: block.blocked.imageUrl,
    username: block.blocked.username,
    createdAt: format(new Date(block.blocked.createdAt), "dd/MM/yyyy"), // correct the property name
  }));

  return (
    <div className='p-6'>
      <div className='mb-4'>
        <h1 className='text-2xl font-bold'>Community Setting</h1>
      </div>
      <DataTable columns={columns} data={formattedData} />
    </div>
  );
};

export default CommunityPage;
