/** @format */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const { id } = event.context.params;

  const tourinfo = await prisma.tourinfo.findUnique({
    where: {
      id: parseInt(id),
    },
  });
  if (!tourinfo) {
    throw createError({
      statusCode: 404,
      statusMessage: `Tourinfo with ID of ${id} not found`,
    });
  }
  return tourinfo;
});
