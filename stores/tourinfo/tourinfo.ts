/** @format */
import { defineStore } from "pinia";
import { uuid } from "vue-uuid";

// If has Date field
import moment from "moment";
import { useTourinfo } from "~/composables/tourinfo/useTourinfo";

// If has image field

// Main composable function for object
const {
  getListTourinfo,
  getByTourinfoId,
  addTourinfo,
  updateTourinfo,
  deleteTourinfo,
} = useTourinfo();

export const useTourinfoStore = defineStore("tourinfo", {
  state: () => ({
    searchField: {
      tourCode: undefined,
      payStatus: undefined,
      tourLeadId: undefined,
      tourLeadName: undefined,
    },

    tourinfoList: [],
    selectedTourinfo: undefined,
    openEdit: false,
    openDelete: false,
    errorMessage: "",
    loading: false,
    prosessing: false,
    curentTourinfo: {
      id: undefined,
      tourCode: undefined,
      arriveDate: undefined,
      returnDate: undefined,
      comTotal: undefined,
      payStatus: undefined,
      paidDate: undefined,
      tourLeadId: undefined,
      tourLeadName: undefined,
      tourists: [],
      transactions: [],
    },
    payStatusList: [
      { id: 1, name: "Pending" },
      { id: 2, name: "Paid" },
    ],

    openEditTourists: false,
    openDeleteTourists: false,
    errorMessageTourists: "",
    loadingTourists: false,
    prosessingTourists: false,
    touristsEdit: {
      id: "",
      name: undefined,
      phone: undefined,
      passport: undefined,
      birthDay: undefined,
    },
    openEditTransactions: false,
    openDeleteTransactions: false,
    errorMessageTransactions: "",
    loadingTransactions: false,
    prosessingTransactions: false,
    transactionsEdit: {
      id: "",
      tranId: undefined,
      customerName: undefined,
      customerPassport: undefined,
      productCode: undefined,
      productCate: undefined,
      quantity: 0,
      productName: undefined,
      productPriceNonTax: 0,
      productPriceTax: 0,
      totalCom: 0,
      tranDate: undefined,
    },
  }),
  getters: {
    getTourinfoList: (state) => state.tourinfoList,
    getSelectedTourinfo: (state) => state.selectedTourinfo,
    getOpenEdit: (state) => state.openEdit,
    getOpenDelete: (state) => state.openDelete,
    getErrorMessage: (state) => state.errorMessage,
    getLoading: (state) => state.loading,
    getProsessing: (state) => state.prosessing,
    getSearchField: (state) => state.searchField,
    getCurentTourinfo: (state) => state.curentTourinfo,

    // Has json array field
    getCurentTourists: (state) => state.touristsEdit,
    getOpenEditTourists: (state) => state.openEditTourists,
    getOpenDeleteTourists: (state) => state.openDeleteTourists,
    getErrorMessageTourists: (state) => state.errorMessageTourists,
    getLoadingTourists: (state) => state.loadingTourists,
    getProsessingTourists: (state) => state.prosessingTourists,
    getCurentTransactions: (state) => state.transactionsEdit,
    getOpenEditTransactions: (state) => state.openEditTransactions,
    getOpenDeleteTransactions: (state) => state.openDeleteTransactions,
    getErrorMessageTransactions: (state) => state.errorMessageTransactions,
    getLoadingTransactions: (state) => state.loadingTransactions,
    getProsessingTransactions: (state) => state.prosessingTransactions,

    // Has enum field
    getPayStatusList: (state) => state.payStatusList,
  },
  actions: {
    async bindTourinfoData() {
      const response = await getListTourinfo({
        tourCode: this.searchField.tourCode,
        payStatus: this.searchField.payStatus,
        tourLeadId: this.searchField.tourLeadId,
        tourLeadName: this.searchField.tourLeadName,
      });
      this.tourinfoList = response;
    },
    async bindTourinfoById(id: any) {
      const response = await getByTourinfoId(id);
      return response;
    },
    async addTourinfo(data: any) {
      const response = await addTourinfo(data);
      this.bindTourinfoData();

      console.log(response);
    },
    async updateTourinfo(id: any, data: any) {
      const response = await updateTourinfo(id, data);
      this.bindTourinfoData();
    },
    async deleteTourinfo() {
      // Has image field

      const response = await deleteTourinfo(this.curentTourinfo.id);
      this.closeDelete();
      this.bindTourinfoData();
    },
    addItem() {
      this.clearItem();
      this.openEdit = true;
    },
    editItem(item: any) {
      this.openEdit = true;
      this.curentTourinfo.id = item.id;
      this.curentTourinfo.tourCode = item.tourCode;
      this.curentTourinfo.arriveDate =
        item.arriveDate != undefined && item.arriveDate != null
          ? moment(item.arriveDate).format("YYYY-MM-DD")
          : undefined;
      this.curentTourinfo.returnDate =
        item.returnDate != undefined && item.returnDate != null
          ? moment(item.returnDate).format("YYYY-MM-DD")
          : undefined;
      this.curentTourinfo.comTotal = item.comTotal;
      this.curentTourinfo.payStatus = item.payStatus;
      this.curentTourinfo.paidDate =
        item.paidDate != undefined && item.paidDate != null
          ? moment(item.paidDate).format("YYYY-MM-DD")
          : undefined;
      this.curentTourinfo.tourLeadId = item.tourLeadId;
      this.curentTourinfo.tourLeadName = item.tourLeadName;
      this.curentTourinfo.tourists = item.tourists
        ? JSON.parse(item.tourists)
        : [];
      this.curentTourinfo.transactions = item.transactions
        ? JSON.parse(item.transactions)
        : [];

      console.log(this.curentTourinfo);
    },
    deleteItem(item: any) {
      this.openDelete = true;
      this.curentTourinfo = item;
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
      this.curentTourinfo = {
        id: undefined,
        tourCode: undefined,
        arriveDate: undefined,
        returnDate: undefined,
        comTotal: undefined,
        payStatus: undefined,
        paidDate: undefined,
        tourLeadId: undefined,
        tourLeadName: undefined,
        tourists: [],
        transactions: [],
      };
      this.errorMessage = "";
      this.loading = false;
      this.prosessing = false;
    },
    clearTourists() {
      this.touristsEdit = {
        id: "",
        name: undefined,
        phone: undefined,
        passport: undefined,
        birthDay: undefined,
      };
      this.errorMessageTourists = "";
      this.loadingTourists = false;
      this.prosessingTourists = false;
    },
    clearTransactions() {
      this.transactionsEdit = {
        id: "",
        tranId: undefined,
        customerName: undefined,
        customerPassport: undefined,
        productCode: undefined,
        productCate: undefined,
        quantity: 0,
        productName: undefined,
        productPriceNonTax: 0,
        productPriceTax: 0,
        totalCom: 0,
        tranDate: undefined,
      };
      this.errorMessageTransactions = "";
      this.loadingTransactions = false;
      this.prosessingTransactions = false;
    },

    clearSearchField() {
      this.searchField = {
        tourCode: undefined,
        payStatus: undefined,
        tourLeadId: undefined,
        tourLeadName: undefined,
      };
      this.bindTourinfoData();
    },
    updateErrorMessage(message: string) {
      this.errorMessage = message;
    },
    updateSelectedTourinfo(id: any) {
      const item = this.tourinfoList.find((item: any) => item.id == id);
      this.selectedTourinfo = item;
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
    updateErrorMessageTourists(message: string) {
      this.errorMessageTourists = message;
    },
    updateLoadingTourists(status: boolean) {
      this.loadingTourists = status;
    },
    updateProsessingTourists(status: boolean) {
      this.prosessingTourists = status;
    },
    addTouristsItem(item: any) {
      this.clearTourists();
      this.curentTourinfo.id = item.id;
      this.curentTourinfo.tourCode = item.tourCode;
      this.curentTourinfo.arriveDate =
        item.arriveDate != undefined && item.arriveDate != null
          ? moment(item.arriveDate).format("YYYY-MM-DD")
          : undefined;
      this.curentTourinfo.returnDate =
        item.returnDate != undefined && item.returnDate != null
          ? moment(item.returnDate).format("YYYY-MM-DD")
          : undefined;
      this.curentTourinfo.comTotal = item.comTotal;
      this.curentTourinfo.payStatus = item.payStatus;
      this.curentTourinfo.paidDate =
        item.paidDate != undefined && item.paidDate != null
          ? moment(item.paidDate).format("YYYY-MM-DD")
          : undefined;
      this.curentTourinfo.tourLeadId = item.tourLeadId;
      this.curentTourinfo.tourLeadName = item.tourLeadName;
      this.curentTourinfo.tourists = item.tourists
        ? JSON.parse(item.tourists)
        : [];
      this.curentTourinfo.transactions = item.transactions
        ? JSON.parse(item.transactions)
        : [];
      this.openEditTourists = true;
    },
    editTouristsItem(item: any) {
      this.openEditTourists = true;
      this.touristsEdit.id = item.id;
      this.touristsEdit.name = item.name;
      this.touristsEdit.phone = item.phone;
      this.touristsEdit.passport = item.passport;
      this.touristsEdit.birthDay = item.birthDay;
    },
    deleteTouristsItem(item: any) {
      this.openDeleteTourists = true;
      this.touristsEdit = item;
    },
    closeEditTourists() {
      this.openEditTourists = false;
      this.clearTourists();
    },
    closeDeleteTourists() {
      this.openDeleteTourists = false;
      this.clearTourists();
    },
    addTourists() {
      console.log(this.touristsEdit);
      const data = {
        id: uuid.v1(),
        name: "XXXXXX-XXXX",
        phone: "XXXXXX",
        passport: "SSSSS",
        birthDay: "2000-02-02",
      };
      this.curentTourinfo.tourists.push(data);
      this.clearTourists();
    },
    addTouristFromData(dataImport: any) {
      for (let i = 0; i < dataImport.length; i++) {
        const item = dataImport[i];
        const data = {
          id: uuid.v1(),
          name: item.Name ? item.Name.trim() : "XXXXXX-XXXX",
          phone: item.Phone ? item.Phone.trim() : "XXXXXX",
          passport: item.Passport ? item.Passport.trim() : "XXXXXX",
          birthDay: item.Birthday ? item.Birthday.trim() : "XXXXXX",
        };
        this.curentTourinfo.tourists.push(data);
      }
    },
    updateTourists() {
      console.log(this.touristsEdit);
      const data = {
        id: this.touristsEdit.id,
        name: this.touristsEdit.name,
        phone: this.touristsEdit.phone,
        passport: this.touristsEdit.passport,
        birthDay: this.touristsEdit.birthDay,
      };
      this.curentTourinfo.tourists = this.curentTourinfo.tourists.map(
        (item: any) => {
          if (item.id == data.id) {
            item = data;
          }
          return item;
        }
      );
      this.clearTourists();
    },
    deleteTourists(deleteItem: any) {
      if (deleteItem.id != "") {
        this.curentTourinfo.tourists = this.curentTourinfo.tourists.filter(
          (item: any) => item.id !== deleteItem.id
        );
      }
    },
    getTouristsDisplay(id: any) {
      for (let i = 0; i < this.tourinfoList.length; i++) {
        const element = this.tourinfoList[i];
        if (element.tourists) {
          const tourists = JSON.parse(element.tourists);
          const item = tourists.find((item: any) => item.id == id);
          if (item) {
            return item.name;
          }
        }
      }
      return "";
    },
    updateErrorMessageTransactions(message: string) {
      this.errorMessageTransactions = message;
    },
    updateLoadingTransactions(status: boolean) {
      this.loadingTransactions = status;
    },
    updateProsessingTransactions(status: boolean) {
      this.prosessingTransactions = status;
    },
    addTransactionsItem() {
      this.clearTransactions();
      this.openEditTransactions = true;
    },
    editTransactionsItem(item: any) {
      this.openEditTransactions = true;
      this.transactionsEdit.id = item.id;
      this.transactionsEdit.tranId = item.tranId;
      this.transactionsEdit.customerName = item.customerName;
      this.transactionsEdit.customerPassport = item.customerPassport;
      this.transactionsEdit.productCode = item.productCode;
      this.transactionsEdit.productCate = item.productCate;
      this.transactionsEdit.quantity = item.quantity;
      this.transactionsEdit.productName = item.productName;
      this.transactionsEdit.productPriceNonTax = item.productPriceNonTax;
      this.transactionsEdit.productPriceTax = item.productPriceTax;
      this.transactionsEdit.totalCom = item.totalCom;
      this.transactionsEdit.tranDate = item.tranDate;
    },
    deleteTransactionsItem(item: any) {
      this.openDeleteTransactions = true;
      this.transactionsEdit = item;
    },
    closeEditTransactions() {
      this.openEditTransactions = false;
      this.clearTransactions();
    },
    closeDeleteTransactions() {
      this.openDeleteTransactions = false;
      this.clearTransactions();
    },
    addTransactions() {
      console.log(this.transactionsEdit);
      const data = {
        id: uuid.v1(),
        tranId: this.transactionsEdit.tranId,
        customerName: this.transactionsEdit.customerName,
        customerPassport: this.transactionsEdit.customerPassport,
        productCode: this.transactionsEdit.productCode,
        productCate: this.transactionsEdit.productCate,
        quantity: this.transactionsEdit.quantity,
        productName: this.transactionsEdit.productName,
        productPriceNonTax: this.transactionsEdit.productPriceNonTax,
        productPriceTax: this.transactionsEdit.productPriceTax,
        totalCom: this.transactionsEdit.totalCom,
        tranDate: this.transactionsEdit.tranDate,
      };
      this.curentTourinfo.transactions.push(data);
      this.clearTransactions();
    },
    updateTransactions() {
      console.log(this.transactionsEdit);
      const data = {
        id: this.transactionsEdit.id,
        tranId: this.transactionsEdit.tranId,
        customerName: this.transactionsEdit.customerName,
        customerPassport: this.transactionsEdit.customerPassport,
        productCode: this.transactionsEdit.productCode,
        productCate: this.transactionsEdit.productCate,
        quantity: this.transactionsEdit.quantity,
        productName: this.transactionsEdit.productName,
        productPriceNonTax: this.transactionsEdit.productPriceNonTax,
        productPriceTax: this.transactionsEdit.productPriceTax,
        totalCom: this.transactionsEdit.totalCom,
        tranDate: this.transactionsEdit.tranDate,
      };
      this.curentTourinfo.transactions = this.curentTourinfo.transactions.map(
        (item: any) => {
          if (item.id == data.id) {
            item = data;
          }
          return item;
        }
      );
      this.clearTransactions();
    },
    deleteTransactions(deleteItem: any) {
      if (deleteItem.id != "") {
        this.curentTourinfo.transactions =
          this.curentTourinfo.transactions.filter(
            (item: any) => item.id !== deleteItem.id
          );
      }
    },
    getTransactionsDisplay(id: any) {
      for (let i = 0; i < this.tourinfoList.length; i++) {
        const element = this.tourinfoList[i];
        if (element.transactions) {
          const transactions = JSON.parse(element.transactions);
          const item = transactions.find((item: any) => item.id == id);
          if (item) {
            return item.tranId;
          }
        }
      }
      return "";
    },

    getPayStatusName(id: any) {
      const payStatus = this.payStatusList.find((item: any) => item.id == id);
      return payStatus ? payStatus.name : "";
    },
  },
});
