<template>
  <div data-theme="light">
    <div class="w-screen h-screen overflow-scroll">
      <div class="flex justify-center items-center p-6">
        <h1>
          <p class="font-bold text-3xl items-center gap-2 flex tracking-in-expand-fwd-top">
            INTEGRATED PROJECT ITBKK-SY-1
          </p>
        </h1>
      </div>
      <div class="absolute top-10 right-10 z-10">
        <Button
          @click="navigateToStatus()"
          class="itbkk-manage-status bg-green-700 text-18 text-red-50 hover:bg-green-800 mr-2"
          >Manage Status</Button
        >
        <Button
          class="itbkk-button-add bg-blue-700 text-18 text-red-50 hover:bg-blue-800 mr-2"
          @click="navigateToAddTask"
          >Add Task</Button
        >
        <Button
          v-if="!authStore.isAuthenticated"
          class="itbkk-button-add bg-yellow-700 text-18 text-red-50 hover:bg-yellow-800"
          @click="navigateToLogin"
          >Login</Button
        >
        <Button
          v-if="authStore.isAuthenticated"
          class="itbkk-button-add bg-yellow-700 text-18 text-red-50 hover:bg-yellow-800"
          @click="logout"
          >Logout</Button
        >
      </div>

      <div class="flex items-center justify-evenly">
        <CountCard
          :statusCounts="statusCounts"
          @filter-status="
            (statusName) => {
              if (!selectedStatus.includes(statusName)) {
                selectedStatus.push(statusName)
              }
            }
          "
        ></CountCard>
      </div>
      <CrudResponseAlert
        class="z-100"
        :crudAlert="crudResult"
        @update-displayResult="crudResult.displayResult = $event"
      >
      </CrudResponseAlert>
      <div class="flex gap-2 flex-col">
        <div v-if="authStore.isAuthenticated" class="ml-4 itbkk-fullname">
          Welcome, {{ authStore.decodedToken.name }}
        </div>
        <div class="dropdown dropdown-bottom ml-3 w-1/5">
          <div
            class="border h-8 rounded-md min-w-52 items-center flex pr-6"
            role="button"
            tabindex="0"
          >
            <span v-if="selectedStatus.length < 1" class="ml-1 leading-8 text-base"
              >Filter by status(es)</span
            >
            <span v-else v-for="status in selectedStatus" :key="status.id" class="ml-0.5 mr-3"
              ><StatusCard
                @remove-status-filter="
                  (statusName) => {
                    let delIndex = selectedStatus.find((stat) => stat === statusName)
                    selectedStatus.splice(delIndex, 1)
                  }
                "
                :status="status"
              ></StatusCard>
            </span>
            <button
              class="btn btn-ghost btn-sm scale-75 btn-neutral absolute right-0"
              @click="selectedStatus.length = 0"
            >
              X
            </button>
          </div>
          <ul tabindex="0" class="dropdown-content z-[1] menu p-2 shadow bg-base-100 w-52">
            <div v-for="(status, key) in statusesList" :key="key">
              <li v-if="!selectedStatus.includes(status.name)">
                <a class="break-all" @click="selectedStatus.push(status.name)">{{ status.name }}</a>
              </li>
            </div>
          </ul>
        </div>
      </div>

      <div class="px-6 slide-in-left">
        <!-- <div class="overflow-y-auto h-[780px] pt-2"> -->
        <!-- Set the height as required -->
        <table class="table mb-30">
          <thead class="text-slate-700">
            <tr>
              <th class="font-bold text-[1.5rem]">No.</th>
              <th class="font-bold text-[1.5rem]">Title</th>
              <th class="font-bold text-[1.5rem]">Assignees</th>
              <th class="font-bold text-[1.5rem] cursor-pointer">
                Status
                <v-icon
                  @click="nextIcon"
                  :class="
                    currentIcon === 'descSort' || currentIcon === 'ascSort'
                      ? 'text-blue-400'
                      : 'text-stone-400'
                  "
                  :name="
                    currentIcon === 'defaultSort' || currentIcon === 'ascSort'
                      ? 'co-sort-alpha-down'
                      : 'co-sort-alpha-up'
                  "
                  scale="1.5"
                ></v-icon>
              </th>
              <th class="font-bold text-[1.5rem]">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr class="itbkk-item hover" v-for="(task, key) in sortedTasks" :key="key">
              <td class="pl-5">
                <div class="flex">
                  <p class="itbkk-title font-bold text-[1rem]">{{ key + 1 }}</p>
                </div>
              </td>
              <td @click="openTaskDetail(task.id)" class="break-words">
                <p class="itbkk-title break-all">{{ task.title }}</p>
              </td>
              <td @click="openTaskDetail(task.id)" class="">
                <p class="itbkk-assignees" :class="!task.assignees ? 'italic text-gray-400' : ''">
                  {{ task.assignees || 'Unassigned' }}
                </p>
              </td>
              <td @click="openTaskDetail(task.id)" class="">
                <button
                  :class="getStatusClass(task.status.name)"
                  class="btn btn-active h-[1rem] min-h-[1.8rem] text-black"
                >
                  <p class="itbkk-status">{{ task.status.name }}</p>
                </button>
              </td>
              <td>
                <div class="dropdown itbkk-button-action">
                  <div tabindex="0" role="button" class="btn m-1">
                    <v-icon name="co-settings" tabindex="0" role="button"></v-icon>
                  </div>
                  <ul
                    tabindex="0"
                    class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-36"
                  >
                    <li class="flex flex-row">
                      <button
                        class="itbkk-button-edit text-warning w-full"
                        @click="editTask(task.id)"
                      >
                        <v-icon name="fa-edit"></v-icon>Edit
                      </button>
                    </li>
                    <li
                      class="flex flex-row"
                      @click="openDeleteDialog(task.title, task.id, key + 1)"
                    >
                      <button
                        class="itbkk-button-delete text-error w-full"
                        onclick="my_modal_1.showModal()"
                      >
                        <v-icon name="md-deleteforever"></v-icon>Delete
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <p v-if="isNull" class="w-full p-6 text-center text-red-500">No tasks found</p>
      </div>
    </div>

    <Teleport to="#modal" v-if="$route.params.id > 0 && !$route.path.includes('edit')">
      <TaskDetail></TaskDetail>
    </Teleport>
    <Teleport to="#modal" v-if="$route.params.id > 0 && $route.path.includes('edit')">
      <TaskEdit @return-status="checkReceivedStatus"></TaskEdit>
    </Teleport>
    <Teleport to="#addmodal" v-if="$route.path === '/task/add'">
      <TaskAdd @return-status="checkReceivedStatus"></TaskAdd>
    </Teleport>

    <!-- Open the modal using ID.showModal() method -->
    <dialog id="my_modal_1" class="modal">
      <div class="modal-box">
        <h3 class="font-bold text-lg">Delete a Task</h3>
        <p class="itbkk-message py-4 break-words">
          Do you want to delete the task number: {{ deleteTaskNumber }} "{{ taskTitle }}"?
        </p>
        <div class="modal-action">
          <form method="dialog">
            <!-- if there is a button in form, it will close the modal -->
            <button class="itbkk-button-cancel btn bg-error text-white">Cancel</button>
            <button
              class="itbkk-button-confirm btn bg-success text-white ml-2"
              @click="deleteTaskConfirm()"
            >
              <p class="itbkk-button">Confirm</p>
            </button>
          </form>
        </div>
      </div>
    </dialog>
  </div>
