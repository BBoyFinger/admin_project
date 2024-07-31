/** @format */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const { id } = event.context.params;

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
  const updateData = {};
  if (code) {
    updateData.code = code;
  }
  if (name) {
    updateData.name = name;
  }
  if (cateId) {
    updateData.cateId = cateId;
  }
  if (thumbnail) {
    updateData.thumbnail = thumbnail;
  }
  if (taxType) {
    updateData.taxType = taxType;
  }
  if (price) {
    updateData.price = price;
  }
  if (memberPrice) {
    updateData.memberPrice = memberPrice;
  }
  if (tag) {
    updateData.tag = tag;
  }
  if (groupId) {
    updateData.groupId = groupId;
  }
  if (createdDate != undefined && createdDate != null && createdDate != "") {
    updateData.createdDate = new Date(createdDate);
  }

  const product = await prisma.product.update({
    where: {
      id: parseInt(id),
    },
    data: updateData,
  });

  if (!product) {
    throw createError({
      statusCode: 412,
      statusMessage: error.message,
    });
  }

  return product;
});
