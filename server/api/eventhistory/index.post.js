/** @format */

import Joi from "joi";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const schema = Joi.object({
  eventName: Joi.string().allow(""),
  apiName: Joi.string().allow(""),
  doneByUser: Joi.number(),
  createdDate: Joi.date(),
});

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const { error, value } = schema.validate(body);

  if (error) {
    throw createError({
      statusCode: 412,
      statusMessage: error.message,
    });
  }

  const { eventName, apiName, doneByUser, createdDate } = body;
  const eventhistory = await prisma.eventhistory.create({
    data: {
      eventName,
      apiName,
      doneByUser,
      createdDate: createdDate ? new Date(createdDate) : null,
    },
  });
  return eventhistory;
});
