<template>
  <div>
    <CommonsBreadcrumbCard :listItem="listBreadcrumb" />
    <a-card size="small" title="List Category" style="width: 100%">
      <template #extra>
        <a style="font-size: 12px" @click="expand = !expand">
          <template v-if="expand">
            <UpOutlined />
          </template>
          <template v-else>
            <DownOutlined />
          </template>
          Collapse
        </a>
      </template>
      <a-form name="searchConditionForm">
        <a-col
          :xs="{ span: 24 }"
          :sm="{ span: 24 }"
          :md="{ span: 6 }"
          :xl="{ span: 6 }"
        >
          <a-form-item label="Name">
            <a-input
              placeholder="Enter Name"
              v-model:value="categoryStore.getSearchField.name"
            />
          </a-form-item>
        </a-col>
        <a-col
          :xs="{ span: 24 }"
          :sm="{ span: 24 }"
          :md="{ span: 6 }"
          :xl="{ span: 6 }"
        >
          <a-form-item label="Code">
            <a-input
              placeholder="Enter Code"
              v-model:value="categoryStore.getSearchField.code"
            />
          </a-form-item>
        </a-col>

        <a-col
          :xs="{ span: 24 }"
          :sm="{ span: 24 }"
          :md="{ span: 6 }"
          :xl="{ span: 6 }"
          v-show="expand"
        >
          <a-form-item label="Tag">
            <a-input
              placeholder="Enter Tag"
              type="text"
              v-model:value="categoryStore.getSearchField.tag"
            />
          </a-form-item>
        </a-col>
        <a-row>
          <a-col :span="18">
            <a-form-item>
              <a-button
                type="primary"
                :icon="h(SearchOutlined)"
                size="small"
                style="color: #ffffff; background-color: #13c2c2"
                @click="handleSearch"
                >Search
              </a-button>
              <a-button
                type="primary"
                :icon="h(ClearOutlined)"
                size="small"
                style="
                  margin-left: 5px;
                  color: #595959;
                  background-color: #f5f5f5;
                "
                @click="handleReset"
                >Cancel
              </a-button>
            </a-form-item>
          </a-col>
          <a-col :span="6" style="text-align: right">
            <a-button
              type="primary"
              :icon="h(FileAddOutlined)"
              size="small"
              style="color: #ffffff; background-color: #fa8c16"
              @click="handleCreate"
            >
              Create
            </a-button>
          </a-col>
        </a-row>
      </a-form>
      <a-space direction="horizontal" style="width: 100%" v-show="hasSelected">
        <a-popconfirm
          title="Are you sure delete all seleted item?"
          ok-text="Yes"
          cancel-text="No"
          @confirm="handleConfirmDeleteAll"
          @cancel="handleCancelDeleteAll"
        >
          <a-button
            type="primary"
            :icon="h(DeleteOutlined)"
            style="background-color: #ffccc7; color: #595959"
            size="small"
            @click="handleDeleteAll"
            >Delete All</a-button
          >
        </a-popconfirm>
        <span style="color: brown">{{
          `Selected ${state.selectedRowKeys.length} items`
        }}</span>
      </a-space>

      <a-table
        rowKey="id"
        :row-selection="{
          selectedRowKeys: state.selectedRowKeys,
          onChange: onSelectChange,
        }"
        :columns="columns"
        :data-source="categoryStore.getCategoryList"
        :scroll="{ x: 1500, y: 300 }"
        :pagination="{
          total: categoryStore.getCategoryList.length,
          pageSize: 10,
        }"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'operation'">
            <a-dropdown>
              <template #overlay>
                <a-menu>
                  <a-menu-item key="1" @click="handleEditItem(record)">
                    <EditOutlined />
                    Edit
                  </a-menu-item>
                  <a-menu-divider />
                  <a-menu-item key="2" @click="handleDelete(record)">
                    <DeleteOutlined />
                    Delete
                  </a-menu-item>
                </a-menu>
              </template>
              <a-button shape="circle" :icon="h(MoreOutlined)"> </a-button>
            </a-dropdown>
          </template>
        </template>
      </a-table>
      <CommonsModalConfirm
        :showModal="categoryStore.getOpenDelete"
        title="Delete Category"
        @confirmOK="handleConfirmDelete"
        @confirmCancel="handleCancelDelete"
      >
        <p style="color: red">Are you sure delete this category?</p>
      </CommonsModalConfirm>
      <CategoryAddCard
        v-model:showModal="modalEditCategoryVisible"
        :modalWidth="800"
        @confirmOK="handleConfirmSubmitEditCategoryModal"
        @confirmCancel="handleConfirmCancelEditCategoryModal"
        :categoryItem="selectedCategory"
      >
      </CategoryAddCard>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  layout: "admin",
  // middleware: "auth",
});

