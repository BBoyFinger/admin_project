<!-- @format -->

<template>
  <div>
    <CommonsBreadcrumbCard :listItem="listBreadcrumb" />
    <a-card size="small" title="List User" style="width: 100%">
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
          <a-form-item label="Fullname">
            <a-input
              placeholder="Full name"
              v-model:value="userStore.getSearchField.fullname"
            />
          </a-form-item>
        </a-col>
        <a-col
          v-show="expand"
          :xs="{ span: 24 }"
          :sm="{ span: 24 }"
          :md="{ span: 6 }"
          :xl="{ span: 6 }"
        >
          <a-form-item label="Email">
            <a-input
              placeholder="Email"
              v-model:value="userStore.getSearchField.email"
            />
          </a-form-item>
        </a-col>
        <a-col
          v-show="expand"
          :xs="{ span: 24 }"
          :sm="{ span: 24 }"
          :md="{ span: 6 }"
          :xl="{ span: 6 }"
        >
          <a-form-item label="Role">
            <a-input
              placeholder="Role name"
              v-model:value="userStore.getSearchField.roleName"
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
            >
              <NuxtLink to=""> Create </NuxtLink>
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
        :data-source="userStore.getUserList"
        :scroll="{ x: 1500, y: 300 }"
        :pagination="{
          total: userStore.getUserList.length,
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
                </a-menu>
              </template>
              <a-button shape="circle" :icon="h(MoreOutlined)"> </a-button>
            </a-dropdown>
          </template>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "admin",
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

import { useUserStore } from "@/stores/user/user";
const userStore = useUserStore();

const listBreadcrumb = ref([{ id: 1, text: "User List", path: "" }]);
const expand = ref(false);

const handleSearch = async () => {
  console.log("search");
  await bindDataUser();
};

const handleReset = () => {
  console.log("reset");
  userStore.clearSearchField();
};

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

const handleDeleteAll = () => {
  console.log("delete all");
};
const handleConfirmDeleteAll = () => {
  console.log("confirm delete all");
  message.success("Delete all successfully");
};

const handleCancelDeleteAll = () => {
  console.log("handleCancelDeleteAll");
};

const columns = ref([
  {
    title: "ID",
    dataIndex: "id",
    key: "id",
    width: 50,
  },
  {
    title: "Fullname",
    dataIndex: "fullname",
    key: "fullname",
    width: 150,
  },
  {
    title: "Email",
    dataIndex: "email",
    key: "email",
    width: 150,
  },
  {
    title: "Phone",
    dataIndex: "phone",
    key: "phone",
    width: 150,
  },
  {
    title: "Role",
    dataIndex: "roleName",
    key: "roleName",
    width: 150,
  },
  {
    title: "Actions",
    key: "operation",
    align: "center",
    width: 100,
  },
]);

const bindDataUser = async () => {
  await userStore.bindUserData();
};

onMounted(() => {
  bindDataUser();
});

const handleEditItem = (record: any) => {
  console.log("edit item", record);
};
</script>
