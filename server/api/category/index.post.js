/** @format */

import Joi from "joi";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const schema = Joi.object({
  code: Joi.string().allow(""),
  name: Joi.string().allow(""),
  parentId: Joi.number(),
  order: Joi.number(),
  tag: Joi.string().allow(""),
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

  const { code, name, parentId, order, tag } = body;
  const category = await prisma.category.create({
    data: {
      code,
      name,
      parentId,
      order,
      tag,
    },
  });
  return category;
});
