/** @format */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const { id } = event.context.params;

  const { fullname, email, phone, roleName, roleId } = body;
  const updateData = {};
  if (fullname) {
    updateData.fullname = fullname;
  }
  if (email) {
    updateData.email = email;
  }
  if (phone) {
    updateData.phone = phone;
  }
  if (roleName) {
    updateData.roleName = roleName;
  }
  if (roleId) {
    updateData.roleId = roleId;
  }

  const user = await prisma.user.update({
    where: {
      id: parseInt(id),
    },
    data: updateData,
  });

  if (!user) {
    throw createError({
      statusCode: 412,
      statusMessage: error.message,
    });
  }

  return user;
});
