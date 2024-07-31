/** @format */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const { code, name, cateId, groupId, taxType, skip, pageSize } =
    getQuery(event);

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
  if (parseInt(cateId) > 0) {
    filters.cateId = {
      equals: parseInt(cateId),
    };
  }
  if (parseInt(groupId) > 0) {
    filters.groupId = {
      equals: parseInt(groupId),
    };
  }
  if (parseInt(taxType) > 0) {
    filters.taxType = {
      equals: parseInt(taxType),
    };
  }

  const queryData = {
    where: filters,
    orderBy: {
      id: "desc",
    },
    skip: skip ? parseInt(skip) : undefined,
    take: pageSize ? parseInt(pageSize) : undefined,
    include: {
      category: true,
    },
  };

  const productList = await prisma.product.findMany(queryData);

  if (!productList) {
    throw createError({
      statusCode: 404,
      statusMessage: `Not found`,
    });
  }
  return productList;
});