</template>

<script setup>
import TaskDetail from '../components/taskcomponents/TaskDetail.vue'
import TaskAdd from '../components/taskcomponents/TaskAdd.vue'
import TaskEdit from '../components/taskcomponents/TaskEdit.vue'
import { useRouter, useRoute } from 'vue-router'
import { ref, computed, watch } from 'vue'
import { onMounted } from 'vue'
import { Button } from '@/components/ui/button'
import CountCard from '@/components/ui/card/CountCard.vue'
import { getAllTasks, getAllTasksInStatus, deleteTask } from '@/api/taskService'
import { getAllStatuses } from '@/api/statusService'
import { shortenTitle, getStatusClass } from '@/lib/utils'
import StatusCard from '../components/statuscomponents/StatusCard.vue'
import CrudResponseAlert from '@/components/ui/CrudResponseAlert.vue'
import { useAuthStore } from '@/stores/AuthStore'

const tasks = ref([])
const allTasks = ref([])
const route = useRoute()
const router = useRouter()
const isNull = ref(false)
const crudResult = ref({ displayResult: false, result: true, message: '' })
const statusesList = ref()
const currentIcon = ref('defaultSort')

const taskTitle = ref(null)
const taskId = ref(null)
const deleteTaskNumber = ref(null)

const selectedStatus = ref([])

const authStore = useAuthStore()

onMounted(async () => {
  try {
    tasks.value = await getAllTasks()
    allTasks.value = tasks.value
    statusesList.value = await getAllStatuses()
    tasks.value.length === 0 ? (isNull.value = true) : (isNull.value = false)
  } catch (error) {
    crudResult.value = { displayResult: true, result: false, message: error.message }
  }
})
const navigateToAddTask = () => {
  router.push({ name: 'add' })
}

