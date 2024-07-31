<!-- @format -->

<template>
  <div>This is Dashboard</div>
</template>
<script lang="ts" setup>
definePageMeta({
  middleware: ["auth"],
  layout: "admin",
});
</script>
