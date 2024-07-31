/** @format */

export const useCategory = () => {
  const getListCategory = async (playload: {
    code: any;
    name: any;
    tag: any;
  }) => {
    return await $fetch(`/api/category`, {
      params: {
        code: playload.code,
        name: playload.name,
        tag: playload.tag,
      },
    });
  };
  const getByIDCategory = async (id: any) => {
    return await $fetch(`/api/category/${id}`);
  };
  const addCategory = async (data: any) => {
    return await $fetch(`/api/category`, {
      method: "POST",
      body: data,
    });
  };
  const updateCategory = async (id: any, data: any) => {
    return await $fetch(`/api/category/${id}`, {
      method: "PUT",
      body: data,
    });
  };
  const deleteCategory = async (id: any) => {
    return await $fetch(`/api/category/${id}`, {
      method: "DELETE",
    });
  };
  return {
    getListCategory,
    getByIDCategory,
    addCategory,
    updateCategory,
    deleteCategory,
  };
};
