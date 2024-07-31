<!-- @format -->

<template>
  <div>
    <CommonsBreadcrumbCard :listItem="listBreadcrumb" />
    <a-card size="small" title="List tour" style="width: 100%">
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
          v-show="expand"
          :xs="{ span: 24 }"
          :sm="{ span: 24 }"
          :md="{ span: 6 }"
          :xl="{ span: 6 }"
        >
          <a-form-item label="Tour Code">
            <a-input
              placeholder="Enter Tour Code"
              v-model:value="tourinfoStore.getSearchField.tourCode"
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
          <a-form-item label="TL Name">
            <a-input
              placeholder="Enter TL Name"
              v-model:value="tourinfoStore.getSearchField.tourLeadName"
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
          <a-form-item label="Pay Status">
            <a-select
              width="100%"
              v-model:value="tourinfoStore.getSearchField.payStatus"
              placeholder="Select payment status"
              :options="
                tourinfoStore.getPayStatusList.map((item) => {
                  return {
                    value: item.id,
                    label: item.name,
                  };
                })
              "
            ></a-select>
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
              <NuxtLink :to="{ path: '/tour/addtour', query: { id: '-1' } }">
                Create
              </NuxtLink>
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
        :data-source="tourinfoStore.getTourinfoList"
        :scroll="{ x: 1500, y: 300 }"
        :pagination="{
          total: tourinfoStore.getTourinfoList.length,
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
                      :to="{ path: '/tour/addtour', query: { id: record.id } }"
                    >
                      Edit
                    </NuxtLink>
                  </a-menu-item>
                  <a-menu-divider />
                  <a-menu-item key="2" @click="handleDelete(record)">
                    <DeleteOutlined />
                    Delete
                  </a-menu-item>
                  <a-menu-divider />
                  <a-menu-item key="3" @click="handleAddTourist(record)">
                    <PlusSquareOutlined />
                    List Tourist
                  </a-menu-item>
                </a-menu>
              </template>
              <a-button shape="circle" :icon="h(MoreOutlined)"> </a-button>
            </a-dropdown>
          </template>
        </template>
      </a-table>
      <CommonsModalConfirm
        :showModal="tourinfoStore.getOpenDelete"
        title="Delete Tour"
        @confirmOK="handleConfirmDelete"
        @confirmCancel="handleCancelDelete"
      >
        <p style="color: red">Are you sure delete this tour?</p>
      </CommonsModalConfirm>
      <TourinfoAddTouristCard
        :showModal="tourinfoStore.getOpenEditTourists"
        :modalWidth="1280"
        @confirmOK="handleConfirmAddTourist"
        @confirmCancel="handleCancelAddTourist"
        :tourinfoItem="selectedTourinfo"
      >
      </TourinfoAddTouristCard>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
import moment from "moment";
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
  PlusSquareOutlined,
} from "@ant-design/icons-vue";
import { message } from "ant-design-vue";
import { computed, h, reactive, ref } from "vue";

import { useTourinfoStore } from "~/stores/tourinfo/tourinfo";
const tourinfoStore = useTourinfoStore();

const loading = ref(false);
const expand = ref(false);
const labelCol = { style: { width: "150px" } };
const wrapperCol = { span: 12 };
const openDeleteConfirmModal = ref(false);

const selectedTourinfo = ref(undefined);
const listBreadcrumb = ref([{ id: 1, text: "Tour List", path: "" }]);

// Column of Tourinfo Table

