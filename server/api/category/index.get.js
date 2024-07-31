/** @format */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const { code, name, tag, skip, pageSize } = getQuery(event);

  const filters = {};

  if (code && code.trim().length > 0) {
    filters.code = {
      contains: code,
    };
  }
  if (name && name.trim().length > 0) {
    filters.name = {
      contains: name,
    };
  }
  if (tag && tag.trim().length > 0) {
    filters.tag = {
      contains: tag,
    };
  }

  const queryData = {
    where: filters,
    orderBy: {
      id: "desc",
    },
    skip: skip ? parseInt(skip) : undefined,
    take: pageSize ? parseInt(pageSize) : undefined,
    include: {},
  };

  const categoryList = await prisma.category.findMany(queryData);

  if (!categoryList) {
    throw createError({
      statusCode: 404,
      statusMessage: `Not found`,
    });
  }
  return categoryList;
});
