/** @format */

export const useComrule = () => {
  const getListComrule = async (playload: {
    applyTo: any;
    targetName: any;
    comType: any;
  }) => {
    return await $fetch(`/api/comrule`, {
      params: {
        applyTo: playload.applyTo,
        targetName: playload.targetName,
        comType: playload.comType,
      },
    });
  };
  const getByIDCategory = async (id: any) => {
    return await $fetch(`/api/comrule/${id}`);
  };
  const addComrule = async (data: any) => {
    return await $fetch(`/api/comrule`, {
      method: "POST",
      body: data,
    });
  };
  const updateComrule = async (id: any, data: any) => {
    return await $fetch(`/api/comrule/${id}`, {
      method: "PUT",
      body: data,
    });
  };
  const deleteComrule = async (id: any) => {
    return await $fetch(`/api/comrule/${id}`, {
      method: "DELETE",
    });
  };
  return {
    getListComrule,
    getByIDCategory,
    addComrule,
    updateComrule,
    deleteComrule,
  };
};
