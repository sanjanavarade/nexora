"use client"

import { Follow, User } from "@/app/generated/prisma/client";
import { useSidebar } from "@/store/use-sidebar";
import UserItem, { UserItemSkeleton } from "./user-item";

interface FollowingProps{
    data:(Follow & {following: User})[];

}

export const Following=({
  data,

}:FollowingProps)=>{
    const { collapsed } = useSidebar((state)=> state);

    if(!data.length){
        return null;
    }

    return (
        <div >
            {!collapsed && (
                <div className="pl-6 mb-4">
                    <p className="text-sm text-muted-foreground">
                        following
                    </p>
                </div>
            )}
            <ul>
                {data.map((follow)=>(
                    <UserItem
                     key={follow.following.id}
                     username={follow.following.username}
                     imageUrl={follow.following.imageUrl}
                     isLive={true}
                    />
                ))}
            </ul>
        </div>
    );
};

export const FollowingSkeleton=()=>{
    return (
        <ul>
            {[...Array(3)].map((_,i)=>(
                <UserItemSkeleton key={i} />
            ))}
        </ul>
    )
}