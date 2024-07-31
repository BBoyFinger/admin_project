<template>
  <div>
    <CommonsBreadcrumbCard :listItem="listBreadcrumb" />
    <a-card size="small" title="Add Tour" style="width: 100%">
      <a-form ref="formRef" :model="formState" :rules="rules">
        <a-row :gutter="10">
          <a-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8">
            <a-form-item label="Tour Code" name="tourCode">
              <a-input
                v-model:value="formState.tourCode"
                placeholder="Enter Tour Code"
              />
            </a-form-item>
          </a-col>
          <a-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8">
            <a-form-item label="Arrive Date" name="arriveDate">
              <a-date-picker
                v-model:value="formState.arriveDate"
                style="width: 100%"
                :format="dateFormat"
              />
            </a-form-item>
          </a-col>
          <a-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8">
            <a-form-item label="Return Date" name="returnDate">
              <a-date-picker
                v-model:value="formState.returnDate"
                style="width: 100%"
                :format="dateFormat"
              />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter="10">
          <a-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8">
            <a-form-item label="TL Name" name="tourLeadName">
              <a-input
                v-model:value="formState.tourLeadName"
                placeholder="Enter TL Name"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="10">
          <a-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8">
            <a-form-item label="Payment Status" name="payStatus">
              <a-select
                v-model:value="formState.payStatus"
                placeholder="Select Payment Status"
                :options="
                  tourinfoStore.getPayStatusList.map((item) => {
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
          <a-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8">
            <a-form-item label="Paid Date" name="paidDate">
              <a-date-picker
                v-model:value="formState.paidDate"
                style="width: 100%"
                :format="dateFormat"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-form-item>
          <a-button>
            <Nuxt-Link to="/tour/tourlist">Back</Nuxt-Link>
          </a-button>
          <a-button
            :disabled="
              curentTourinfoId != '-1' && curentTourinfoId != undefined
            "
            style="margin-left: 10px"
            @click="handleReset"
            >Reset</a-button
          >

          <a-button
            type="primary"
            style="margin-left: 10px"
            :loading="loading"
            @click="handleSaveData"
            >{{
              curentTourinfoId != "-1" && curentTourinfoId != undefined
                ? "Update"
                : "Create"
            }}</a-button
          >
        </a-form-item>
      </a-form>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
import { message } from "ant-design-vue";

import { reactive, ref } from "vue";
import type { Rule } from "ant-design-vue/es/form";
import dayjs, { Dayjs } from "dayjs";
definePageMeta({
  layout: "admin",
  // middleware: "auth",
});
const dateFormat = "YYYY/MM/DD";
import { useTourinfoStore } from "~/stores/tourinfo/tourinfo";

const tourinfoStore = useTourinfoStore();

const route = useRoute();
const curentTourinfoId = ref(-1);

const listBreadcrumb = ref([
  { id: 1, text: "List Tour", path: "/tour/tourlist" },
  {
    id: 2,
    text:
      curentTourinfoId.value != -1 && curentTourinfoId.value != undefined
        ? "Update Tour"
        : "Add Tour",
    path: "",
  },
]);
const loading = ref(false);

interface FormState {
  tourCode: string;
  arriveDate: Dayjs | undefined;
  returnDate: Dayjs | undefined;
  comTotal: number | undefined;
  payStatus: number | undefined;
  paidDate: Dayjs | undefined;
  tourLeadId: number | undefined;
  tourLeadName: string | undefined;
  tourists: string | undefined;
  transactions: string | undefined;
}
const formRef = ref();

const formState: UnwrapRef<FormState> = reactive({
  tourCode: undefined,
  arriveDate: undefined,
  returnDate: undefined,
  comTotal: undefined,
  payStatus: 1,
  paidDate: undefined,
  tourLeadId: undefined,
  tourLeadName: undefined,
  tourists: undefined,
  transactions: undefined,
});

const rules: Record<string, Rule[]> = {
  tourCode: [
    { required: true, message: "Please input tour code", trigger: "blur" },
  ],
  tourLeadName: [
    { required: true, message: "Please input TL name", trigger: "blur" },
  ],
};

// create onMounted hook
onMounted(async () => {
  console.log("onMounted");
  if (route.query.id != "-1" && route.query.id) {
    curentTourinfoId.value = Number(route.query.id);
    console.log("curentTourinfoId", curentTourinfoId.value);
    const res = await tourinfoStore.bindTourinfoById(curentTourinfoId.value);
    if (res == undefined || res == null) {
      return;
    }
    console.log("res", res);
    formState.tourCode = res.tourCode;
    formState.comTotal =
      res.comTotal != undefined && res.comTotal != null
        ? parseInt(res.comTotal)
        : undefined;
    formState.arriveDate =
      res.arriveDate != undefined && res.arriveDate != null
        ? dayjs(res.arriveDate, dateFormat)
        : undefined;
    formState.returnDate =
      res.returnDate != undefined && res.returnDate != null
        ? dayjs(res.returnDate, dateFormat)
        : undefined;
    formState.tourLeadName = res.tourLeadName;
    formState.payStatus = res.payStatus;
    formState.paidDate =
      res.paidDate != undefined && res.paidDate != null
        ? dayjs(res.paidDate, dateFormat)
        : undefined;
    formState.tourists = res.tourists;
    formState.transactions = res.transactions;
    formState.tourLeadId =
      res.tourLeadId != undefined && res.tourLeadId != null
        ? parseInt(res.tourLeadId)
        : undefined;
  }
});
const handleReset = () => {
  formRef.value.resetFields();
};
const handleSaveData = async () => {
  console.log("handleSaveData");
  try {
    await formRef.value.validate();
    loading.value = true;
    let dataTourinfo = {
      tourCode: formState.tourCode,
      comTotal: formState.comTotal,
      arriveDate: formState.arriveDate,
      returnDate: formState.returnDate,
      tourLeadName: formState.tourLeadName,
      payStatus: formState.payStatus
        ? parseInt(formState.payStatus)
        : undefined,
      paidDate: formState.paidDate,
      tourists: formState.tourists
        ? JSON.stringify(formState.tourists)
        : undefined,
      transactions: formState.transactions
        ? JSON.stringify(formState.transactions)
        : undefined,
    };
    if (curentTourinfoId.value > 0) {
      await tourinfoStore.updateTourinfo(curentTourinfoId.value, dataTourinfo);
      loading.value = false;
      message.success("Update successfully");
    } else {
      await tourinfoStore.addTourinfo(dataTourinfo);
      loading.value = false;
      handleReset();
      message.success("Create successfully");
    }
  } catch (error) {
    console.log("error", error);
    loading.value = false;
  }
};
</script>
