<script setup lang="ts">
import { ref } from "vue";

defineProps<{ msg: string }>();

const count = ref(0);
</script>

<template>
  <div class="container mx-auto">
    <h1>{{ msg }}</h1>
    <button
      class="px-2 py-1 rounded border border-blue-600 border-solid"
      type="button"
      @click="count++"
    >
      count is {{ count }}
    </button>
  </div>
</template>

<style scoped></style>
