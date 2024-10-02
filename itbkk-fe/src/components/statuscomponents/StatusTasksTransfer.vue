<template>
  <div
    data-theme="light"
    class="flex justify-center items-center h-screen w-screen bg-opacity-80 bg-zinc-800"
  >
    <div class="itbkk-modal-status w-1/2">
      <Card class="itbkk-modal-task light items-center self-center min-w-full h-full light">
        <CardHeader>
          <h2 class="font-bold text-lg">
            Tasks in {{ statusToTransfer?.name }} is exceed the limit
          </h2>
          <p class="text-gray-400">please transfer the status below</p>
          <div
            class="badge rounded-md mt-2 h-5"
            :class="TaskCount > 10 ? 'badge-error' : 'badge-success'"
          >
            {{ TaskCount }} /10
          </div>
        </CardHeader>
        <CardContent class="max-h-96 overflow-auto">
          <table class="table">
            <thead>
              <tr>
                <th></th>
                <th>Title:</th>
                <th>Status:</th>
                <th>Original</th>
                <th></th>
                <th>Transfer to</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(task, key) in tasks" :key="task.id">
                <td>{{ key + 1 }}</td>
                <td>{{ task.title }}</td>
                <td>
                  <select
                    class="select select-bordered"
                    v-model="task.status"
                    :selected="task.status"
                  >
                    <option
                      v-for="(selectStatus, key) in statusesList"
                      :key="key"
                      :value="selectStatus"
                    >
                      <p>{{ shortenTitle(selectStatus.name) }}</p>
                    </option>
                  </select>
                </td>
                <td>
                  {{ TaskCount }}/<span v-if="task.status.limitEnabled">10</span
                  ><span v-else><v-icon name="bi-infinity" class="pt-1" /></span>
                </td>
                <td><v-icon name="co-arrow-right" /></td>
                <td
                  ref="transferConditions"
                  :class="task.status.limitEnabled ? getBadgeClass(task.status.id) : `text-success`"
                >
                  {{ getStatusValue(task.status.id) }}/<span v-if="task.status.limitEnabled"
                    >10</span
                  ><span v-else><v-icon name="bi-infinity" class="pt-1" /></span>
                </td>
              </tr>
            </tbody>
          </table>
        </CardContent>
        <CardFooter class="w-1/3 gap-2 pt-5">
          <button @click="$emit('cancelLimit', statusToTransfer.id)" class="btn w-1/2">
            Cancel
          </button>
          <button
            @click="saveAll"
            class="btn w-1/2"
            :class="TaskCount > constLimit || isTaskOverflow ? 'btn-disabled' : 'btn-success'"
          >
            Save
          </button>
        </CardFooter>
      </Card>
    </div>
  </div>
</template>

<script setup>
import { getAllTasksInStatus, updateAllTasks } from '@/api/taskService'
import { getAllStatuses, checkTaskDepend } from '@/api/statusService'
import { shortenTitle } from '@/lib/utils.ts'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card/index.ts'
import { ref, onMounted, computed, watch, onBeforeUnmount } from 'vue'
import { getConstants } from '@/api/constantService'
const props = defineProps({
  statusToTransfer: {
    type: Object,
    require: true
  }
})

const emits = defineEmits(['cancelLimit', 'crudAlert'])
const constLimit = ref(10)
const observer = new MutationObserver((mutations) => {
  for (const m of mutations) {
    if (transferConditions.value.every((ele) => ele.className.includes(`success`)))
      isTaskOverflow.value = false
    else isTaskOverflow.value = true
  }
})

onMounted(async () => {
  try {
    statusesList.value = await getAllStatuses()
    tasks.value = await getAllTasksInStatus(props.statusToTransfer.name)
    currentUsage.value = await checkTaskDepend()
    constLimit.value = await getConstants('GStatLim')
  } catch (error) {
    emits('crudAlert', {
      displayResult: true,
      result: false,
      message: error.message
    })
  }

  const config = { attributes: true }
  transferConditions.value.forEach((td) => {
    observer.observe(td, config)
  })
})

onBeforeUnmount(() => {
  observer.disconnect()
})

const tasks = ref([])
const statusesList = ref([])
const currentUsage = ref([])

const transferConditions = ref([])
const isTaskOverflow = ref(true)

const allConditionsSuccess = computed(() => {
  return transferConditions.value.every((elem) => elem.className.includes('success'))
})

const TaskCount = computed(() => {
  let count = 0
  tasks.value.forEach((task) => {
    if (task.status.name === props.statusToTransfer.name) {
      count++
    }
  })
  return count
})

watch(allConditionsSuccess, (newValue) => {
  isTaskOverflow.value = !newValue
})

const getStatusValue = computed(() => {
  const statusValues = {}

  tasks.value.forEach((task) => {
    if (!statusValues[task.status.id]) {
      statusValues[task.status.id] = 0
    }
    statusValues[task.status.id]++
  })

  return (statusId) => {
    if (props.statusToTransfer.id === statusId) {
      return TaskCount.value
    }

    const taskCount = statusValues[statusId] || 0
    return (currentUsage.value[statusId] || 0) + taskCount
  }
})

const getBadgeClass = (statusId) => {
  return getStatusValue.value(statusId) > 10 ? 'text-error' : 'text-success'
}

const saveAll = async () => {
  const transferedTasks = tasks.value.filter((task) => task.status.name != props.statusToTransfer.name)
  try {
    await updateAllTasks(transferedTasks)
    emits('crudAlert', {
      displayResult: true,
      result: true,
      message: 'All tasks have been transferred successfully'
    })
  } catch (error) {
    emits('cancelLimit', props.statusToTransfer.id)
    emits('crudAlert', {
      displayResult: true,
      result: false,
      message: error.message
    })
  }
}
</script>

<style scoped></style>
