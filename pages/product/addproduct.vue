<template>
  <div>
    <CommonsBreadcrumbCard :listItem="listBreadcrumb" />
    <a-card
      size="small"
      :title="route.query.id == undefined ? 'Add Product' : 'Update Product'"
      style="width: 100%"
    >
      <a-form ref="formRef" :model="formState" :rules="rules">
        <a-row :gutter="10">
          <a-col :xs="24" :sm="24" :md="6" :lg="6" :xl="6">
            <a-form-item label="Category" name="cateId">
              <a-select
                @select="handleSelectCategory"
                width="100%"
                v-model:value="formState.cateId"
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
          <a-col :xs="24" :sm="24" :md="6" :lg="6" :xl="6">
            <a-form-item label="Smaregi Cate" name="groupId">
              <a-select
                @select="handleSelectCategory"
                width="100%"
                v-model:value="formState.groupId"
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
        </a-row>
        <a-row :gutter="10">
          <a-col :xs="24" :sm="24" :md="6" :lg="6" :xl="6">
            <a-form-item label="Name" name="name">
              <a-input v-model:value="formState.name" />
            </a-form-item>
          </a-col>
          <a-col :xs="24" :sm="24" :md="6" :lg="6" :xl="6">
            <a-form-item label="Code" name="code">
              <a-input v-model:value="formState.code" />
            </a-form-item>
          </a-col>
          <a-col :xs="24" :sm="24" :md="6" :lg="6" :xl="6">
            <a-form-item label="Tag" name="tag">
              <a-input v-model:value="formState.tag" />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter="10">
          <a-col :xs="24" :sm="24" :md="6" :lg="6" :xl="6">
            <a-form-item label="Tax Type" name="taxType">
              <a-select
                width="100%"
                v-model:value="formState.taxType"
                placeholder="please select parent"
                :options="
                  productStore.getTaxTypeList.map((item) => {
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
          <a-col :xs="24" :sm="24" :md="6" :lg="6" :xl="6">
            <a-form-item label="Price" name="price">
              <a-input type="number" v-model:value="formState.price" />
            </a-form-item>
          </a-col>
          <a-col :xs="24" :sm="24" :md="6" :lg="6" :xl="6">
            <a-form-item label="Member Price" name="memberPrice">
              <a-input type="number" v-model:value="formState.memberPrice" />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter="10">
          <a-col :xs="24" :sm="24" :md="16" :lg="16" :xl="16">
            <a-form-item label="Thumbnail" name="thumbnail">
              <a-input v-model:value="formState.thumbnail" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-form-item style="margin-top: 10px">
          <a-button>
            <Nuxt-Link to="/product">Back</Nuxt-Link>
          </a-button>
          <a-button
            style="margin-left: 10px"
            :disabled="route.query.id != '-1' && route.query.id != undefined"
            @click="handleReset"
            >Reset</a-button
          >
          <a-button
            type="primary"
            style="margin-left: 10px"
            :loading="loading"
            @click="handleSaveDate"
          >
            {{ route.query.id == undefined ? "Add Product" : "Update" }}
          </a-button>
        </a-form-item>
      </a-form>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
import { message } from "ant-design-vue";
import { reactive, ref } from "vue";
import type { Rule } from "ant-design-vue/es/form";
import { useProductStore } from "~/stores/product/product";
import type { UploadChangeParam } from "ant-design-vue";
import dayjs, { Dayjs } from "dayjs";

definePageMeta({
  layout: "admin",
  // middleware: "auth",
});

const loading = ref(false);
const route = useRoute();
const currentProductinfoId = ref(-1);

const listBreadcrumb = ref([
  { id: 1, text: "List Product", path: "/product" },
  {
    id: 2,
    text: route.query.id == undefined ? "Add Product" : "Update Product",
    path: "",
  },
]);

import { useCategoryStore } from "~/stores/category/category";

const categoryStore = useCategoryStore();

categoryStore.bindCategoryData();

const productStore = useProductStore();

interface FormState {
  name: string;
  code: string;
  thumbnail: string;
  cateId: string | undefined;
  taxType: number | undefined;
  price: number | undefined;
  memberPrice: number | undefined;
  tag: string | undefined;
  groupId: string | undefined;
  createdDate: Dayjs | undefined;
}
const formRef = ref();

const formState: UnwrapRef<FormState> = reactive({
  name: undefined,
  code: undefined,
  thumbnail: undefined,
  cateId: undefined,
  taxType: 1,
  price: undefined,
  memberPrice: undefined,
  tag: undefined,
  groupId: undefined,
  createdDate: undefined,
});

const rules: Record<string, Rule[]> = {
  name: [{ required: true, message: "Please input Name", trigger: "change" }],
  code: [{ required: true, message: "Please input Code", trigger: "change" }],
  taxType: [
    { required: true, message: "Please input Tax Type", trigger: "change" },
  ],
  price: [{ required: true, message: "Please input Price", trigger: "change" }],
};

const handleReset = () => {
  formRef.value.resetFields();
};

//create onMounted hook
onMounted(async () => {
  console.log(route.query.id);
  if (route.query.id != "-1" && route.query.id) {
    currentProductinfoId.value = Number(route.query.id);
    const res = await productStore.bindProductById(currentProductinfoId.value);
    if (res == undefined || res == null) {
      return;
    }
    console.log("res: ", res);
    formState.name = res.name || "";
    formState.code = res.code || "";
    formState.tag = res.tag || "";
    formState.cateId = res.cateId || undefined;
    formState.taxType = res.taxType || null;
    formState.price = res.price;
    formState.memberPrice = res.memberPrice;
    formState.thumbnail = res.thumbnail;
    formState.groupId = res.groupId || undefined;
  }
});

// Upload images
const fileList = ref([]);

const handleSaveDate = async () => {
  console.log("handleSaveData");
  try {
    await formRef.value.validate();
    loading.value = true;
    let dataProductinfo = {
      name: formState.name,
      code: formState.code,
      tag: formState.tag,
      cateId: formState.cateId ? parseInt(formState.cateId) : undefined,
      taxType: formState.taxType ? parseInt(formState.taxType) : undefined,
      price: formState.price ? parseInt(formState.price) : undefined,
      memberPrice: formState.memberPrice
        ? parseInt(formState.memberPrice)
        : undefined,
      thumbnail: formState.thumbnail,
      groupId: formState.groupId ? parseInt(formState.groupId) : undefined,
    };
    if (currentProductinfoId.value > 0) {
      await productStore.updateProduct(
        currentProductinfoId.value,
        dataProductinfo
      );
      loading.value = false;
      message.success("Update product successfully");
    } else {
      await productStore.addProduct(dataProductinfo);
      handleReset();
      loading.value = false;
      message.success("Create product successfully");
    }
  } catch (error) {
    console.log("error", error);
    loading.value = false;
  }
};
</script>
