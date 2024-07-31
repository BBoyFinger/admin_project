/** @format */

export const useTourinfo = () => {
  const getListTourinfo = async (playload: {
    tourCode: any;
    payStatus: any;
    tourLeadId: any;
    tourLeadName: any;
  }) => {
    return await $fetch(`/api/tourinfo`, {
      params: {
        tourCode: playload.tourCode,
        payStatus: playload.payStatus,
        tourLeadId: playload.tourLeadId,
        tourLeadName: playload.tourLeadName,
      },
    });
  };
  const getByTourinfoId = async (id: any) => {
    return await $fetch(`/api/tourinfo/${id}`);
  };
  const addTourinfo = async (data: any) => {
    return await $fetch(`/api/tourinfo`, {
      method: "POST",
      body: data,
    });
  };
  const updateTourinfo = async (id: any, data: any) => {
    return await $fetch(`/api/tourinfo/${id}`, {
      method: "PUT",
      body: data,
    });
  };
  const deleteTourinfo = async (id: any) => {
    return await $fetch(`/api/tourinfo/${id}`, {
      method: "DELETE",
    });
  };
  return {
    getListTourinfo,
    getByTourinfoId,
    addTourinfo,
    updateTourinfo,
    deleteTourinfo,
  };
};
