<!-- @format -->

<template>
  <a-modal
    v-model:open="showModal"
    title="Tourist Management"
    centered
    @ok="handleConfirmOK"
    @cancel="handleConfirmCancel"
    :maskClosable="false"
    :width="modalWidth"
  >
    <template #footer>
      <a-button
        key="submit"
        type="primary"
        :loading="loading"
        @click="handleConfirmOK"
        >Save</a-button
      >
    </template>

    <a-flex justify="space-between">
      <a-space size="small">
        <a-button
          type="primary"
          danger
          class="editable-add-btn"
          style="margin-bottom: 8px"
          @click="handleDeleteAll"
          >Delete All</a-button
        >
        <a-button
          class="editable-add-btn"
          style="margin-bottom: 8px"
          @click="handleAdd"
          >Add</a-button
        >
      </a-space>
      <a-button
        class="editable-add-btn"
        style="margin-bottom: 8px"
        @click="handleImportExcel"
        danger
        >Import Excel</a-button
      >
    </a-flex>

    <h4 v-if="count > 0" style="color: red">You have {{ count }} tourists</h4>
    <a-table
      rowKey="id"
      bordered
      :scroll="{ x: 1200, y: 550 }"
      :data-source="tourinfoStore.getCurentTourinfo.tourists"
      :columns="columns"
      size="small"
      :pagination="{
        total: tourinfoStore.getCurentTourinfo.tourists.length,
        pageSize: 10,
      }"
    >
      <template #bodyCell="{ column, text, record }">
        <template v-if="column.dataIndex === 'name'">
          <div class="editable-cell">
            <div
              v-if="editableData[record.id]"
              class="editable-cell-input-wrapper"
            >
              <a-input
                v-model:value="editableData[record.id].name"
                @pressEnter="save(record.id)"
              />
              <check-outlined
                class="editable-cell-icon-check"
                @click="save(record.id)"
              />
            </div>
            <div v-else class="editable-cell-text-wrapper">
              {{ text || " " }}
              <edit-outlined
                class="editable-cell-icon"
                @click="edit(record.id)"
              />
            </div>
          </div>
        </template>
        <template v-if="column.dataIndex === 'passport'">
          <div class="editable-cell">
            <div
              v-if="editableData[record.id]"
              class="editable-cell-input-wrapper"
            >
              <a-input
                v-model:value="editableData[record.id].passport"
                @pressEnter="save(record.id)"
              />
              <check-outlined
                class="editable-cell-icon-check"
                @click="save(record.id)"
              />
            </div>
            <div v-else class="editable-cell-text-wrapper">
              {{ text || " " }}
              <edit-outlined
                class="editable-cell-icon"
                @click="edit(record.id)"
              />
            </div>
          </div>
        </template>
        <template v-if="column.dataIndex === 'phone'">
          <div class="editable-cell">
            <div
              v-if="editableData[record.id]"
              class="editable-cell-input-wrapper"
            >
              <a-input
                v-model:value="editableData[record.id].phone"
                @pressEnter="save(record.id)"
              />
              <check-outlined
                class="editable-cell-icon-check"
                @click="save(record.id)"
              />
            </div>
            <div v-else class="editable-cell-text-wrapper">
              {{ text || " " }}
              <edit-outlined
                class="editable-cell-icon"
                @click="edit(record.id)"
              />
            </div>
          </div>
        </template>
        <template v-if="column.dataIndex === 'birthDay'">
          <div class="editable-cell">
            <div
              v-if="editableData[record.id]"
              class="editable-cell-input-wrapper"
            >
              <a-input
                v-model:value="editableData[record.id].birthDay"
                @pressEnter="save(record.id)"
              />
              <check-outlined
                class="editable-cell-icon-check"
                @click="save(record.id)"
              />
            </div>
            <div v-else class="editable-cell-text-wrapper">
              {{ text || " " }}
              <edit-outlined
                class="editable-cell-icon"
                @click="edit(record.id)"
              />
            </div>
          </div>
        </template>
        <template v-else-if="column.dataIndex === 'operation'">
          <a-popconfirm
            v-if="tourinfoStore.getCurentTourinfo.tourists.length"
            title="Sure to delete?"
            @confirm="onDelete(record.id)"
          >
            <a>Delete</a>
          </a-popconfirm>
        </template>
      </template>
    </a-table>
    <TourinfoImportTouristCard
      :showModal="openImportModal"
      :modalWidth="1280"
      @confirmOK="handleConfirmChooseTourist"
      @confirmCancel="handleConfirmCancelChooseTourist"
    >
    </TourinfoImportTouristCard>
  </a-modal>
