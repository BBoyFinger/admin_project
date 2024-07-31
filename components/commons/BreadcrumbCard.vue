<template>
  <a-breadcrumb style="padding: 10px">
    <a-breadcrumb-item>Home</a-breadcrumb-item>
    <a-breadcrumb-item v-for="item in listItem" :key="item.id"
      ><NuxtLink v-if="item.path.length > 0" :to="item.path">{{
        item.text
      }}</NuxtLink>
      <span v-else>{{ item.text }}</span>
    </a-breadcrumb-item>
  </a-breadcrumb>
</template>
<script lang="ts" setup>
const props = defineProps(["listItem"]);
const { listItem } = toRefs(props);
</script>
