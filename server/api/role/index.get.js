/** @format */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const { name, skip, pageSize } = getQuery(event);

  const filters = {};

  if (name && name.trim().length > 0) {
    filters.name = {
      contains: name,
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

  const roleList = await prisma.role.findMany(queryData);

  if (!roleList) {
    throw createError({
      statusCode: 404,
      statusMessage: `Not found`,
    });
  }
  return roleList;
});
