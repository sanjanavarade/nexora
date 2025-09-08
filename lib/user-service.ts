import prisma from "./prisma";

export const getUserByUsername = async (username: string) => {
  console.log("Fetching user by username:", username);
  const user = await prisma.user.findUnique({
    where: { username },
    include: {
      stream: true,
      _count: {
        select: { followedBy: true },
      },
    },
  });
  console.log("User found:", user);
  return user;
};

export const getUserById = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
    include: {
      stream: true,
    },
  });
  return user;
};
