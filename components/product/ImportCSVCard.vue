<template>
  <a-modal
    v-model:open="showModal"
    title="Import Data Tourist"
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
        >Import Data</a-button
      >
    </template>
    <div>
      <input type="file" @change="handleFileChange" accept=".csv" />
      <!-- Hiển thị dữ liệu xem trước -->
      <template v-if="previewData.length > 0">
        <h3>Preview Data</h3>
        <table style="width: 100%; margin-top: 5px">
          <thead>
            <tr>
              <th v-for="(header, index) in previewHeaders" :key="index">
                {{ header }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, rowIndex) in previewData" :key="rowIndex">
              <td v-for="(col, colIndex) in row" :key="colIndex">{{ col }}</td>
            </tr>
          </tbody>
        </table>
      </template>
    </div>
  </a-modal>
</template>

<script setup>
const props = defineProps(["showModal", "modalWidth"]);
const { showModal, modalWidth } = toRefs(props);
const emit = defineEmits(["confirmOK", "confirmCancel"]);

import chardet from "chardet";
import { ref } from "vue";
import Papa from "papaparse";

const previewData = ref([]);
const previewHeaders = ref([]);
const selectedData = ref([]);

const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    readCSV(file);
  }
};

const readCSV = (file) => {
  // Đọc nội dung của file dưới dạng ArrayBuffer
  const reader = new FileReader();
  reader.onload = (event) => {
    const arrayBuffer = event.target.result;

    // Xác định mã hóa của file CSV tự động
    const detectedEncoding = chardet.detect(new Uint8Array(arrayBuffer));

    // Nếu mã hóa được xác định, sử dụng mã hóa đó khi đọc file CSV
    if (detectedEncoding) {
      Papa.parse(file, {
        header: true,
        encoding: detectedEncoding,
        complete: (results) => {
          const data = results.data;
          const headers = results.meta.fields;

          previewData.value = data;
          previewHeaders.value = headers;
        },
        error: (error) => {
          console.error("CSV parsing error:", error);
        },
      });
    } else {
      console.error("Failed to detect CSV encoding");
    }
  };
  reader.readAsArrayBuffer(file);
};

const saveData = () => {
  selectedData.value = previewData.value.map((row, rowIndex) => {
    const rowData = {};
    Object.keys(row).forEach((key, index) => {
      rowData[`field_${index + 1}`] = row[key];
    });
    return rowData;
  });
  console.log(selectedData.value);
};

const handleClearData = () => {
  previewData.value = [];
  previewHeaders.value = [];
  selectedData.value = [];
};
function handleConfirmOK() {
  saveData();
  emit("confirmOK", selectedData.value);
  // clear data
  handleClearData();
}
function handleConfirmCancel() {
  emit("confirmCancel");
  // clear data
  handleClearData();
}
</script>
<style scoped>
table {
  font-family: Arial, Helvetica, sans-serif;
  border-collapse: collapse;
  width: 100%;
}

table td,
table th {
  border: 1px solid #ddd;
  padding: 8px;
}

table tr:nth-child(even) {
  background-color: #f2f2f2;
}

table tr:hover {
  background-color: #ddd;
}

table th {
  padding-top: 12px;
  padding-bottom: 12px;
  text-align: left;
  background-color: #f0f0f0;
  color: black;
}
</style>
