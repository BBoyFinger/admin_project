/** @format */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const { fullname, email, roleName, roleId, skip, pageSize } = getQuery(event);

  const filters = {};

  if (fullname && fullname.trim().length > 0) {
    filters.fullname = {
      contains: fullname,
    };
  }
  if (email && email.trim().length > 0) {
    filters.email = {
      contains: email,
    };
  }
  if (roleName && roleName.trim().length > 0) {
    filters.roleName = {
      contains: roleName,
    };
  }
  if (parseInt(roleId) > 0) {
    filters.roleId = {
      equals: parseInt(roleId),
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
      role: true,
    },
  };

  const userList = await prisma.user.findMany(queryData);

  if (!userList) {
    throw createError({
      statusCode: 404,
      statusMessage: `Not found`,
    });
  }
  return userList;
});
