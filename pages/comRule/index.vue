<template>
  <div>
    <CommonsBreadcrumbCard :listItem="listBreadcrumb" />
    <a-card size="small" title="List Comrule" style="width: 100%">
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
          <a-form-item label="Apply To">
            <!-- <a-input
              placeholder="Enter apply to"
              v-model:value="comruleStore.getSearchField.applyTo"
            /> -->
            <a-select
              width="100%"
              v-model:value="comruleStore.getSearchField.applyTo"
              placeholder="Please select apply to"
              :options="
                comruleStore.applyToList.map((item) => {
                  return {
                    value: item.id,
                    label: item.name,
                  };
                })
              "
            >
            </a-select>
          </a-form-item>
        </a-col>
        <a-col
          :xs="{ span: 24 }"
          :sm="{ span: 24 }"
          :md="{ span: 6 }"
          :xl="{ span: 6 }"
        >
          <a-form-item label="Target Name">
            <a-input
              placeholder="Target Name"
              v-model:value="comruleStore.getSearchField.targetName"
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
          <a-form-item label="Com Type">
            <!-- <a-input
              placeholder="Enter Com Type"
              type="text"
              v-model:value="comruleStore.getSearchField.comType"
            /> -->
            <a-select
              width="100%"
              v-model:value="comruleStore.getSearchField.comType"
              placeholder="Please select ComType"
              :options="
                comruleStore.getComTypeList.map((item) => {
                  return {
                    value: item.id,
                    label: item.name,
                  };
                })
              "
            >
            </a-select>
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
              <NuxtLink to="/comrule/addcomrule"> Create </NuxtLink>
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
        :data-source="comruleStore.getComruleList"
        :scroll="{ x: 1500, y: 300 }"
        :pagination="{
          total: comruleStore.getComruleList.length,
          pageSize: 10,
        }"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'operation'">
            <a-dropdown>
              <template #overlay>
                <a-menu>
                  <a-menu-item key="1">
                    <EditOutlined />
                    <NuxtLink
                      :to="{
                        path: '/comrule/addcomrule',
                        query: { id: record.id },
                      }"
                    >
                      Edit
                    </NuxtLink>
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
        :showModal="comruleStore.getOpenDelete"
        title="Delete Comrule"
        @confirmOK="handleConfirmDelete"
        @confirmCancel="handleCancelDelete"
      >
        <p style="color: red">Are you sure delete this comrule?</p>
      </CommonsModalConfirm>
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
import moment from "moment";
import { computed, h, reactive, ref } from "vue";
import { useComruleStore } from "~/stores/comrule/comrule";

const comruleStore = useComruleStore();
const expand = ref(false);
const listBreadcrumb = ref([{ id: 1, text: "Com Rule", path: "" }]);
const modalEditCategoryVisible = ref(false);
const selectedcomrule = ref(undefined);

const columns = ref([
  { title: "ID", width: 50, dataIndex: "id", key: "id" },
  {
    title: "Apply To",
    width: 120,
    dataIndex: "applyTo",
    key: "applyTo",
    customRender: ({ record }) => {
      return h(
        "span",
        {},
        record.applyTo ? comruleStore.getApplyToName(record.applyTo) : ""
      );
    },
  },
  {
    title: "Target Name",
    width: 120,
    dataIndex: "targetName",
    key: "targetName",
  },
  {
    title: "Com Type",
    width: 120,
    dataIndex: "comType",
    key: "comType",
    customRender: ({ record }) => {
      return h(
        "span",
        {},
        record.comType ? comruleStore.getComTypeName(record.comType) : ""
      );
    },
  },
  { title: "Rate Value", width: 120, dataIndex: "rateValue", key: "rateValue" },
  {
    title: "ATI Rate ",
    width: 120,
    dataIndex: "atiRateValue",
    key: "atiRateValue",
  },
  {
    title: "Tax Rate ",
    width: 120,
    dataIndex: "taxRate",
    key: "taxRate",
  },
  {
    title: "Valid Date",
    width: 120,
    dataIndex: "validDate",
    key: "validDate",
    customRender: ({ record }) => {
      return h(
        "span",
        {},
        record.validDate ? moment(record.validDate).format("YYYY-MM-DD") : ""
      );
    },
  },
  {
    title: "Valid To",
    width: 120,
    dataIndex: "validTo",
    key: "validTo",
    customRender: ({ record }) => {
      return h(
        "span",
        {},
        record.validTo ? moment(record.validTo).format("YYYY-MM-DD") : ""
      );
    },
  },
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

const handleSearch = async () => {
  console.log("search");
  await bindData();
};
const handleReset = () => {
  console.log("reset");
  comruleStore.clearSearchField();
};
const handleCreate = () => {
  console.log("create");
  comruleStore.clearItem();
  selectedcomrule.value = undefined;
};

const handleDeleteAll = () => {
  console.log("delete all");
};
const handleConfirmDeleteAll = () => {
  console.log("confirm delete all");
  message.success("Delete all successfully");
};

// get comrule from db
const bindData = async () => {
  console.log("bind data comrule");
  await comruleStore.bindComruleData();
};

const handleCancelDeleteAll = () => {
  console.log("cancel delete all");
};

const handleDelete = (key: any) => {
  console.log("delete item", key);
  // openDeleteConfirmModal.value = true;
  comruleStore.deleteItem(key);
};

const handleConfirmDelete = () => {
  console.log("confirm delete");
  try {
    comruleStore.deleteComrule();
    message.success("Delete comrule successfully");
    // openDeleteConfirmModal.value = false;
    comruleStore.closeDelete();
  } catch (error) {
    message.error("Delete comrule failed");
  }
};
const handleCancelDelete = () => {
  console.log("cancel delete");
  comruleStore.closeDelete();
  // openDeleteConfirmModal.value = false;
};

// create onMounted hook
onMounted(() => {
  bindData();
});
</script>