const navigateToLogin = () => {
  router.push({ name: 'loginPage' })
}

const nextIcon = () => {
  switch (currentIcon.value) {
    case 'defaultSort':
      currentIcon.value = 'ascSort'
      break
    case 'ascSort':
      currentIcon.value = 'descSort'
      break
    case 'descSort':
      currentIcon.value = 'defaultSort'
      break
  }
}

watch(selectedStatus.value, async () => {
  statusesFilter(selectedStatus.value)
})

const statusesFilter = async (selected) => {
  selectedStatus.value = selected
  try {
    const select = selectedStatus.value.join(',')
    tasks.value = await getAllTasksInStatus(select)
    tasks.value.length === 0 ? (isNull.value = true) : (isNull.value = false)
  } catch (error) {
    crudResult.value = { displayResult: true, result: false, message: error.message }
  }
}

const sortedTasks = computed(() => {
  if (currentIcon.value === 'ascSort') {
    return tasks.value.slice().sort((a, b) => a.status.name.localeCompare(b.status.name))
  } else if (currentIcon.value === 'descSort') {
    return tasks.value.slice().sort((a, b) => b.status.name.localeCompare(a.status.name))
  }
  return tasks.value.slice()
})

const logout = () => {
  authStore.clearTokens() // Clear the token to log out
  router.push({ name: 'loginPage' }) // Optionally navigate to the login page after logout
}

const navigateToStatus = () => {
  router.push({ name: 'status' })
}

const checkReceivedStatus = async (response) => {
  crudResult.value.displayResult = true
  crudResult.value.result = response.status
  crudResult.value.message = response.message
  if (crudResult.value.result) {
    if (response.from === 'edit') {
      let updatedTaskId = allTasks.value.findIndex((task) => task.id === response.value.id)
      allTasks.value.splice(updatedTaskId, 1, response.value)
    } else if (response.from === 'delete') {
      let deletedTaskId = allTasks.value.findIndex((task) => task.id === response.value)
      allTasks.value.splice(deletedTaskId, 1)
    } else {
      try {
        tasks.value = await getAllTasks()
        allTasks.value = tasks.value
      } catch (error) {
        crudResult.value = { displayResult: true, result: false, message: error.message }
      }
    }
    selectedStatus.value.length = 0
  }
}

const deleteTaskConfirm = async () => {
  if (taskId.value !== null) {
    try {
      await deleteTask(taskId.value)
      await checkReceivedStatus({
        status: true,
        message: `"${shortenTitle(taskTitle.value)}" The task has been deleted successfully`,
        from: 'delete',
        value: taskId.value
      })
      tasks.value = tasks.value.filter((task) => task.id !== taskId.value)
      allTasks.value = allTasks.value.filter((task) => task.id !== taskId.value)
    } catch (error) {
      await checkReceivedStatus({
        status: false,
        message: error.message
      })
    }
  }
}

const openTaskDetail = async (id) => {
  await router.push({ name: 'home', params: { id: id } })
}
const editTask = async (id) => {
  await router.push({ name: 'edit', params: { id: id } })
}

const openDeleteDialog = (title, id, key) => {
  taskTitle.value = title
  taskId.value = id
  deleteTaskNumber.value = key
}

const statusCounts = computed(() => {
  const counts = {}
  allTasks.value.forEach((task) => {
    if (counts[task.status.name]) {
      counts[task.status.name]++
    } else {
      counts[task.status.name] = 1
    }
  })
  return counts
})
</script>

<style>
.tracking-in-expand-fwd-top {
  animation: tracking-in-expand-fwd-top 0.8s cubic-bezier(0.215, 0.61, 0.355, 1) both;
}

@keyframes tracking-in-expand-fwd-top {
  0% {
    letter-spacing: -0.5em;
    transform: translateZ(-700px) translateY(-500px);
    opacity: 0;
  }
  40% {
    opacity: 0.6;
  }
  100% {
    transform: translateZ(0) translateY(0);
    opacity: 1;
  }
}

.slide-in-left {
  -webkit-animation: slide-in-left 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
  animation: slide-in-left 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
}

@-webkit-keyframes slide-in-left {
  0% {
    -webkit-transform: translateX(-1000px);
    transform: translateX(-1000px);
    opacity: 0;
  }
  100% {
    -webkit-transform: translateX(0);
    transform: translateX(0);
    opacity: 1;
  }
}
@keyframes slide-in-left {
  0% {
    -webkit-transform: translateX(-1000px);
    transform: translateX(-1000px);
    opacity: 0;
  }
  100% {
    -webkit-transform: translateX(0);
    transform: translateX(0);
    opacity: 1;
  }
}
</style>
