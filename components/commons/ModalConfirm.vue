<template>
  <a-modal
    v-model:open="showModal"
    :title="title"
    centered
    @ok="handleConfirmOK"
    @cancel="handleConfirmCancel"
    :width="width"
    :maskClosable="false"
  >
    <slot></slot>
  </a-modal>
</template>
<script lang="ts" setup>
const props = defineProps(["showModal", "title", "width"]);
const { showModal, title, width } = toRefs(props);
const emit = defineEmits(["confirmOK", "confirmCancel"]);

function handleConfirmOK() {
  emit("confirmOK");
}
function handleConfirmCancel() {
  emit("confirmCancel");
}
</script>
