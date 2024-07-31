/** @format */

export const useEventhistory = () => {
  const getListEventhistory = async (playload: {
    eventName: any;
    doneByUser: any;
  }) => {
    return await $fetch(`/api/eventhistory`, {
      params: {
        eventName: playload.eventName,
        doneByUser: playload.doneByUser,
      },
    });
  };
  const getByEventhistoryId = async (id: any) => {
    return await $fetch(`/api/eventhistory/${id}`);
  };
  const addEventhistory = async (data: any) => {
    return await $fetch(`/api/eventhistory`, {
      method: "POST",
      body: data,
    });
  };
  const updateEventhistory = async (id: any, data: any) => {
    return await $fetch(`/api/eventhistory/${id}`, {
      method: "PUT",
      body: data,
    });
  };
  const deleteEventhistory = async (id: any) => {
    return await $fetch(`/api/eventhistory/${id}`, {
      method: "DELETE",
    });
  };
  return {
    getListEventhistory,
    getByEventhistoryId,
    addEventhistory,
    updateEventhistory,
    deleteEventhistory,
  };
};
