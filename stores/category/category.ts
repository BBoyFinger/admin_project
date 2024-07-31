/** @format */
import { defineStore } from "pinia";
import { useCategory } from "~/composables/category/useCategory";

// If has Date field

// If has image field

// Main composable function for object
const {
  getListCategory,
  getByIDCategory,
  addCategory,
  updateCategory,
  deleteCategory,
} = useCategory();

export const useCategoryStore = defineStore("category", {
  state: () => ({
    searchField: {
      code: undefined,
      name: undefined,
      tag: undefined,
    },

    categoryList: [],
    selectedCategory: undefined,
    openEdit: false,
    openDelete: false,
    errorMessage: "",
    loading: false,
    prosessing: false,
    curentCategory: {
      id: undefined,
      code: undefined,
      name: undefined,
      parentId: undefined,
      order: undefined,
      tag: undefined,
    },
  }),
  getters: {
    getCategoryList: (state) => state.categoryList,
    getSelectedCategory: (state) => state.selectedCategory,
    getOpenEdit: (state) => state.openEdit,
    getOpenDelete: (state) => state.openDelete,
    getErrorMessage: (state) => state.errorMessage,
    getLoading: (state) => state.loading,
    getProsessing: (state) => state.prosessing,
    getSearchField: (state) => state.searchField,
    getCurentCategory: (state) => state.curentCategory,

    // Has json array field

    // Has enum field
  },
  actions: {
    async bindCategoryData() {
      const response = await getListCategory({
        code: this.searchField.code,
        name: this.searchField.name,
        tag: this.searchField.tag,
      });
      this.categoryList = response;
    },
    async bindCategoryById(id: any) {
      const response = await getByIDCategory(id);
      return response;
    },
    async addCategory(data: any) {
      const response = await addCategory(data);
      this.bindCategoryData();

      console.log(response);
    },
    async updateCategory(id: any, data: any) {
      const response = await updateCategory(id, data);
      this.bindCategoryData();
    },
    async deleteCategory() {
      // Has image field

      const response = await deleteCategory(this.curentCategory.id);
      this.closeDelete();
      this.bindCategoryData();
    },
    addItem() {
      this.clearItem();
      this.openEdit = true;
    },
    editItem(item: any) {
      this.openEdit = true;
      this.curentCategory.id = item.id;
      this.curentCategory.code = item.code;
      this.curentCategory.name = item.name;
      this.curentCategory.parentId = item.parentId;
      this.curentCategory.order = item.order;
      this.curentCategory.tag = item.tag;

      console.log(this.curentCategory);
    },
    deleteItem(item: any) {
      this.openDelete = true;
      this.curentCategory = item;
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
      this.curentCategory = {
        id: undefined,
        code: undefined,
        name: undefined,
        parentId: undefined,
        order: undefined,
        tag: undefined,
      };
      this.errorMessage = "";
      this.loading = false;
      this.prosessing = false;
    },

    clearSearchField() {
      this.searchField = {
        code: undefined,
        name: undefined,
        tag: undefined,
      };
      this.bindCategoryData();
    },
    updateErrorMessage(message: string) {
      this.errorMessage = message;
    },
    updateSelectedCategory(id: any) {
      const item = this.categoryList.find((item: any) => item.id == id);
      this.selectedCategory = item;
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
