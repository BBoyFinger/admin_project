/** @format */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const { tourCode, payStatus, tourLeadId, tourLeadName, skip, pageSize } =
    getQuery(event);

  const filters = {};

  if (tourCode && tourCode.trim().length > 0) {
    filters.tourCode = {
      contains: tourCode,
    };
  }
  if (parseInt(payStatus) > 0) {
    filters.payStatus = {
      equals: parseInt(payStatus),
    };
  }
  if (parseInt(tourLeadId) > 0) {
    filters.tourLeadId = {
      equals: parseInt(tourLeadId),
    };
  }
  if (tourLeadName && tourLeadName.trim().length > 0) {
    filters.tourLeadName = {
      contains: tourLeadName,
    };
  }

  const queryData = {
    where: filters,
    orderBy: {
      id: "desc",
    },
    skip: skip ? parseInt(skip) : undefined,
    take: pageSize ? parseInt(pageSize) : undefined,
    include: {
      tourlead: true,
    },
  };

  const tourinfoList = await prisma.tourinfo.findMany(queryData);

  if (!tourinfoList) {
    throw createError({
      statusCode: 404,
      statusMessage: `Not found`,
    });
  }
  return tourinfoList;
});
