/** @format */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const { id } = event.context.params;

  const user = await prisma.user.delete({
    where: {
      id: parseInt(id),
    },
  });

  if (!user) {
    throw createError({
      statusCode: 404,
      statusMessage: `User with ID of ${id} not found`,
    });
  }
  return user;
});
