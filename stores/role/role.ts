/** @format */
import { defineStore } from "pinia";
import { useRole } from "~/composables/role/useRole";

// If has Date field

// If has image field

// Main composable function for object
const { getListRole, getByRoleID, addRole, updateRole, deleteRole } = useRole();

export const useRoleStore = defineStore("role", {
  state: () => ({
    searchField: {
      name: undefined,
    },

    roleList: [],
    selectedRole: undefined,
    openEdit: false,
    openDelete: false,
    errorMessage: "",
    loading: false,
    prosessing: false,
    curentRole: {
      id: undefined,
      name: undefined,
      description: undefined,
    },
  }),
  getters: {
    getRoleList: (state) => state.roleList,
    getSelectedRole: (state) => state.selectedRole,
    getOpenEdit: (state) => state.openEdit,
    getOpenDelete: (state) => state.openDelete,
    getErrorMessage: (state) => state.errorMessage,
    getLoading: (state) => state.loading,
    getProsessing: (state) => state.prosessing,
    getSearchField: (state) => state.searchField,
    getCurentRole: (state) => state.curentRole,

    // Has json array field

    // Has enum field
  },
  actions: {
    async bindRoleData() {
      const response = await getListRole({
        name: this.searchField.name,
      });
      this.roleList = response;
    },
    async bindRoleByID(id: any) {
      const response = await getByRoleID(id);
      return response;
    },
    async addRole(data: any) {
      const response = await addRole(data);
      this.bindRoleData();

      console.log(response);
    },
    async updateRole(id: any, data: any) {
      const response = await updateRole(id, data);
      this.bindRoleData();
    },
    async deleteRole() {
      // Has image field

      const response = await deleteRole(this.curentRole.id);
      this.closeDelete();
      this.bindRoleData();
    },
    addItem() {
      this.clearItem();
      this.openEdit = true;
    },
    editItem(item: any) {
      this.openEdit = true;
      this.curentRole.id = item.id;
      this.curentRole.name = item.name;
      this.curentRole.description = item.description;

      console.log(this.curentRole);
    },
    deleteItem(item: any) {
      this.openDelete = true;
      this.curentRole = item;
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
      this.curentRole = {
        id: undefined,
        name: undefined,
        description: undefined,
      };
      this.errorMessage = "";
      this.loading = false;
      this.prosessing = false;
    },

    clearSearchField() {
      this.searchField = {
        name: undefined,
      };
      this.bindRoleData();
    },
    updateErrorMessage(message: string) {
      this.errorMessage = message;
    },
    updateSelectedRole(id: any) {
      const item = this.roleList.find((item: any) => item.id == id);
      this.selectedRole = item;
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
