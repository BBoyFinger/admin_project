/** @format */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const { id } = event.context.params;

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
  const updateData = {};
  if (applyTo) {
    updateData.applyTo = applyTo;
  }
  if (targetId) {
    updateData.targetId = targetId;
  }
  if (targetName) {
    updateData.targetName = targetName;
  }
  if (smaregiCateId) {
    updateData.smaregiCateId = smaregiCateId;
  }
  if (comType) {
    updateData.comType = comType;
  }
  if (rateValue) {
    updateData.rateValue = rateValue;
  }
  if (atiRateValue) {
    updateData.atiRateValue = atiRateValue;
  }
  if (taxRate) {
    updateData.taxRate = taxRate;
  }
  if (validDate != undefined && validDate != null && validDate != "") {
    updateData.validDate = new Date(validDate);
  }
  if (validTo != undefined && validTo != null && validTo != "") {
    updateData.validTo = new Date(validTo);
  }

  const comrule = await prisma.comrule.update({
    where: {
      id: parseInt(id),
    },
    data: updateData,
  });

  if (!comrule) {
    throw createError({
      statusCode: 412,
      statusMessage: error.message,
    });
  }

  return comrule;
});
