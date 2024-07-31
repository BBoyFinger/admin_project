/** @format */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const { id } = event.context.params;

  const comrule = await prisma.comrule.findUnique({
    where: {
      id: parseInt(id),
    },
  });
  if (!comrule) {
    throw createError({
      statusCode: 404,
      statusMessage: `Comrule with ID of ${id} not found`,
    });
  }
  return comrule;
});
