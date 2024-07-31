<template>
  <div>
    <CommonsBreadcrumbCard :listItem="listBreadcrumb" />
    <a-card
      size="small"
      :title="route.query.id == undefined ? 'Add comrule' : 'Update comrule'"
      style="width: 100%"
    >
      <a-form ref="formRef" :model="formState" :rules="rules">
        <a-row :gutter="10">
          <a-col :xs="24" :sm="24" :md="6" :lg="6" :xl="6">
            <a-form-item label="Apply To" name="applyTo">
              <a-select
                @select="handleSelectApplyTo"
                width="100%"
                v-model:value="formState.applyTo"
                placeholder="Please select apply to"
                :options="
                  comruleStore.getApplyToList.map((item) => {
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
        </a-row>

        <a-row :gutter="10">
          <a-col
            :xs="24"
            :sm="24"
            :md="6"
            :lg="6"
            :xl="6"
            v-if="isShowProduct == false"
          >
            <a-form-item label="Category" name="targetId">
              <a-select
                @select="handleSelectCategory"
                width="100%"
                v-model:value="formState.targetId"
                placeholder="please select category"
                :options="
                  categoryStore.getCategoryList.map((item) => {
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
          <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12" v-else>
            <a-form-item label="Product" name="targetId">
              <!-- <a-select
                @select="handleSelectProduct"
                width="100%"
                v-model:value="formState.targetId"
                placeholder="please select Product"
                :options="
                  productStore.getProductList.map((item) => {
                    return {
                      value: item.id,
                      label: item.name,
                    };
                  })
                "
              >
              </a-select> -->
              <a-auto-complete
                @select="handleSelectProduct"
                @search="onSearch"
                width="100%"
                v-model:value="formState.targetId"
                placeholder="please select Product"
                :options="
                  productFiltered.map((item) => {
                    return {
                      value: item.id,
                      label: `${item.price}-${item.name}`,
                    };
                  })
                "
              >
              </a-auto-complete>
            </a-form-item>
          </a-col>
          <a-col :xs="24" :sm="24" :md="6" :lg="6" :xl="6">
            <a-form-item label="Target Name" name="targetName">
              <a-input v-model:value="formState.targetName" disabled />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="10">
          <a-col :xs="24" :sm="24" :md="6" :lg="6" :xl="6">
            <a-form-item label="Com Type" name="comType">
              <a-select
                width="100%"
                v-model:value="formState.comType"
                placeholder="Please select apply to"
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
          <a-col :xs="24" :sm="24" :md="6" :lg="6" :xl="6">
            <a-form-item label="Rate Value" name="rateValue">
              <a-input type="number" v-model:value="formState.rateValue" />
            </a-form-item>
          </a-col>
          <a-col :xs="24" :sm="24" :md="6" :lg="6" :xl="6">
            <a-form-item label="ATI Rate Value" name="atiRateValue">
              <a-input type="number" v-model:value="formState.atiRateValue" />
            </a-form-item>
          </a-col>
          <a-col :xs="24" :sm="24" :md="6" :lg="6" :xl="6">
            <a-form-item label="Tax Rate" name="taxRate">
              <a-input type="number" v-model:value="formState.taxRate" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="10">
          <a-col :xs="24" :sm="24" :md="6" :lg="6" :xl="6">
            <a-form-item label="Valid Date" name="validDate">
              <a-date-picker
                v-model:value="formState.validDate"
                style="width: 100%"
                :format="dateFormat"
              />
            </a-form-item>
          </a-col>
          <a-col :xs="24" :sm="24" :md="6" :lg="6" :xl="6">
            <a-form-item label="Valid To" name="validTo">
              <a-date-picker
                v-model:value="formState.validTo"
                style="width: 100%"
                :format="dateFormat"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-form-item style="margin-top: 10px">
          <a-button>
            <Nuxt-Link to="/comrule">Back</Nuxt-Link>
          </a-button>
          <a-button
            style="margin-left: 10px"
            :disabled="route.query.id != undefined && route.query.id != -1"
            @click="handleReset"
            >Reset</a-button
          >
          <a-button
            type="primary"
            style="margin-left: 10px"
            :loading="loading"
            @click="handleSaveDate"
          >
            {{ route.query.id == undefined ? "Add comrule" : "Update" }}
          </a-button>
        </a-form-item>
      </a-form>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
import { message } from "ant-design-vue";
import { onMounted, reactive, ref } from "vue";
import type { Rule } from "ant-design-vue/es/form";
import { useComruleStore } from "~/stores/comrule/comrule";
import type { UploadChangeParam } from "ant-design-vue";
import dayjs, { Dayjs } from "dayjs";
import { useRoute } from "vue-router";

definePageMeta({
  layout: "admin",
  // middleware: "auth",
});

const loading = ref(false);
const route = useRoute();
const currentComruleinfoId = ref(-1);
const dateFormat = "YYYY/MM/DD";
const isShowProduct = ref(false);
const listBreadcrumb = ref([
  { id: 1, text: "List Com", path: "/comrule" },
  {
    id: 2,
    text: route.query.id == undefined ? "Add Comrule" : "Update Comrule",
    path: "",
  },
]);

import { useCategoryStore } from "~/stores/category/category";

const categoryStore = useCategoryStore();

categoryStore.bindCategoryData();

import { useProductStore } from "~/stores/product/product";
import { parse } from "vue/compiler-sfc";
const productStore = useProductStore();
productStore.bindProductData();

const comruleStore = useComruleStore();

const curentProductName = ref("");
interface FormState {
  applyTo: number;
  targetId: number | undefined;
  targetName: string;
  smaregiCateId: number | undefined;
  comType: number | undefined;
  rateValue: string | undefined;
  atiRateValue: string | undefined;
  taxRate: string | undefined;
  validDate: Dayjs | undefined;
  validTo: Dayjs | undefined;
}
const formRef = ref();

const formState: UnwrapRef<FormState> = reactive({
  applyTo: 1,
  targetId: undefined,
  targetName: undefined,
  smaregiCateId: undefined,
  comType: 1,
  rateValue: undefined,
  atiRateValue: undefined,
  taxRate: undefined,
  validDate: undefined,
  validTo: undefined,
});

const rules: Record<string, Rule[]> = {
  applyTo: [
    { required: true, message: "Please input applyTo", trigger: "change" },
  ],
  targetId: [
    { required: true, message: "Please input targetId", trigger: "change" },
  ],
  comType: [
    { required: true, message: "Please input com type", trigger: "change" },
  ],
  rateValue: [
    { required: true, message: "Please input Tate Value", trigger: "change" },
  ],
  atiRateValue: [
    {
      required: true,
      message: "Please input ATI Rate",
      trigger: "change",
    },
  ],
  taxRate: [
    {
      required: true,
      message: "Please input Tax Rate",
      trigger: "change",
    },
  ],
};

const handleReset = () => {
  formRef.value.resetFields();
  isShowProduct.value = false;
};

//create onMounted hook
onMounted(async () => {
  console.log(route.query.id);
  if (route.query.id != "-1" && route.query.id) {
    currentComruleinfoId.value = Number(route.query.id);
    const res = await comruleStore.bindComruleById(currentComruleinfoId.value);
    if (res == undefined || res == null) {
      return;
    }
    console.log("res: ", res);
    formState.applyTo = res.applyTo;
    formState.comType = res.comType;
    formState.smaregiCateId = res.smaregiCateId;
    formState.targetName = res.targetName;
    formState.rateValue =
      res.rateValue != undefined && res.rateValue != null
        ? parseInt(res.rateValue)
        : undefined;
    formState.atiRateValue =
      res.atiRateValue != undefined && res.atiRateValue != null
        ? parseInt(res.atiRateValue)
        : undefined;
    formState.taxRate =
      res.taxRate != undefined && res.taxRate != null
        ? parseInt(res.taxRate)
        : undefined;
    formState.validDate =
      res.validDate != undefined && res.validDate != null
        ? dayjs(res.validDate, dateFormat)
        : undefined;
    formState.validTo =
      res.validTo != undefined && res.validTo != null
        ? dayjs(res.validTo, dateFormat)
        : undefined;
    formState.targetId =
      res.targetId != undefined && res.targetId != null
        ? parseInt(res.targetId)
        : undefined;
  }
});

const handleSaveDate = async () => {
  console.log("handleSaveData");
  try {
    await formRef.value.validate();
    loading.value = true;
    let dataComruleinfo = {
      applyTo: formState.applyTo ? parseInt(formState.applyTo) : undefined,
      comType: formState.comType ? parseInt(formState.comType) : undefined,
      targetId: formState.targetId ? parseInt(formState.targetId) : undefined,
      smaregiCateId: formState.smaregiCateId
        ? parseInt(formState.smaregiCateId)
        : undefined,
      targetName: formState.targetName,

      rateValue: formState.rateValue
        ? parseInt(formState.rateValue)
        : undefined,
      atiRateValue: formState.atiRateValue
        ? parseInt(formState.atiRateValue)
        : undefined,
      taxRate: formState.taxRate ? parseInt(formState.taxRate) : undefined,
      validDate: formState.validDate,
      validTo: formState.validTo,
    };
    if (currentComruleinfoId.value > 0) {
      await comruleStore.updateComrule(
        currentComruleinfoId.value,
        dataComruleinfo
      );
      loading.value = false;
      message.success("Update comrule successfully");
    } else {
      await comruleStore.addComrule(dataComruleinfo);
      handleReset();
      loading.value = false;
      message.success("Create comrule successfully");
    }
  } catch (error) {
    console.log("error", error);
    loading.value = false;
  }
};
const handleSelectApplyTo = (value: number) => {
  if (value == 1) {
    isShowProduct.value = false;
  } else {
    isShowProduct.value = true;
  }
  handClearDataSelect();
};
const handleSelectCategory = (value: number) => {
  console.log("handleSelectCategory", value);
  formState.targetId = value;
  const category = categoryStore.getCategoryList.find(
    (item) => item.id == value
  );
  if (category) {
    formState.targetName = category.name;
    formState.smaregiCateId = category.smaregiCateId
      ? parseInt(category.smaregiCateId)
      : undefined;
  }
};
const handleSelectProduct = (value: number) => {
  console.log("handleSelectProduct", value);
  formState.targetId = value;
  const product = productStore.getProductList.find((item) => item.id == value);
  if (product) {
    formState.targetName = product.name;
    formState.smaregiCateId = product.groupId
      ? parseInt(product.groupId)
      : undefined;
  }
  curentProductName.value = "";
};
const handClearDataSelect = () => {
  formState.targetId = undefined;
  formState.targetName = undefined;
};
const onSearch = async (value: string) => {
  console.log("onSearch", value);
  // filter product by name is value
  curentProductName.value = value;
  // await productStore.searchProduct(value);
};
// create computed productfiltered by name
const productFiltered = computed(() => {
  let listTmp = productStore.getProductList;
  if (curentProductName.value != "") {
    listTmp = listTmp.filter((item) =>
      item.name.toLowerCase().includes(curentProductName.value.toLowerCase())
    );
  }
  return listTmp;
});
</script>
