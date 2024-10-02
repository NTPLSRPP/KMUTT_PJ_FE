<template>
  <div>
    <div
      data-theme="light"
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
              class="itbkk-status-name input input-bordered w-full space-x-5 border p-4 mt-2"
              :class="{ 'shake-horizontal input-error': isNotUniqueName || isNameNull }"
              v-model="statuses.name"
              maxlength="50"
            />
            <p v-show="isNotUniqueName || isNameNull" class="shake-horizontal text-error mt-2">
              {{ isNotUniqueName ? 'Status name must be unique, please choose another name.' : '' }}
              {{ isNameNull ? 'Status name cannot be empty' : '' }}
            </p>
          </template>
          <template #descriptionAddOn>
            <p class="text-gray-500">({{ statusLength.descriptionLength }}/200)</p>
          </template>
          <template #description>
            <textarea
              class="itbkk-status-description textarea textarea-bordered h-44 w-full"
              v-model="statuses.description"
              maxlength="200"
            >
            </textarea>
          </template>
          <template #limit>
            <input type="checkbox" class="toggle toggle-warning" v-model="statuses.limitEnabled" />
          </template>
          </StatusForm>
          <CardFooter>
            <button
              class="itbkk-button-confirm btn btn-success w-20 mr-3"
              :class="{ 'btn-disabled': !isDirty || isNotUniqueName || isNameNull }"
              @click="saveStatus"
              :disabled="!isDirty || isNotUniqueName || isNameNull"
            >
              Save
            </button>
            <button class="itbkk-button-cancel btn btn-error w-20" @click="closePage">
              Cancel
            </button>
            
          </CardFooter>
        </Card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { Card, CardFooter } from '@/components/ui/card/index.ts'
import { useRouter } from 'vue-router'
import { getAllStatuses, getStatusById, updateStatus } from '@/api/statusService.ts'
import StatusForm  from './StatusForm.vue'
const emits = defineEmits(['return-status'])
const router = useRouter()
const statuses = ref({
  id: Number,
  name: String,
  description: String,
  limitEnabled: Boolean,
  customizable: Boolean
})

const statusOrg = ref({
  id: Number,
  name: String,
  description: String,
  limitEnabled: Boolean,
  customizable: Boolean
})

const statusId = router.currentRoute.value.params.statusID
const boardId = router.currentRoute.value.params.boardID
const statusList = ref([])

onMounted(async () => {
  try {
    const fetchedStatus = await getStatusById(boardId, statusId)
    if (fetchedStatus.description === null) {
      fetchedStatus.description = ''
    }
    statusList.value = await getAllStatuses(boardId)
    statusOrg.value = { ...fetchedStatus }
    statuses.value = { ...fetchedStatus }
    if (!statuses.value.customizable) {
      emits('return-status', {
        displayResult: true,
        result: false,
        message: `Cannot edit status "${statuses.value.name}".`
      })
      router.back()
    }
  } catch (error) {
    emits('return-status', {
      displayResult: true,
      result: false,
      message: `An error has occurred, the status does not exist`
    })
    router.back()
  }
})

const isNameNull = computed(() => {
  return statuses.value.name.length === 0 ? true : false
})

const isNotUniqueName = computed(() => {
  return statusList.value.some(
    (status) =>
      status.name.toLowerCase() === statuses.value.name.toLowerCase() &&
      status.id !== statuses.value.id
  )
})

const isDirty = computed(() => {
  return JSON.stringify(statusOrg.value) !== JSON.stringify(statuses.value)
})

const statusLength = computed(() => ({
  nameLength: statuses.value.name.length,
  descriptionLength: statuses.value.description === null ? 0 : statuses.value.description.length
}))

const saveStatus = async () => {
  if (isDirty.value) {
    try {
      await updateStatus(boardId, statuses.value.id, statuses.value)
      emits('return-status', {
        newStatus: statuses.value,
        displayResult: true,
        result: true,
        message: `Status "${statuses.value.name}" updated successfully`,
        from: 'editStatus',
        status: {...statuses.value, customizable: true}
      })
      router.back()
    } catch (error) {
      emits('return-status', {
        displayResult: true,
        result: false,
        message: `An error occurred: ${error.message}`
      })
      router.back()
    }
  }
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
