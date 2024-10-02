<template>
  <div
    theme-data="light"
    class="flex justify-center items-center h-screen w-screen bg-opacity-80 bg-zinc-800"
  >
    <div class="itbkk-modal-status w-3/5">
      <Card class="items-center light self-center min-w-full h-full">
        <StatusForm>
          <template #nameAddOn>
            <p class="text-gray-500">({{ statusLength.nameLength }}/50)</p>
          </template>
          <template #name>
            <input
              type="text"
              placeholder="name is required"
              class="itbkk-status-name input input-bordered w-full bg-white"
              :class="{ 'shake-horizontal input-error': isNotUniqueName }"
              v-model="newStatus.name"
              maxlength="50"
            />
            <p v-show="isNotUniqueName" class="shake-horizontal text-error mt-2">
              Status name must be unique, please choose another name.
            </p>
          </template>
          <template #descriptionAddOn>
            <p class="text-gray-500">({{ statusLength.descriptionLength }}/200)</p>
          </template>
          <template #description>
            <textarea
              class="itbkk-status-description textarea textarea-bordered min-h-[8rem] w-full bg-white"
              placeholder="enter description here"
              v-model="newStatus.description"
              maxlength="200"
            ></textarea>
          </template>
          <template #limit>
            <input type="checkbox" class="toggle toggle-warning" v-model="newStatus.limitEnabled" />
          </template>
        </StatusForm>
        <CardFooter class="gap-3">
          <button
            class="itbkk-button-confirm btn btn-success text-white"
            :class="{ 'btn-disabled': newStatus.name.length === 0 || isNotUniqueName }"
            :disabled="newStatus.name.length === 0 || isNotUniqueName"
            @click="createNewStatus"
          >
            Save
          </button>

          <button class="itbkk-button-cancel btn btn-error text-white" @click="closePage">
            Cancel
          </button>
        </CardFooter>
      </Card>
    </div>
  </div>
</template>

<script setup>
import { ref, defineEmits, computed } from 'vue'
import { Card, CardFooter } from '@/components/ui/card/index.ts'
import { useRouter, useRoute } from 'vue-router'
import { createStatus } from '@/api/statusService.ts'
import StatusForm  from './StatusForm.vue'
import {useBoardStore} from "@/stores/BoardStore.ts";

const emit = defineEmits(['returnStatus'])
const newStatus = ref({ name: '', description: '', limitEnabled: false })
const router = useRouter()
const route = useRoute()
const boardStore = useBoardStore()
const statuses = computed(() => boardStore.statuses)


const statusLength = computed(() => ({
  nameLength: newStatus.value.name.length,
  descriptionLength: newStatus.value.description.length
}))

const isNotUniqueName = computed(() => {
  return statuses.value.some(
    (status) => status.name.toLowerCase() === newStatus.value.name.toLowerCase()
  )
})

const createNewStatus = async () => {
  try {
    await createStatus(route.params.boardID,newStatus.value)
  } catch (error) {
    emit('returnStatus', {
      displayResult: true,
      result: false,
      message: `An error occurred: ${error.message}`
    })
    router.back()
    return
  }
  emit('returnStatus', {
    displayResult: true,
    result: true,
    message: `Status "${newStatus.value.name}" created successfully`,
    from: 'addStatus',
    status: { ...newStatus.value, customizable: true }
  })
  router.back()
}

const closePage = () => {
  router.back()
}
</script>

<style scoped>
.shake-horizontal {
  -webkit-animation: shake-horizontal 0.8s cubic-bezier(0.455, 0.03, 0.515, 0.955) both;
  animation: shake-horizontal 0.8s cubic-bezier(0.455, 0.03, 0.515, 0.955) both;
}

@-webkit-keyframes shake-horizontal {
  0%,
  100% {
    -webkit-transform: translateX(0);
    transform: translateX(0);
  }
  10%,
  30%,
  50%,
  70% {
    -webkit-transform: translateX(-10px);
    transform: translateX(-10px);
  }
  20%,
  40%,
  60% {
    -webkit-transform: translateX(10px);
    transform: translateX(10px);
  }
  80% {
    -webkit-transform: translateX(8px);
    transform: translateX(8px);
  }
  90% {
    -webkit-transform: translateX(-8px);
    transform: translateX(-8px);
  }
}
@keyframes shake-horizontal {
  0%,
  100% {
    -webkit-transform: translateX(0);
    transform: translateX(0);
  }
  10%,
  30%,
  50%,
  70% {
    -webkit-transform: translateX(-10px);
    transform: translateX(-10px);
  }
  20%,
  40%,
  60% {
    -webkit-transform: translateX(10px);
    transform: translateX(10px);
  }
  80% {
    -webkit-transform: translateX(8px);
    transform: translateX(8px);
  }
  90% {
    -webkit-transform: translateX(-8px);
    transform: translateX(-8px);
  }
}
</style>
