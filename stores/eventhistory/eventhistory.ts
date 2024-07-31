/** @format */
import { defineStore } from "pinia";

// If has Date field
import moment from "moment";
import { useEventhistory } from "~/composables/eventhistory/useEventhistory";

// If has image field

// Main composable function for object
const {
  getListEventhistory,
  getByEventhistoryId,
  addEventhistory,
  updateEventhistory,
  deleteEventhistory,
} = useEventhistory();

export const useEventhistoryStore = defineStore("eventhistory", {
  state: () => ({
    searchField: {
      eventName: undefined,
      doneByUser: undefined,
    },

    eventhistoryList: [],
    selectedEventhistory: undefined,
    openEdit: false,
    openDelete: false,
    errorMessage: "",
    loading: false,
    prosessing: false,
    curentEventhistory: {
      id: undefined,
      eventName: undefined,
      apiName: undefined,
      doneByUser: undefined,
      createdDate: undefined,
    },
  }),
  getters: {
    getEventhistoryList: (state) => state.eventhistoryList,
    getSelectedEventhistory: (state) => state.selectedEventhistory,
    getOpenEdit: (state) => state.openEdit,
    getOpenDelete: (state) => state.openDelete,
    getErrorMessage: (state) => state.errorMessage,
    getLoading: (state) => state.loading,
    getProsessing: (state) => state.prosessing,
    getSearchField: (state) => state.searchField,
    getCurentEventhistory: (state) => state.curentEventhistory,

    // Has json array field

    // Has enum field
  },
  actions: {
    async bindEventhistoryData() {
      const response = await getListEventhistory({
        eventName: this.searchField.eventName,
        doneByUser: this.searchField.doneByUser,
      });
      this.eventhistoryList = response;
    },
    async bindEventhistoryById(id: any) {
      const response = await getByEventhistoryId(id);
      return response;
    },

    async addEventhistory(data: any) {
      const response = await addEventhistory(data);
      this.bindEventhistoryData();

      console.log(response);
    },
    async updateEventhistory(id: any, data: any) {
      const response = await updateEventhistory(id, data);
      this.bindEventhistoryData();
    },
    async deleteEventhistory() {
      // Has image field

      const response = await deleteEventhistory(this.curentEventhistory.id);
      this.closeDelete();
      this.bindEventhistoryData();
    },
    addItem() {
      this.clearItem();
      this.openEdit = true;
    },
    editItem(item: any) {
      this.openEdit = true;
      this.curentEventhistory.id = item.id;
      this.curentEventhistory.eventName = item.eventName;
      this.curentEventhistory.apiName = item.apiName;
      this.curentEventhistory.doneByUser = item.doneByUser;
      this.curentEventhistory.createdDate =
        item.createdDate != undefined && item.createdDate != null
          ? moment(item.createdDate).format("YYYY-MM-DD")
          : undefined;

      console.log(this.curentEventhistory);
    },
    deleteItem(item: any) {
      this.openDelete = true;
      this.curentEventhistory = item;
    },
    closeEdit() {
      this.openEdit = false;
      this.clearItem();
    },
    closeDelete() {
      this.openDelete = false;
      this.clearItem();
    },
    clearItem() {
      this.curentEventhistory = {
        id: undefined,
        eventName: undefined,
        apiName: undefined,
        doneByUser: undefined,
        createdDate: undefined,
      };
      this.errorMessage = "";
      this.loading = false;
      this.prosessing = false;
    },

    clearSearchField() {
      this.searchField = {
        eventName: undefined,
        doneByUser: undefined,
      };
      this.bindEventhistoryData();
    },
    updateErrorMessage(message: string) {
      this.errorMessage = message;
    },
    updateSelectedEventhistory(id: any) {
      const item = this.eventhistoryList.find((item: any) => item.id == id);
      this.selectedEventhistory = item;
    },
    updateLoading(status: boolean) {
      this.loading = status;
    },
    updateProsessing(status: boolean) {
      this.prosessing = status;
    },
    updateSearchField(playload: any) {
      this.searchField = playload;
    },
  },
});
