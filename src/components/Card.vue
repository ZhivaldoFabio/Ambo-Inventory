<script setup>
import { defineProps } from 'vue';

defineProps({
  bg: {
    type: String,
    default: 'bg-secondary-100',
  },
});
</script>

<template>
  <div :class="`${bg} p-5 rounded-lg shadow-md flex flex-col`">
    <slot></slot>
  </div>
</template>
