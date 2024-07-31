/** @format */

import Joi from "joi";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const schema = Joi.object({
  applyTo: Joi.number().required(),
  targetId: Joi.number(),
  targetName: Joi.string().allow(""),
  smaregiCateId: Joi.number(),
  comType: Joi.number(),
  rateValue: Joi.number(),
  atiRateValue: Joi.number(),
  taxRate: Joi.number(),
  validDate: Joi.date(),
  validTo: Joi.date(),
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
    applyTo,
    targetId,
    targetName,
    smaregiCateId,
    comType,
    rateValue,
    atiRateValue,
    taxRate,
    validDate,
    validTo,
  } = body;
  const comrule = await prisma.comrule.create({
    data: {
      applyTo,
      targetId,
      targetName,
      smaregiCateId,
      comType,
      rateValue,
      atiRateValue,
      taxRate,
      validDate: validDate ? new Date(validDate) : null,
      validTo: validTo ? new Date(validTo) : null,
    },
  });
  return comrule;
});
