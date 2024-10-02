<template>
  <div data-theme="light"
    v-if="crudAlert.displayResult"
    role="alert"
    class="alert absolute bottom-3 right-3 w-1/3 z-10 "
    :class="crudAlert.result ? 'bg-success border-success' : 'bg-error border-error'"
  >
    <svg
      v-if="crudAlert.result"
      xmlns="http://www.w3.org/2000/svg"
      class="stroke-current shrink-0 h-6 w-6"
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
    <svg
      v-else
      xmlns="http://www.w3.org/2000/svg"
      class="stroke-current shrink-0 h-6 w-6"
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
    <span class="itbkk-message">{{ crudAlert.message }}</span>
    <button class="btn btn-xs btn-outline btn-circle" @click="closeAlert">X</button>
  </div>
</template>

<script setup>
defineProps({
  crudAlert: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['updateDisplayResult'])

const closeAlert = () => {
  emit('updateDisplayResult', false)
}
</script>

<style scoped>

</style>
