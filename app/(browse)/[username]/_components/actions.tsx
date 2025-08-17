"use client";

import { onBlock, onUnblock } from "@/actions/block";
import { onFollow, onUnfollow } from "@/actions/follow";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useTransition } from "react";
import { toast } from "sonner";

interface ActionsProps {
  isFollowing: boolean;
  userId: string;
  username: string;
}

export const Actions = ({ isFollowing: initialIsFollowing, username }: ActionsProps) => {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [isPending, startTrans] = useTransition();

  // Mount pe sync karo, har prop change pe overwrite mat karo
  useEffect(() => {
    setIsFollowing(initialIsFollowing);
  }, [initialIsFollowing]);

  const handleFollow = () => {
    startTrans(() => {
      onFollow(username)
        .then((data) => {
          setIsFollowing(true);
          toast.success(`You are now following ${data.following.username}`);
        })
        .catch(() => toast.error("Something went wrong"));
    });
  };

  const handleUnfollow = () => {
    startTrans(() => {
      onUnfollow(username)
        .then((data) => {
          setIsFollowing(false);
          toast.success(`You have unfollowed ${data.following.username}`);
        })
        .catch(() => toast.error("Something went wrong"));
    });
  };

  const onClick = () => {
    if (isFollowing) {
      handleUnfollow();
    } else {
      handleFollow();
    }
  };

  const handleBlock = () => {
    startTrans(() => {
      onBlock(username)
        .then((data) => toast.success(`Blocked the user ${data.blocked.username}`))
        .catch(() => toast.error("Something went wrong"));
    });
  };

  return (
    <>
      <Button disabled={isPending} onClick={onClick} variant="primary">
        {isFollowing ? "Unfollow" : "Follow"}
      </Button>
      <Button onClick={handleBlock} disabled={isPending}>
        Block
      </Button>
    </>
  );
};
