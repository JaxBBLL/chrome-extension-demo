<template>
  <div class="p-2 page-container">
    <button
      class="px-2 py-1 border border-blue-600 border-solid rounded"
      type="button"
      @click="count++"
    >
      count is {{ count }}
    </button>
  </div>
</template>

<script setup lang="ts">
const count = ref(0);
</script>

<style scoped>
.page-container {
  width: 500px;
  height: 500px;
  background: #fff;
}
</style>
