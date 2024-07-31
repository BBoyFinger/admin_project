/** @format */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const { id } = event.context.params;

  const { eventName, apiName, doneByUser, createdDate } = body;
  const updateData = {};
  if (eventName) {
    updateData.eventName = eventName;
  }
  if (apiName) {
    updateData.apiName = apiName;
  }
  if (doneByUser) {
    updateData.doneByUser = doneByUser;
  }
  if (createdDate != undefined && createdDate != null && createdDate != "") {
    updateData.createdDate = new Date(createdDate);
  }

  const eventhistory = await prisma.eventhistory.update({
    where: {
      id: parseInt(id),
    },
    data: updateData,
  });

  if (!eventhistory) {
    throw createError({
      statusCode: 412,
      statusMessage: error.message,
    });
  }

  return eventhistory;
});