import {
  SearchOutlined,
  FileAddOutlined,
  ClearOutlined,
  DeleteOutlined,
  MoreOutlined,
  EditOutlined,
  FilePdfOutlined,
} from "@ant-design/icons-vue";
import { message } from "ant-design-vue";
import { computed, h, reactive, ref } from "vue";

import { useCategoryStore } from "~/stores/category/category";
const categoryStore = useCategoryStore();

const loading = ref(false);
const expand = ref(false);
const labelCol = { style: { width: "150px" } };
const wrapperCol = { span: 12 };
const selectedCategory = ref(undefined);
const modalEditCategoryVisible = ref(false);
const openDeleteConfirmModal = ref(false);
const listBreadcrumb = ref([{ id: 1, text: "Category List", path: "" }]);

const columns = ref([
  { title: "ID", width: 50, dataIndex: "id", key: "id" },
  { title: "Name", width: 120, dataIndex: "name", key: "name" },
  { title: "Code", width: 80, dataIndex: "code", key: "code" },
  {
    title: "Parent",
    dataIndex: "parentId",
    key: "parentId",
    width: 100,
  },
  {
    title: "Order",
    dataIndex: "order",
    key: "order",
    width: 60,
  },
  { title: "Tag", dataIndex: "tag", key: "tag", width: 100 },
  {
    title: "Actions",
    key: "operation",
    align: "center",
    width: 100,
  },
]);

type Key = string | number;
const state = reactive<{
  selectedRowKeys: Key[];
  loading: boolean;
}>({
  selectedRowKeys: [], // Check here to configure the default column
  loading: false,
});
const hasSelected = computed(() => state.selectedRowKeys.length > 0);

const onSelectChange = (selectedRowKeys: Key[]) => {
  console.log("selectedRowKeys changed: ", selectedRowKeys);
  state.selectedRowKeys = selectedRowKeys;
};

const bindData = async () => {
  console.log("bind data category");
  await categoryStore.bindCategoryData();
};

// create onMounted hook
onMounted(() => {
  bindData();
});

// End Table

const handleSearch = async () => {
  console.log("search");
  await bindData();
};
const handleReset = () => {
  console.log("reset");
  categoryStore.clearSearchField();
};
const handleCreate = () => {
  console.log("create");
  categoryStore.clearItem();
  selectedCategory.value = undefined;
  modalEditCategoryVisible.value = true;
};
const handleDeleteAll = () => {
  console.log("delete all");
};
const handleConfirmDeleteAll = () => {
  console.log("confirm delete all");
  message.success("Delete all successfully");
};
const handleCancelDeleteAll = () => {
  console.log("cancel delete all");
};
const handleEditItem = (key: any) => {
  console.log("edit item", key);
  modalEditCategoryVisible.value = true;
  categoryStore.editItem(key);
  selectedCategory.value = categoryStore.getCurentCategory.id;
};

const handleDelete = (key: any) => {
  console.log("delete item", key);
  // openDeleteConfirmModal.value = true;
  categoryStore.deleteItem(key);
};
const handleConfirmDelete = () => {
  console.log("confirm delete");
  try {
    categoryStore.deleteCategory();
    message.success("Delete tour successfully");
    // openDeleteConfirmModal.value = false;
    categoryStore.closeDelete();
  } catch (error) {
    message.error("Delete tour failed");
  }
};
const handleCancelDelete = () => {
  console.log("cancel delete");
  categoryStore.closeDelete();
  // openDeleteConfirmModal.value = false;
};

const handleConfirmSubmitEditCategoryModal = () => {
  console.log("confirm submit edit student modal");
  modalEditCategoryVisible.value = false;
};
const handleConfirmCancelEditCategoryModal = () => {
  console.log("confirm cancel edit student modal");
  modalEditCategoryVisible.value = false;
};
</script>
