/** @format */

export const useUser = () => {
  const getListUser = async (playload: {
    fullname: any;
    email: any;
    roleName: any;
    roleId: any;
  }) => {
    return await $fetch(`/api/user`, {
      params: {
        fullname: playload.fullname,
        email: playload.email,
        roleName: playload.roleName,
        roleId: playload.roleId,
      },
    });
  };
  const getByUserID = async (id: any) => {
    return await $fetch(`/api/user/${id}`);
  };
  const addUser = async (data: any) => {
    return await $fetch(`/api/user`, {
      method: "POST",
      body: data,
    });
  };
  const updateUser = async (id: any, data: any) => {
    return await $fetch(`/api/user/${id}`, {
      method: "PUT",
      body: data,
    });
  };
  const deleteUser = async (id: any) => {
    return await $fetch(`/api/user/${id}`, {
      method: "DELETE",
    });
  };
  return {
    getListUser,
    getByUserID,
    addUser,
    updateUser,
    deleteUser,
  };
};
