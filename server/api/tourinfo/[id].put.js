/** @format */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const { id } = event.context.params;

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
  const updateData = {};
  if (tourCode) {
    updateData.tourCode = tourCode;
  }
  if (arriveDate != undefined && arriveDate != null && arriveDate != "") {
    updateData.arriveDate = new Date(arriveDate);
  }
  if (returnDate != undefined && returnDate != null && returnDate != "") {
    updateData.returnDate = new Date(returnDate);
  }
  if (comTotal) {
    updateData.comTotal = comTotal;
  }
  if (payStatus) {
    updateData.payStatus = payStatus;
  }
  if (paidDate != undefined && paidDate != null && paidDate != "") {
    updateData.paidDate = new Date(paidDate);
  }
  if (tourLeadId) {
    updateData.tourLeadId = tourLeadId;
  }
  if (tourLeadName) {
    updateData.tourLeadName = tourLeadName;
  }
  if (tourists) {
    updateData.tourists = tourists;
  }
  if (transactions) {
    updateData.transactions = transactions;
  }

  const tourinfo = await prisma.tourinfo.update({
    where: {
      id: parseInt(id),
    },
    data: updateData,
  });

  if (!tourinfo) {
    throw createError({
      statusCode: 412,
      statusMessage: error.message,
    });
  }

  return tourinfo;
});
