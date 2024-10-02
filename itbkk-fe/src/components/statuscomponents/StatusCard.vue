<script setup>
import { getStatusClass } from '../../lib/utils.ts'
import { defineEmits } from 'vue'

defineProps({
  status: {
    type: String,
    require: true
  }
})
defineEmits(['removeStatusFilter'])
</script>

<template>
  <div
    class="flex items-center border rounded-sm badge gap-2 pl-1 pr-2 h-7 text-sm justify-between"
    :class="getStatusClass(status)"
  >
    <span>{{ status }}</span>
    <span class="translate-y-[0.08rem]"
      ><v-icon name="md-cancel" @click="$emit('removeStatusFilter', status)"></v-icon
    ></span>
  </div>
</template>

<style scoped></style>
