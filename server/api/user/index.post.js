/** @format */

import Joi from "joi";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const schema = Joi.object({
  fullname: Joi.string().required(),
  email: Joi.string().required(),
  phone: Joi.string().allow(""),
  roleName: Joi.string().allow(""),
  roleId: Joi.number(),
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

  const { fullname, email, phone, roleName, roleId } = body;
  const user = await prisma.user.create({
    data: {
      fullname,
      email,
      phone,
      roleName,
      roleId,
    },
  });
  return user;
});
