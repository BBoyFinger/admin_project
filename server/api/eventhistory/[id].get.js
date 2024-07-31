/** @format */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const { id } = event.context.params;

  const eventhistory = await prisma.eventhistory.findUnique({
    where: {
      id: parseInt(id),
    },
  });
  if (!eventhistory) {
    throw createError({
      statusCode: 404,
      statusMessage: `Eventhistory with ID of ${id} not found`,
    });
  }
  return eventhistory;
});
