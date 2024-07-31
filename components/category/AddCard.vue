<template>
  <a-modal
    v-model:open="showModal"
    :title="categoryItem ? 'Edit Category' : 'Add Category'"
    centered
    @ok="handleConfirmOK"
    @cancel="handleConfirmCancel"
    :maskClosable="false"
    :width="modalWidth"
  >
    <template #footer>
      <a-button @click="handleReset">Reset</a-button>
      <a-button
        key="submit"
        type="primary"
        :loading="loading"
        @click="handleConfirmOK"
        >Submit</a-button
      >
    </template>
    <a-form ref="formRef" :model="formState" :rules="rules">
      <a-row :gutter="10">
        <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
          <a-form-item label="Name" name="name">
            <a-input v-model:value="formState.name" />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="10">
        <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
          <a-form-item label="Code" name="code">
            <a-input v-model:value="formState.code" />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="10">
        <a-col :xs="24" :sm="24" :md="6" :lg="6" :xl="6">
          <a-form-item label="Parent" name="parentId">
            <a-select
              width="100%"
              v-model:value="formState.parentId"
              placeholder="please select parent"
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
          <a-form-item label="Order" name="order">
            <a-input v-model:value="formState.order" />
          </a-form-item>
        </a-col>
        <a-col :xs="24" :sm="24" :md="6" :lg="6" :xl="6">
          <a-form-item label="Tag" name="tag">
            <a-input v-model:value="formState.tag" />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-modal>
</template>
<script lang="ts" setup>
import { message } from "ant-design-vue";
const props = defineProps(["showModal", "modalWidth", "categoryItem"]);
const { showModal, modalWidth, categoryItem } = toRefs(props);
const emit = defineEmits(["confirmOK", "confirmCancel"]);

import type { Rule } from "ant-design-vue/es/form";
const loading = ref(false);
import { useCategoryStore } from "~/stores/category/category";

const categoryStore = useCategoryStore();

interface FormState {
  name: string;
  code: string;
  parentId: number | undefined;
  order: number | null;
  tag: string | undefined;
}
const formRef = ref();

const formState: UnwrapRef<FormState> = reactive({
  name: "",
  code: "",
  parentId: undefined,
  order: null,
  tag: null,
});

const rules: Record<string, Rule[]> = {
  name: [
    {
      required: true,
      message: "Please input Name",
      trigger: "change",
    },
  ],
  code: [
    {
      required: true,
      message: "Please input Code",
      trigger: "change",
    },
  ],
};

// create watch categoryStore.getCurentCategory and bind formState data

watch(categoryItem, () => {
  console.log("categoryItem", categoryItem.value);
  if (categoryItem.value) {
    console.log(
      "categoryStore.getCurentCategory",
      categoryStore.getCurentCategory.id
    );
    bindCategoryData();
  } else {
    formState.name = "";
    formState.code = "";
    formState.parentId = undefined;
    formState.order = null;
    formState.tag = "";
  }
});

const bindCategoryData = () => {
  formState.name = categoryStore.getCurentCategory.name;
  formState.code = categoryStore.getCurentCategory.code;
  formState.parentId = categoryStore.getCurentCategory.parentId;
  formState.order = categoryStore.getCurentCategory.order;
  formState.tag = categoryStore.getCurentCategory.tag;
};

// create onMounted hook and bind Category data
onMounted(() => {
  //   bindCategoryData();
  categoryStore.clearSearchField();
  categoryStore.bindCategoryData();
});

function handleConfirmOK() {
  formRef.value
    .validate()
    .then(() => {
      // Enter save logic here
      loading.value = true;

      let dataCategory = {
        name: formState.name,
        code: formState.code,
        parentId: formState.parentId
          ? parseInt(formState.parentId.toString())
          : undefined,
        order: formState.order ? parseInt(formState.order.toString()) : null,
        tag: formState.tag,
      };
      console.log("dataCategory", dataCategory);
      if (categoryStore.getCurentCategory.id) {
        // Edit
        categoryStore.updateCategory(
          categoryStore.getCurentCategory.id,
          dataCategory
        );
        message.success("Update category successfully");
      } else {
        // Add
        categoryStore.addCategory(dataCategory);
        message.success("Add category successfully");
      }

      emit("confirmOK");
      loading.value = false;
      handleReset();
    })
    .catch((error: any) => {
      loading.value = false;
      console.log("error", error);
    });
}
function handleConfirmCancel() {
  emit("confirmCancel");
}
const handleReset = () => {
  console.log("reset");
  formRef.value.resetFields();
  categoryStore.clearItem();
};
</script>
