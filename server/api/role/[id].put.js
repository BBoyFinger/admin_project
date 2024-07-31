/** @format */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const { id } = event.context.params;

  const { name, description } = body;
  const updateData = {};
  if (name) {
    updateData.name = name;
  }
  if (description) {
    updateData.description = description;
  }

  const role = await prisma.role.update({
    where: {
      id: parseInt(id),
    },
    data: updateData,
  });

  if (!role) {
    throw createError({
      statusCode: 412,
      statusMessage: error.message,
    });
  }

  return role;
});
