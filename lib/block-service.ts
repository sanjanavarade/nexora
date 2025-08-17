import prisma from "@/lib/prisma";
import { getSelf } from "@/lib/auth-service";

export const blockUser = async (id: string) => {
  const self = await getSelf();

  if (self.id === id) {
    throw new Error("You cannot block yourself");
  }

  const otherUser = await prisma.user.findUnique({ where: { id } });

  if (!otherUser) {
    throw new Error("User not found");
  }

  // Using composite unique key for findUnique
  const existingBlock = await prisma.block.findUnique({
    where: {
      blockerId_blockedId: {
        blockerId: self.id,
        blockedId: otherUser.id,
      },
    },
  });

  if (existingBlock) {
    throw new Error("You have already blocked this user");
  }

  const block = await prisma.block.create({
    data: {
      blockerId: self.id,
      blockedId: otherUser.id,
    },
    include: {
      blocked: true,
    },
  });

  return block;
};

export const unblockUser = async (id: string) => {
  const self = await getSelf();

  if (self.id === id) {
    throw new Error("You cannot unblock yourself");
  }

  const otherUser = await prisma.user.findUnique({ where: { id } });

  if (!otherUser) {
    throw new Error("User not found");
  }

  const existingBlock = await prisma.block.findUnique({
    where: {
      blockerId_blockedId: {
        blockerId: self.id,
        blockedId: otherUser.id,
      },
    },
  });

  if (!existingBlock) {
    throw new Error("You have not blocked this user");
  }

  const unblock = await prisma.block.delete({
    where: { id: existingBlock.id },
    include: { blocked: true },
  });

  return unblock;
};
export const isBlockedByUser = async (userId: string) => {
  const self = await getSelf();

  const block = await prisma.block.findUnique({
    where: {
      blockerId_blockedId: {
        blockerId: self.id,   // ✅ actual ID of logged in user
        blockedId: userId,    // ✅ the other user
      },
    },
  });

  return !!block;
};
