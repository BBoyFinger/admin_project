/** @format */

import Joi from "joi";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const schema = Joi.object({
  tourCode: Joi.string().allow(""),
  arriveDate: Joi.date(),
  returnDate: Joi.date(),
  comTotal: Joi.number(),
  payStatus: Joi.number(),
  paidDate: Joi.date(),
  tourLeadId: Joi.number(),
  tourLeadName: Joi.string().allow(""),
  tourists: Joi.string().allow(""),
  transactions: Joi.string().allow(""),
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
    tourCode,
    arriveDate,
    returnDate,
    comTotal,
    payStatus,
    paidDate,
    tourLeadId,
    tourLeadName,
    tourists,
    transactions,
  } = body;
  const tourinfo = await prisma.tourinfo.create({
    data: {
      tourCode,
      arriveDate: arriveDate ? new Date(arriveDate) : null,
      returnDate: returnDate ? new Date(returnDate) : null,
      comTotal,
      payStatus,
      paidDate: paidDate ? new Date(paidDate) : null,
      tourLeadId,
      tourLeadName,
      tourists,
      transactions,
    },
  });
  return tourinfo;
});
