/** @format */
import { defineStore } from "pinia";

// If has Date field
import moment from "moment";
import { useProduct } from "~/composables/product/useProduct";

// If has image field
const { deleteFileInBucket } = useLib();

// Main composable function for object
const {
  getListProduct,
  getByProductID,
  addProduct,
  updateProduct,
  deleteProduct,
} = useProduct();

export const useProductStore = defineStore("product", {
  state: () => ({
    searchField: {
      code: undefined,
      name: undefined,
      cateId: undefined,
      groupId: undefined,
      taxType: undefined,
    },

    productList: [],
    selectedProduct: undefined,
    openEdit: false,
    openDelete: false,
    errorMessage: "",
    loading: false,
    prosessing: false,
    curentProduct: {
      id: undefined,
      code: undefined,
      name: undefined,
      cateId: undefined,
      thumbnail: undefined,
      taxType: undefined,
      price: undefined,
      memberPrice: undefined,
      tag: undefined,
      groupId: undefined,
      createdDate: undefined,
    },
    taxTypeList: [
      { id: 1, name: "Tax included" },
      { id: 2, name: "Tax not included" },
      { id: 3, name: "Tax exemption" },
    ],
  }),
  getters: {
    getProductList: (state) => state.productList,
    getSelectedProduct: (state) => state.selectedProduct,
    getOpenEdit: (state) => state.openEdit,
    getOpenDelete: (state) => state.openDelete,
    getErrorMessage: (state) => state.errorMessage,
    getLoading: (state) => state.loading,
    getProsessing: (state) => state.prosessing,
    getSearchField: (state) => state.searchField,
    getCurentProduct: (state) => state.curentProduct,

    // Has json array field

    // Has enum field
    getTaxTypeList: (state) => state.taxTypeList,
  },
  actions: {
    async bindProductData() {
      console.log(this.searchField);
      const response = await getListProduct({
        code: this.searchField.code,
        name: this.searchField.name,
        cateId: this.searchField.cateId,
        groupId: this.searchField.groupId,
        taxType: this.searchField.taxType,
      });
      this.productList = response;
      console.log("product", response);
    },
    async bindProductById(id: any) {
      const response = await getByProductID(id);
      return response;
    },
    async addProduct(data: any) {
      const response = await addProduct(data);
      this.bindProductData();

      console.log(response);
    },
    async updateProduct(id: any, data: any) {
      const response = await updateProduct(id, data);
      this.bindProductData();
    },
    async deleteProduct() {
      // Has image field
      if (
        this.curentProduct.thumbnail &&
        this.curentProduct.thumbnail.length > 0
      ) {
        await deleteFileInBucket("null", this.curentProduct.thumbnail);
      }
      console.log(this.curentProduct);
      const response = await deleteProduct(this.curentProduct.id);
      this.closeDelete();
      this.bindProductData();
    },
    addItem() {
      this.clearItem();
      this.openEdit = true;
    },
    editItem(item: any) {
      this.openEdit = true;
      this.curentProduct.id = item.id;
      this.curentProduct.code = item.code;
      this.curentProduct.name = item.name;
      this.curentProduct.cateId = item.cateId;
      this.curentProduct.thumbnail = item.thumbnail;
      this.curentProduct.taxType = item.taxType;
      this.curentProduct.price = item.price;
      this.curentProduct.memberPrice = item.memberPrice;
      this.curentProduct.tag = item.tag;
      this.curentProduct.groupId = item.groupId;
      this.curentProduct.createdDate =
        item.createdDate != undefined && item.createdDate != null
          ? moment(item.createdDate).format("YYYY-MM-DD")
          : undefined;

      console.log(this.curentProduct);
    },
    deleteItem(item: any) {
      this.openDelete = true;
      this.curentProduct = item;
      console.log(this.curentProduct, item);
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
      this.curentProduct = {
        id: undefined,
        code: undefined,
        name: undefined,
        cateId: undefined,
        thumbnail: undefined,
        taxType: undefined,
        price: undefined,
        memberPrice: undefined,
        tag: undefined,
        createdDate: undefined,
      };
      this.errorMessage = "";
      this.loading = false;
      this.prosessing = false;
    },

    clearSearchField() {
      this.searchField = {
        code: undefined,
        name: undefined,
        cateId: undefined,
        groupId: undefined,
        taxType: undefined,
      };
      this.bindProductData();
    },
    updateErrorMessage(message: string) {
      this.errorMessage = message;
    },
    updateSelectedProduct(id: any) {
      const item = this.productList.find((item: any) => item.id == id);
      this.selectedProduct = item;
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

    getTaxTypeName(id: any) {
      const taxType = this.taxTypeList.find((item: any) => item.id == id);
      return taxType ? taxType.name : "";
    },
  },
});
