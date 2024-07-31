/** @format */
import { defineStore } from "pinia";
import { useUser } from "~/composables/user/useUser";

// If has Date field

// If has image field

// Main composable function for object
const { getListUser, getByUserID, addUser, updateUser, deleteUser } = useUser();

export const useUserStore = defineStore("user", {
  state: () => ({
    searchField: {
      fullname: undefined,
      email: undefined,
      roleName: undefined,
      roleId: undefined,
    },

    userList: [],
    selectedUser: undefined,
    openEdit: false,
    openDelete: false,
    errorMessage: "",
    loading: false,
    prosessing: false,
    curentUser: {
      id: undefined,
      fullname: undefined,
      email: undefined,
      phone: undefined,
      roleName: undefined,
      roleId: undefined,
    },
  }),
  getters: {
    getUserList: (state) => state.userList,
    getSelectedUser: (state) => state.selectedUser,
    getOpenEdit: (state) => state.openEdit,
    getOpenDelete: (state) => state.openDelete,
    getErrorMessage: (state) => state.errorMessage,
    getLoading: (state) => state.loading,
    getProsessing: (state) => state.prosessing,
    getSearchField: (state) => state.searchField,
    getCurentUser: (state) => state.curentUser,

    // Has json array field

    // Has enum field
  },
  actions: {
    async bindUserData() {
      const response = await getListUser({
        fullname: this.searchField.fullname,
        email: this.searchField.email,
        roleName: this.searchField.roleName,
        roleId: this.searchField.roleId,
      });
      this.userList = response;
    },
    async bindUserByID(id: any) {
      const response = await getByUserID(id);
      return response;
    },
    async addUser(data: any) {
      const response = await addUser(data);
      this.bindUserData();

      console.log(response);
    },
    async updateUser(id: any, data: any) {
      const response = await updateUser(id, data);
      this.bindUserData();
    },
    async deleteUser() {
      // Has image field

      const response = await deleteUser(this.curentUser.id);
      this.closeDelete();
      this.bindUserData();
    },
    addItem() {
      this.clearItem();
      this.openEdit = true;
    },
    editItem(item: any) {
      this.openEdit = true;
      this.curentUser.id = item.id;
      this.curentUser.fullname = item.fullname;
      this.curentUser.email = item.email;
      this.curentUser.phone = item.phone;
      this.curentUser.roleName = item.roleName;
      this.curentUser.roleId = item.roleId;

      console.log(this.curentUser);
    },
    deleteItem(item: any) {
      this.openDelete = true;
      this.curentUser = item;
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
      this.curentUser = {
        id: undefined,
        fullname: undefined,
        email: undefined,
        phone: undefined,
        roleName: undefined,
        roleId: undefined,
      };
      this.errorMessage = "";
      this.loading = false;
      this.prosessing = false;
    },

    clearSearchField() {
      this.searchField = {
        fullname: undefined,
        email: undefined,
        roleName: undefined,
        roleId: undefined,
      };
      console.log(this.searchField);
      this.bindUserData();
    },
    updateErrorMessage(message: string) {
      this.errorMessage = message;
    },
    updateSelectedUser(id: any) {
      const item = this.userList.find((item: any) => item.id == id);
      this.selectedUser = item;
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
