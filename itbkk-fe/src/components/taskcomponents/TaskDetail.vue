<template>
  <div
    data-theme="light"
    class="flex justify-center items-center h-screen w-screen bg-opacity-80 bg-zinc-800"
  >
    <div class="w-3/5">
      <Card class="items-center self-center w-auto" v-if="isLoading">
        <CardHeader class="flex justify-center items-center">
          <span class="loading loading-spinner loading-lg"></span>
        </CardHeader>
      </Card>
      <Card
        class="itbkk-modal-task light items-center self-center min-w-full h-full"
        v-if="!fetchError.hasError && !isLoading"
      >
        <TaskForm>
          <template #title
            ><div>
              <div class="space-x-5 rounded-md border p-4">
                <p class="itbkk-title">
                  {{ task.title }}
                </p>
              </div>
            </div></template
          >
          <template #description>
            <div class="space-x-5 border p-4 rounded-md">
              <h1 class="break-words">
                <p
                  class="itbkk-description"
                  :class="
                    task.description === null || task.description?.length === 0
                      ? `italic text-slate-400`
                      : ``
                  "
                >
                  {{ task.description || 'No Description Provided' }}
                </p>
              </h1>
            </div>
          </template>
          <template #assignees
            ><div class="space-x-5 border p-3 rounded-md">
              <h1 class="break-words">
                <p
                  class="itbkk-assignees"
                  :class="
                    task.description === null || task.assignees?.length === 0
                      ? `italic text-slate-400`
                      : ``
                  "
                >
                  {{ task.assignees || 'Unassigned' }}
                </p>
              </h1>
            </div></template
          >
          <template #status
            ><div class="badge badge-neutral p-3 rounded-md">
              <p class="itbkk-status">{{ task.status.name }}</p>
            </div></template
          >
          <template #createdOn
            ><div class="stat-desc">
              <p class="itbkk-created-on">{{ task.createdOn }}</p>
            </div></template
          >
          <template #updatedOn
            ><div class="stat-desc">
              <p class="itbkk-updated-on">{{ task.updatedOn }}</p>
            </div></template
          >
          <template #timezone
            ><div class="stat-desc">
              <p class="itbkk-timezone">{{ task.timezone }}</p>
            </div></template
          >
        </TaskForm>
        <CardFooter>
          <Button class="justify-between content-between" @click="closePage">Close</Button>
        </CardFooter>
      </Card>

      <Card
        class="items-center self-center min-w-full h-full"
        v-else-if="fetchError.hasError && !isLoading"
      >
        <CardHeader class="flex justify-center items-center bg-rose-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="shrink-0 h-28 w-28 stroke-white"
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
        </CardHeader>
        <CardContent class="mt-2 flex flex-col items-center">
          <div class="text-xl">An Error Occurred</div>
          <div class="mt-2">{{ fetchError.message }}</div>
          <div>Please try again later</div>
        </CardContent>
        <CardFooter class="flex justify-center">
          <Button class="justify-between content-between bg-rose-500 text-white" @click="closePage"
            >Close</Button
          >
        </CardFooter>
      </Card>
    </div>
  </div>
</template>

<script setup>
import Button from '../ui/button/Button.vue'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { getTaskById } from '@/api/taskService.ts'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card/index.ts'
import { getUserTimeZoneId, UTCtoLocalFormat } from '@/utils/timeConverter.ts'
import TaskForm from './TaskForm.vue'
const router = useRouter()
const fetchError = ref({ hasError: false, message: '' })
const isLoading = ref(false)
const task = ref({
  title: '',
  description: '',
  assignees: '',
  status: {},
  createdOn: '',
  updatedOn: '',
  timezone: ''
})

const taskId = router.currentRoute.value.params.taskID
const boardId = router.currentRoute.value.params.boardID
onMounted(async () => {
  isLoading.value = true
  try {
    task.value = await getTaskById(boardId, taskId)
  } catch (error) {
    fetchError.value = { hasError: true, message: error.message }
    isLoading.value = false
    return
  }
  isLoading.value = false
  task.value.title = task.value.title ? task.value.title : 'No title'
  task.value.status = task.value.status ? task.value.status : 'No_status'
  task.value.createdOn = task.value.createdOn ? UTCtoLocalFormat(task.value.createdOn) : 'No Data'
  task.value.updatedOn = task.value.updatedOn ? UTCtoLocalFormat(task.value.updatedOn) : 'No Data'
  task.value.timezone = getUserTimeZoneId()
})

const closePage = () => {
  router.back()
}
</script>

<style lang="scss" scoped></style>