</template>
<script lang="ts" setup>
import { message } from "ant-design-vue";
const props = defineProps(["showModal", "modalWidth", "tourinfoItem"]);
const { showModal, modalWidth, tourinfoItem } = toRefs(props);
const emit = defineEmits(["confirmOK", "confirmCancel"]);

import {
  CheckOutlined,
  EditOutlined,
  ImportOutlined,
} from "@ant-design/icons-vue";
import { cloneDeep } from "lodash-es";
import type { Rule } from "ant-design-vue/es/form";
const loading = ref(false);
import { useTourinfoStore } from "~/stores/tourinfo/tourinfo";

const tourinfoStore = useTourinfoStore();

const openImportModal = ref(false);

// create onMounted hook and bind Category data
onMounted(() => {
  console.log("onMounted", tourinfoItem.value);
  //   bindCategoryData();
});

function handleConfirmOK() {
  emit("confirmOK");
}
function handleConfirmCancel() {
  emit("confirmCancel");
}

interface DataItem {
  id: string;
  name: string;
  phone: string;
  passport: string;
  birthDay: string;
}

const columns = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
    width: "40%",
  },
  {
    title: "Passport",
    dataIndex: "passport",
    key: "passport",
    width: "15%",
  },
  {
    title: "Phone",
    dataIndex: "phone",
    key: "phone",
    width: "15%",
  },
  {
    title: "Birth Day",
    dataIndex: "birthDay",
    key: "birthDay",
    width: "15%",
  },
  {
    title: "Operation",
    dataIndex: "operation",
    key: "operation",
    align: "center",
    width: "15%",
  },
];

const count = computed(() => tourinfoStore.getCurentTourinfo.tourists.length);
const editableData: UnwrapRef<Record<string, DataItem>> = reactive({});

const edit = (key: string) => {
  console.log("edit", key);
  editableData[key] = cloneDeep(
    tourinfoStore.getCurentTourinfo.tourists.filter(
      (item) => key === item.id
    )[0]
  );
};
const save = (key: string) => {
  Object.assign(
    tourinfoStore.getCurentTourinfo.tourists.filter(
      (item) => key === item.id
    )[0],
    editableData[key]
  );
  delete editableData[key];
};

const handleDeleteAll = () => {
  console.log("delete all");
  tourinfoStore.getCurentTourinfo.tourists = [];
};

const onDelete = (key: string) => {
  tourinfoStore.getCurentTourinfo.tourists =
    tourinfoStore.getCurentTourinfo.tourists.filter((item) => item.id !== key);
};
const handleAdd = () => {
  tourinfoStore.addTourists();
};
const handleImportExcel = () => {
  console.log("import excel");
  openImportModal.value = true;
};
const handleConfirmChooseTourist = (dataTourists: any) => {
  console.log("handleConfirmChooseTourist", dataTourists);
  //   insert data to tourists list of tourinfo
  tourinfoStore.addTouristFromData(dataTourists);
  openImportModal.value = false;
};
const handleConfirmCancelChooseTourist = () => {
  openImportModal.value = false;
};
</script>
<style scoped>
.editable-cell {
  position: relative;
}
.editable-cell .editable-cell-input-wrapper,
.editable-cell .editable-cell-text-wrapper {
  padding-right: 24px;
}
.editable-cell .editable-cell-text-wrapper {
  padding: 5px 24px 5px 5px;
}
.editable-cell .editable-cell-icon,
.editable-cell .editable-cell-icon-check {
  position: absolute;
  right: 0;
  width: 20px;
  cursor: pointer;
}
.editable-cell .editable-cell-icon {
  margin-top: 4px;
  display: none;
}
.editable-cell .editable-cell-icon-check {
  line-height: 28px;
}
.editable-cell .editable-cell-icon:hover,
.editable-cell .editable-cell-icon-check:hover {
  color: #108ee9;
}
.editable-cell .editable-add-btn {
  margin-bottom: 8px;
}
.editable-cell:hover .editable-cell-icon {
  display: inline-block;
}
</style>
