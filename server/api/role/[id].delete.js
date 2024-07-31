/** @format */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const { id } = event.context.params;

  const role = await prisma.role.delete({
    where: {
      id: parseInt(id),
    },
  });

  if (!role) {
    throw createError({
      statusCode: 404,
      statusMessage: `Role with ID of ${id} not found`,
    });
  }
  return role;
});
