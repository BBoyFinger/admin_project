/** @format */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const { eventName, doneByUser, skip, pageSize } = getQuery(event);

  const filters = {};

  if (eventName && eventName.trim().length > 0) {
    filters.eventName = {
      contains: eventName,
    };
  }
  if (parseInt(doneByUser) > 0) {
    filters.doneByUser = {
      equals: parseInt(doneByUser),
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
      createdByUser: true,
    },
  };

  const eventhistoryList = await prisma.eventhistory.findMany(queryData);

  if (!eventhistoryList) {
    throw createError({
      statusCode: 404,
      statusMessage: `Not found`,
    });
  }
  return eventhistoryList;
});
