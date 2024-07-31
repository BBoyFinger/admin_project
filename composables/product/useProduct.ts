/** @format */

export const useProduct = () => {
  const getListProduct = async (playload: {
    code: any;
    name: any;
    cateId: any;
    groupId: any;
    taxType: any;
  }) => {
    return await $fetch(`/api/product`, {
      params: {
        code: playload.code,
        name: playload.name,
        cateId: playload.cateId,
        groupId: playload.groupId,
        taxType: playload.taxType,
      },
    });
  };
  const getByProductID = async (id: any) => {
    return await $fetch(`/api/product/${id}`);
  };
  const addProduct = async (data: any) => {
    return await $fetch(`/api/product`, {
      method: "POST",
      body: data,
    });
  };
  const updateProduct = async (id: any, data: any) => {
    return await $fetch(`/api/product/${id}`, {
      method: "PUT",
      body: data,
    });
  };
  const deleteProduct = async (id: any) => {
    return await $fetch(`/api/product/${id}`, {
      method: "DELETE",
    });
  };
  return {
    getListProduct,
    getByProductID,
    addProduct,
    updateProduct,
    deleteProduct,
  };
};
