/** @format */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const { id } = event.context.params;

  const { code, name, parentId, order, tag } = body;
  const updateData = {};
  if (code) {
    updateData.code = code;
  }
  if (name) {
    updateData.name = name;
  }
  if (parentId) {
    updateData.parentId = parentId;
  }
  if (order) {
    updateData.order = order;
  }
  if (tag) {
    updateData.tag = tag;
  }

  const category = await prisma.category.update({
    where: {
      id: parseInt(id),
    },
    data: updateData,
  });

  if (!category) {
    throw createError({
      statusCode: 412,
      statusMessage: error.message,
    });
  }

  return category;
});
