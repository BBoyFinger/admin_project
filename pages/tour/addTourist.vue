<template>
  <div>
    <CommonsBreadcrumbCard :listItem="listBreadcrumb" />
    <a-card size="small" title="Add New Tourist" style="width: 100%">
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

      <a-form ref="formRef" :model="formState" :rules="rules">
        <a-form-item label="Name" name="name">
          <a-input v-model:value="formState.name" placeholder="Enter Name" />
        </a-form-item>

        <a-form-item label="Phone" name="phone">
          <a-input
            v-model:value="formState.phone"
            placeholder="Enter Phone Number"
          />
        </a-form-item>

        <a-form-item label="Passport" name="passport">
          <a-input
            v-model:value="formState.passport"
            placeholder="Enter Passport Number"
          />
        </a-form-item>

        <a-form-item label="Birthday" name="birthday">
          <a-date-picker
            v-model:value="formState.birthday"
            style="width: 100%"
          />
        </a-form-item>

        <a-form-item>
          <a-button type="primary">Create</a-button>
          <a-button style="margin-left: 10px" @click="handleReset"
            >Reset</a-button
          >
          <a-button style="margin-left: 10px">
            <Nuxt-Link to="/tour/tourlist">Back to list</Nuxt-Link>
          </a-button>
        </a-form-item>
      </a-form>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
import { reactive, toRaw, ref } from "vue";
import type { Rule } from "ant-design-vue/es/form";
import type { UnwrapRef } from "vue";

definePageMeta({
  layout: "admin",
  // middleware: "auth",
});

const listBreadcrumb = ref([
  { id: 1, text: "Add Tuorist", path: "/tour/addtourist" },
]);
const loading = ref(false);

interface FormState {
  name: string;
  phone: string;
  passport: string;
  birthday: string;
}
const formRef = ref();

const formState: UnwrapRef<FormState> = reactive({
  name: "",
  phone: "",
  passport: "",
  birthday: "",
  guildCom: "",
  paymentStatus: "",
});

const rules: Record<string, Rule[]> = {
  name: [
    { required: true, message: "Please input activity form", trigger: "blur" },
  ],
  phone: [
    { required: true, message: "Please input activity form", trigger: "blur" },
  ],
  passport: [
    { required: true, message: "Please input activity form", trigger: "blur" },
  ],
  birthday: [
    { required: true, message: "Please input activity form", trigger: "blur" },
  ],
};

const handleReset = () => {
  formRef.value.resetFields();
};
</script>