const columns = ref([
  { title: "ID", width: 50, dataIndex: "id", key: "id" },
  { title: "Tour Code", width: 150, dataIndex: "tourCode", key: "tourCode" },
  {
    title: "Arrive Date",
    dataIndex: "arriveDate",
    key: "arriveDate",
    width: 120,
    // create customRender for date
    customRender: ({ record }) => {
      return h(
        "span",
        {},
        record.arriveDate ? moment(record.arriveDate).format("YYYY-MM-DD") : ""
      );
    },
  },
  {
    title: "Return Date",
    dataIndex: "returnDate",
    key: "returnDate",
    width: 120,
    // create customRender for date
    customRender: ({ record }) => {
      return h(
        "span",
        {},
        record.returnDate ? moment(record.returnDate).format("YYYY-MM-DD") : ""
      );
    },
  },
  {
    title: "TL Name",
    dataIndex: "tourLeadName",
    key: "tourLeadName",
    width: 150,
  },
  {
    title: "COM",
    dataIndex: "comTotal",
    key: "comTotal",
    width: 100,
    // create customRender for number
    customRender: ({ record }) => {
      return h("span", {}, record.comTotal ? record.comTotal.toString() : "0");
    },
  },
  {
    title: "Payment Status",
    dataIndex: "payStatus",
    key: "payStatus",
    width: 150,
    // create customRender for select
    customRender: ({ record }) => {
      return h(
        "span",
        {},
        record.payStatus ? tourinfoStore.getPayStatusName(record.payStatus) : ""
      );
    },
  },
  {
    title: "Paid Date",
    dataIndex: "paidDate",
    key: "paidDate",
    width: 120,
    // create customRender for date
    customRender: ({ record }) => {
      return h(
        "span",
        {},
        record.paidDate ? moment(record.paidDate).format("YYYY-MM-DD") : ""
      );
    },
  },
  {
    title: "Tourists Count",
    dataIndex: "tourists",
    key: "tourists",
    align: "center",
    customRender: ({ record }) => {
      return h(
        "span",
        {},
        record.tourists ? JSON.parse(record.tourists).length : "0"
      );
    },
    width: 120,
  },
  {
    title: "Transaction Count",
    dataIndex: "transactions",
    key: "transactions",
    align: "center",
    customRender: ({ record }) => {
      return h(
        "span",
        {},
        record.transactions ? JSON.parse(record.transactions).length : "0"
      );
    },
    width: 150,
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

// End Table

const bindData = async () => {
  console.log("bind data tourinfo");
  await tourinfoStore.bindTourinfoData();
};
// create onMounted hook
onMounted(() => {
  bindData();
});

const handleSearch = () => {
  console.log("search");
  bindData();
};
const handleReset = () => {
  console.log("reset");
  tourinfoStore.clearSearchField();
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
};
const handleDelete = (key: any) => {
  console.log("delete item", key);
  // openDeleteConfirmModal.value = true;
  tourinfoStore.deleteItem(key);
};
const handleConfirmDelete = () => {
  console.log("confirm delete");
  try {
    tourinfoStore.deleteTourinfo();
    message.success("Delete tour successfully");
    // openDeleteConfirmModal.value = false;
    tourinfoStore.closeDelete();
  } catch (error) {
    message.error("Delete tour failed");
  }
};
const handleCancelDelete = () => {
  console.log("cancel delete");
  tourinfoStore.closeDelete();
  // openDeleteConfirmModal.value = false;
};

const handleAddTourist = (record: any) => {
  console.log("add tourist", record);
  selectedTourinfo.value = record;
  // openAddTouristModal.value = true;
  tourinfoStore.addTouristsItem(record);
};
const handleConfirmAddTourist = () => {
  console.log("confirm add tourist");
  let dataTourinfo = {
    tourCode: tourinfoStore.getCurentTourinfo.tourCode,
    comTotal: tourinfoStore.getCurentTourinfo.comTotal,
    arriveDate: tourinfoStore.getCurentTourinfo.arriveDate,
    returnDate: tourinfoStore.getCurentTourinfo.returnDate,
    tourLeadName: tourinfoStore.getCurentTourinfo.tourLeadName,
    payStatus: tourinfoStore.getCurentTourinfo.payStatus
      ? parseInt(tourinfoStore.getCurentTourinfo.payStatus)
      : undefined,
    paidDate: tourinfoStore.getCurentTourinfo.paidDate,
    tourists: tourinfoStore.getCurentTourinfo.tourists
      ? JSON.stringify(tourinfoStore.getCurentTourinfo.tourists)
      : undefined,
    transactions: tourinfoStore.getCurentTourinfo.transactions
      ? JSON.stringify(tourinfoStore.getCurentTourinfo.transactions)
      : undefined,
  };
  tourinfoStore.updateTourinfo(
    tourinfoStore.getCurentTourinfo.id,
    dataTourinfo
  );

  tourinfoStore.clearItem();
  tourinfoStore.closeEditTourists();
  bindData();
};
const handleCancelAddTourist = () => {
  console.log("cancel add tourist");
  tourinfoStore.closeEditTourists();
};
</script>
