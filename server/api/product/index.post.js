/** @format */

import Joi from "joi";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const schema = Joi.object({
  code: Joi.string().allow(""),
  name: Joi.string().allow(""),
  cateId: Joi.number(),
  thumbnail: Joi.string().allow(""),
  taxType: Joi.number(),
  price: Joi.number(),
  memberPrice: Joi.number(),
  tag: Joi.string().allow(""),
  groupId: Joi.number(),
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

  const {
    code,
    name,
    cateId,
    thumbnail,
    taxType,
    price,
    memberPrice,
    tag,
    groupId,
    createdDate,
  } = body;
  const product = await prisma.product.create({
    data: {
      code,
      name,
      cateId,
      thumbnail,
      taxType,
      price,
      memberPrice,
      tag,
      groupId,
      createdDate: createdDate ? new Date(createdDate) : null,
    },
  });
  return product;
});
