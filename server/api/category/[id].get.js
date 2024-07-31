/** @format */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const { id } = event.context.params;

  const category = await prisma.category.findUnique({
    where: {
      id: parseInt(id),
    },
  });
  if (!category) {
    throw createError({
      statusCode: 404,
      statusMessage: `Category with ID of ${id} not found`,
    });
  }
  return category;
});
