/** @format */
import { defineStore } from "pinia";

// If has Date field
import moment from "moment";
import { useComrule } from "~/composables/comrule/useComrule";

// If has image field

// Main composable function for object
const {
  getListComrule,
  getByIDCategory,
  addComrule,
  updateComrule,
  deleteComrule,
} = useComrule();

export const useComruleStore = defineStore("comrule", {
  state: () => ({
    searchField: {
      applyTo: undefined,
      targetName: undefined,
      comType: undefined,
    },

    comruleList: [],
    selectedComrule: undefined,
    openEdit: false,
    openDelete: false,
    errorMessage: "",
    loading: false,
    prosessing: false,
    curentComrule: {
      id: undefined,
      applyTo: undefined,
      targetId: undefined,
      targetName: undefined,
      smaregiCateId: undefined,
      comType: undefined,
      rateValue: undefined,
      atiRateValue: undefined,
      taxRate: undefined,
      validDate: undefined,
      validTo: undefined,
    },
    applyToList: [
      { id: 1, name: "Category" },
      { id: 2, name: "Product" },
    ],
    comTypeList: [
      { id: 1, name: "%" },
      { id: 2, name: "Fixed" },
    ],
  }),
  getters: {
    getComruleList: (state) => state.comruleList,
    getSelectedComrule: (state) => state.selectedComrule,
    getOpenEdit: (state) => state.openEdit,
    getOpenDelete: (state) => state.openDelete,
    getErrorMessage: (state) => state.errorMessage,
    getLoading: (state) => state.loading,
    getProsessing: (state) => state.prosessing,
    getSearchField: (state) => state.searchField,
    getCurentComrule: (state) => state.curentComrule,

    // Has json array field

    // Has enum field
    getApplyToList: (state) => state.applyToList,
    getComTypeList: (state) => state.comTypeList,
  },
  actions: {
    async bindComruleData() {
      const response = await getListComrule({
        applyTo: this.searchField.applyTo,
        targetName: this.searchField.targetName,
        comType: this.searchField.comType,
      });
      console.log(response);
      this.comruleList = response;
    },
    async bindComruleById(id: any) {
      const response = await getByIDCategory(id);
      return response;
    },
    async addComrule(data: any) {
      const response = await addComrule(data);
      this.bindComruleData();

      console.log(response);
    },
    async updateComrule(id: any, data: any) {
      const response = await updateComrule(id, data);
      this.bindComruleData();
    },
    async deleteComrule() {
      // Has image field

      const response = await deleteComrule(this.curentComrule.id);
      this.closeDelete();
      this.bindComruleData();
    },
    addItem() {
      this.clearItem();
      this.openEdit = true;
    },
    editItem(item: any) {
      this.openEdit = true;
      this.curentComrule.id = item.id;
      this.curentComrule.applyTo = item.applyTo;
      this.curentComrule.targetId = item.targetId;
      this.curentComrule.targetName = item.targetName;
      this.curentComrule.smaregiCateId = item.smaregiCateId;
      this.curentComrule.comType = item.comType;
      this.curentComrule.rateValue = item.rateValue;
      this.curentComrule.atiRateValue = item.atiRateValue;
      this.curentComrule.taxRate = item.taxRate;
      this.curentComrule.validDate =
        item.validDate != undefined && item.validDate != null
          ? moment(item.validDate).format("YYYY-MM-DD")
          : undefined;
      this.curentComrule.validTo =
        item.validTo != undefined && item.validTo != null
          ? moment(item.validTo).format("YYYY-MM-DD")
          : undefined;

      console.log(this.curentComrule);
    },
    deleteItem(item: any) {
      this.openDelete = true;
      this.curentComrule = item;
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
      this.curentComrule = {
        id: undefined,
        applyTo: undefined,
        targetId: undefined,
        targetName: undefined,
        smaregiCateId: undefined,
        comType: undefined,
        rateValue: undefined,
        atiRateValue: undefined,
        taxRate: undefined,
        validDate: undefined,
        validTo: undefined,
      };
      this.errorMessage = "";
      this.loading = false;
      this.prosessing = false;
    },

    clearSearchField() {
      this.searchField = {
        applyTo: undefined,
        targetName: undefined,
        comType: undefined,
      };
      this.bindComruleData();
    },
    updateErrorMessage(message: string) {
      this.errorMessage = message;
    },
    updateSelectedComrule(id: any) {
      const item = this.comruleList.find((item: any) => item.id == id);
      this.selectedComrule = item;
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

    getApplyToName(id: any) {
      const applyTo = this.applyToList.find((item: any) => item.id == id);
      return applyTo ? applyTo.name : "";
    },
    getComTypeName(id: any) {
      const comType = this.comTypeList.find((item: any) => item.id == id);
      return comType ? comType.name : "";
    },
  },
});
