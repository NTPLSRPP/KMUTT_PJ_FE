<template>
  <div>
    <div class="flex justify-center items-center flex-row gap-3">
      <div
        v-for="(count, status) in statusCounts"
        :key="status"
        :class="[
          'bg-gray-100 text-black text-center rounded-lg p-2 border-2 cursor-pointer ',
          getStatusClass(status)
        ]"
        @click="changeStatus(status)"
      >
        <p>{{ status }} : {{ count }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue'
import { getStatusClass, shortenTitle } from '@/lib/utils';
defineProps({
  statusCounts: {
    type: Object,
    required: true
  }
})
const emit = defineEmits(['filterStatus'])
const status = ref([])

const changeStatus = (statusName) => {
  // if (status.value.includes(statusName)) {
  //   status.value = status.value.filter((s) => s !== statusName)
  // } else {
  //   status.value.push(statusName)
  // }
  // emit('filterStatus', status.value)
  emit('filterStatus', statusName)
}

</script>

<style lang="scss" scoped></style>
