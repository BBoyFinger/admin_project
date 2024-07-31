/** @format */

export const useRole = () => {
  const getListRole = async (playload: { name: any }) => {
    return await $fetch(`/api/role`, {
      params: {
        name: playload.name,
      },
    });
  };
  const getByRoleID = async (id: any) => {
    return await $fetch(`/api/role/${id}`);
  };
  const addRole = async (data: any) => {
    return await $fetch(`/api/role`, {
      method: "POST",
      body: data,
    });
  };
  const updateRole = async (id: any, data: any) => {
    return await $fetch(`/api/role/${id}`, {
      method: "PUT",
      body: data,
    });
  };
  const deleteRole = async (id: any) => {
    return await $fetch(`/api/role/${id}`, {
      method: "DELETE",
    });
  };
  return {
    getListRole,
    getByRoleID,
    addRole,
    updateRole,
    deleteRole,
  };
};
