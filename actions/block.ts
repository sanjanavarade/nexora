"use server"

import { blockUser, unblockUser } from "@/lib/block-service";
import { revalidatePath } from "next/cache";

export const onBlock = async (username: string) => {
  const blockedUser = await blockUser(username);
  revalidatePath("/");
  if (blockedUser) {
    revalidatePath(`/${blockedUser.blocked.username}`);
  }
  return blockedUser;
};

export const onUnblock = async (username: string) => {
  const unblockedUser = await unblockUser(username);
  revalidatePath("/");
  if (unblockedUser) {
    revalidatePath(`/${unblockedUser.blocked.username}`);
  }
  return unblockedUser;
};
