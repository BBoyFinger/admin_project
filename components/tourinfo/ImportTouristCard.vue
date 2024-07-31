<!-- @format -->

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
        >Choose Data</a-button
      >
    </template>
    <div>
      <input type="file" @change="handleFileChange" accept=".xlsx,.xls" />

      <template v-if="previewData.length > 0">
        <a-flex justify="space-between">
          <h3>Preview Data</h3>

          <a-button @click="saveData" type="primary" danger
            >Get Selected Data</a-button
          >
        </a-flex>
        <table style="width: 100%; margin-top: 5px">
          <thead>
            <tr>
              <th v-for="(header, index) in previewHeaders" :key="index">
                <select v-model="selectedHeaders[index]">
                  <option disabled value="">--Select--</option>
                  <option v-for="col in fixedHeaders" :key="col" :value="col">
                    {{ col }}
                  </option>
                </select>
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

      <template v-if="tourists.length > 0">
        <h3>Selected Data</h3>
        <table style="width: 100%">
          <thead>
            <tr>
              <th v-for="(header, index) in fixedHeaders" :key="index">
                {{ header }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(tourist, index) in tourists" :key="index">
              <td
                v-for="(header, headerIndex) in fixedHeaders"
                :key="headerIndex"
              >
                {{ tourist[header] }}
              </td>
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

import { ref } from "vue";
import ExcelJS from "exceljs/dist/exceljs.min";

const previewData = ref([]);
const previewHeaders = ref([]);
const selectedHeaders = ref([]);
const tourists = ref([]);

const fixedHeaders = ["No", "Name", "Sex", "Birthday", "Passport", "Phone"];

const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    readExcel(file);
  }
};

const readExcel = async (file) => {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(file);
  const worksheet = workbook.getWorksheet(1);
  const data = [];
  const headers = [];
  let startRow = 1;

  // Find startRow
  for (let i = 1; i <= 5; i++) {
    const cell = worksheet.getCell(i, 1);
    if (
      cell.value &&
      (cell.value.toLowerCase() === "no" ||
        cell.value.toLowerCase() === "tt" ||
        cell.value.toLowerCase() === "no." ||
        cell.value.toLowerCase() === "tt.")
    ) {
      startRow = i + 1;
      break;
    }
  }
  console.log("Start Row:", startRow);
  worksheet.eachRow((row, rowIndex) => {
    const rowData = [];
    if (rowIndex < startRow) return; // Skip rows before the start of data table
    row.eachCell((cell, colIndex) => {
      rowData.push(cell.value);
      if (rowIndex === startRow) {
        headers.push(cell.value);
      }
    });
    data.push(rowData);
  });

  previewData.value = data;
  previewHeaders.value = headers;
  selectedHeaders.value = Array.from({ length: headers.length }, () => ""); // Initialize selected headers with empty values
  console.log("Preview Data:", previewData.value);
  console.log("Preview Headers:", previewHeaders.value);
  console.log("Selected Headers:", selectedHeaders.value);
};

const saveData = () => {
  const selectedData = previewData.value.map((row) => {
    const tourist = {};
    fixedHeaders.forEach((header, index) => {
      selectedHeaders.value.forEach((selectedHeader, selectedHeaderIndex) => {
        if (selectedHeader === header) {
          tourist[header] = row[selectedHeaderIndex];
        }
      });
    });
    return tourist;
  });

  console.log("Selected Data:", selectedData);
  // Convert data to JSON format
  const jsonData = selectedData.map((tourist) => ({
    No: tourist.No ? tourist.No.toString() : "",
    Name: tourist.Name ? tourist.Name.toString() : "",
    Sex: tourist.Sex ? tourist.Sex.toString() : "",
    Birthday: tourist.Birthday ? tourist.Birthday.toString() : "",
    Passport: tourist.Passport ? tourist.Passport.toString() : "",
    Phone: tourist.Phone ? tourist.Phone.toString() : "",
  }));

  tourists.value = jsonData;
  console.log("Saving data:", tourists.value);
};
const handleClearData = () => {
  previewData.value = [];
  previewHeaders.value = [];
  selectedHeaders.value = [];
  tourists.value = [];
};
function handleConfirmOK() {
  emit("confirmOK", tourists.value);
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
