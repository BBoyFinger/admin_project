/** @format */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const { applyTo, targetName, comType, skip, pageSize } = getQuery(event);

  const filters = {};

  if (parseInt(applyTo) > 0) {
    filters.applyTo = {
      equals: parseInt(applyTo),
    };
  }
  if (targetName && targetName.trim().length > 0) {
    filters.targetName = {
      contains: targetName,
    };
  }
  if (parseInt(comType) > 0) {
    filters.comType = {
      equals: parseInt(comType),
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

  const comruleList = await prisma.comrule.findMany(queryData);

  if (!comruleList) {
    throw createError({
      statusCode: 404,
      statusMessage: `Not found`,
    });
  }
  return comruleList;
});
