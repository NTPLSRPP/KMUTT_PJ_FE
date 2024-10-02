<template>
  <div class="p-6 bg-gray-100 flex-1">
    <div class="bg-white shadow rounded-lg p-4 h-screen">
      <!-- Tabs -->
      <div class="form-control">
        <div class="flex justify-end">
          <span class="label-text pr-3">{{ isVisible ? 'Public' : 'Private' }}</span>
          <div
            :class="permission === 'owner' || permission === 'write' ? '' : 'tooltip tooltip-left'"
            v-bind:data-tip="
              permission === 'owner' || permission === 'write'
                ? ''
                : 'You need to be board owner to perform this action.'
            "
          >
            <input
              type="checkbox"
              class="toggle itbkk-board-visibility"
              v-model="isVisible"
              :disabled="!(permission === 'owner' || permission === 'write')"
            />
          </div>
        </div>
      </div>
      <div class="flex justify-end space-x-4 border-b pb-4">
        <button class="text-green-500 border-b-2 border-green-500">{{ boardName }}</button>
        <div
          :class="permission === 'owner' || permission === 'write' ? '' : 'tooltip'"
          v-bind:data-tip="
            permission === 'owner' || permission === 'write'
              ? ''
              : 'You need to be board owner to perform this action.'
          "
        >
          <button
            class="btn btn-success text-white itbkk-button-add"
            @click="navigateToAddTask"
            v-if="route.name === 'BoardView'"
            :disabled="!(permission === 'owner' || permission === 'write')"
          >
            Add Task
          </button>
          <button
            class="btn btn-success text-white itbkk-button-add"
            @click="navigateToAddStatus"
            v-if="route.name.toString().startsWith('BoardStatus')"
            :disabled="!(permission === 'owner' || permission === 'write')"
          >
            Add Status
          </button>
        </div>
        <button
          class="btn btn-warning text-white itbkk-manage-status"
          @click="navigateToStatus"
          v-if="route.name === 'BoardView'"
        >
          Manage Status
        </button>
        <button
          class="btn btn-warning text-white"
          @click="navigateToTask"
          v-if="route.name.toString().startsWith('BoardStatus')"
        >
          Manage Task
        </button>
        <div class="relative">
          <input type="text" placeholder="Filter Status" class="border rounded-lg h-[3rem] pl-3" />
        </div>
      </div>

      <!-- Member Table -->
      <div class="overflow-y-auto max-h-[80%] min-h-[80vh]" v-if="route.name === 'BoardView'">
        <table class="min-w-full divide-y divide-gray-200 mt-4">
          <thead>
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">No.</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Assignees
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Status
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Action
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr
              v-for="(task, key) in tasks"
              :key="key"
              class="hover:bg-gray-100 text-black itbkk-item"
            >
              <!-- Number Column -->
              <td class="px-6 py-4 whitespace-nowrap" @click="taskDetails(task.id)">
                {{ key + 1 }}
              </td>
              <!-- Title Column -->
              <td class="px-6 py-4 whitespace-nowrap" @click="taskDetails(task.id)">
                <div class="flex items-center itbkk-title">{{ task.title }}</div>
              </td>

              <!-- Assignees Column -->
              <td class="px-6 py-4 whitespace-nowrap itbkk-assignees" @click="taskDetails(task.id)">
                {{ task.assignees || 'Unassigned' }}
              </td>

              <!-- Status Column -->
              <td class="px-6 py-4 whitespace-nowrap" @click="taskDetails(task.id)">
                <span class="text-sm text-gray-900 itbkk-status">{{ task.status.name }}</span>
              </td>
              <td
                class="px-6 py-4 whitespace-nowrap"
              >
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
                        :disabled="!(permission === 'owner' || permission === 'write')"
                        :class="!(permission === 'owner' || permission === 'write') ? 'text-slate-500 cursor-not-allowed tooltip' : ''"
                        v-bind:data-tip="!(permission === 'owner' || permission === 'write') ? 'You need to be board owner to perform this action.' : ''"
                      >
                        <v-icon name="fa-edit"></v-icon>Edit
                      </button>
                    </li>
                    <li class="flex flex-row" @click="openDeleteDialog(task.title, task.id)">
                      <button
                        class="itbkk-button-delete text-error w-full disabled"
                        onclick="my_modal_1.showModal();"
                        :disabled="!(permission === 'owner' || permission === 'write')"
                        :class="!(permission === 'owner' || permission === 'write') ? 'text-slate-500 cursor-not-allowed tooltip' : ''"
                        v-bind:data-tip="!(permission === 'owner' || permission === 'write') ? 'You need to be board owner to perform this action.' : ''"
                      >
                        <v-icon name="md-deleteforever"></v-icon>Delete
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
<!--              <td v-else>-->
<!--                <div-->
<!--                  class="itbkk-button-action tooltip"-->
<!--                  data-tip="You need to be board owner to perform this action."-->
<!--                  disabled-->
<!--                >-->
<!--                  <div tabindex="0" class="btn m-1 cursor-not-allowed" >-->
<!--                    <v-icon name="co-settings" tabindex="0" class="text-black"></v-icon>-->
<!--                  </div>-->
<!--                </div>-->
<!--              </td>-->
            </tr>
          </tbody>
        </table>
      </div>

      <NewStatusTable
        ref="statusTable"
        v-if="route.name.toString().startsWith('BoardStatus')"
        @return-status="checkReceivedStatus"
      ></NewStatusTable>
    </div>
    <Teleport to="#modal" v-if="$route.name === 'BoardTaskDetails'">
      <TaskDetail></TaskDetail>
    </Teleport>
    <Teleport to="#addmodal" v-if="$route.name === 'BoardTaskAdd'">
      <TaskAdd @return-status="checkReceivedStatus" class="itbkk-modal-task"></TaskAdd>
    </Teleport>
    <Teleport to="#modal" v-if="$route.name === 'BoardTaskEdit'">
      <TaskEdit @return-status="checkReceivedStatus"></TaskEdit>
    </Teleport>
    <Teleport to="#addmodal" v-if="$route.name === 'BoardStatusAdd'">
      <StatusAdd @return-status="checkReceivedStatus" class="itbkk-modal-status"></StatusAdd>
    </Teleport>
    <Teleport to="#modal" v-if="$route.name === 'BoardStatusEdit'">
      <StatusEdit @return-status="checkReceivedStatus" class="itbkk-button-edit"></StatusEdit>
    </Teleport>
    <dialog id="my_modal_1" class="modal">
      <div class="modal-box">
        <h3 class="font-bold text-lg">Delete a Task</h3>
        <p class="itbkk-message py-4 break-words">
          Do you want to delete the task number: {{ taskToDel.taskId }} "{{ taskToDel.taskTitle }}"?
        </p>
        <div class="modal-action">
          <form method="dialog">
            <!-- if there is a button in form, it will close the modal -->
            <button class="itbkk-button-cancel btn bg-error text-white">Cancel</button>
            <button
              class="itbkk-button-confirm btn bg-success text-white ml-2"
              @click="confirmDeleteTask()"
            >
              <p class="itbkk-button">Confirm</p>
            </button>
          </form>
        </div>
      </div>
    </dialog>
    <Teleport to="#modal" v-if="openVisibilityModal">
      <div
        class="itbkk-modal-alert card bg-zinc-800 opacity-70 shadow-xl p-3 flex justify-center items-center z-50 absolute w-screen h-screen"
      >
        <div class="bg-base-100 p-4 w-1/4 rounded-lg">
          <h3 class="card-title text-lg">Board visibility changed!</h3>
          <p class="itbkk-message py-4 break-words">
            Do you want to change board visibility to {{ isVisible ? 'public' : 'private' }}?
          </p>
          <div class="card-actions justify-end">
            <!-- if there is a button in form, it will close the modal -->
            <button
              class="itbkk-button-cancel btn bg-error text-white"
              @click="isVisible = !isVisible"
            >
              Cancel
            </button>
            <button
              class="itbkk-button-confirm btn bg-success text-white ml-2"
              @click="handleVisibility()"
            >
              <p>Confirm</p>
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
  <CrudResponseAlert
    class="z-100"
    :crudAlert="crudResult"
    @update-displayResult="crudResult.displayResult = $event"
  >
  </CrudResponseAlert>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useBoardStore } from '@/stores/BoardStore'
import { useRouter, useRoute } from 'vue-router'
import TaskAdd from '@/components/taskcomponents/TaskAdd.vue'
import TaskEdit from '@/components/taskcomponents/TaskEdit.vue'
import TaskDetail from '@/components/taskcomponents/TaskDetail.vue'
import { deleteTask } from '@/api/taskService'
import { shortenTitle } from '@/lib/utils'
import NewStatusTable from '@/components/NewStatusTable.vue'
import StatusAdd from '@/components/statuscomponents/StatusAdd.vue'
import StatusEdit from '@/components/statuscomponents/StatusEdit.vue'
import CrudResponseAlert from '@/components/ui/CrudResponseAlert.vue'
import { useAuthStore } from '@/stores/AuthStore'
import { getPermission, fetchBoardById } from '@/api/boardService'

const route = useRoute()
const router = useRouter()
const boardStore = useBoardStore()
const authStore = useAuthStore()
const tasks = computed(() => boardStore.tasks)
const statusTable = ref(null)

const isVisible = ref(boardStore.getBoardisPublicById(route.params.boardID as string))
const refVisible = ref()
const permission = ref(null)

const boardID = computed(() => {
  return route.params.boardID as string
})

watch(boardID, async (newBoardID) => {
  isVisible.value = boardStore.getBoardisPublicById(newBoardID)
  refVisible.value = isVisible.value
  if(route.params.boardID) {
    if (authStore.isAuthenticated) {
      permission.value = (await getPermission(route.params.boardID as string)).permission
    } else {
      let boardInfo = await fetchBoardById(route.params.boardID as string)
      boardStore.addBoard(boardInfo)
    }
  }
  if(!boardID.value){
    permission.value = null
  }
})

onMounted(async () => {
  refVisible.value = isVisible.value
  if(route.params.boardID) {
    if (authStore.isAuthenticated) {
      permission.value = (await getPermission(route.params.boardID as string)).permission
    } else {
      let boardInfo = await fetchBoardById(route.params.boardID as string)
      boardStore.addBoard(boardInfo)
    }
  }
})

const openVisibilityModal = computed(() => {
  return isVisible.value !== refVisible.value
})

const handleVisibility = async () => {
  await boardStore.switchVisibility(route.params.boardID as string, isVisible.value)
  refVisible.value = isVisible.value
}

const crudResult = ref({ displayResult: false, result: false, message: '' })

const navigateToAddTask = () => {
  router.push({ name: 'BoardTaskAdd' })
}
const editTask = async (id) => {
  await router.push({
    name: 'BoardTaskEdit',
    params: { boardID: route.params.boardID, taskID: id }
  })
}

const taskDetails = async (id) => {
  await router.push({
    name: 'BoardTaskDetails',
    params: { boardID: route.params.boardID, taskID: id }
  })
}

const boardName = computed(() => {
  return boardStore.getBoardNameById(route.params.boardID as string)
})

const checkReceivedStatus = async (response) => {
  crudResult.value.displayResult = true
  crudResult.value.result = response.result
  crudResult.value.message = response.message
  if (response.from === 'addTask') {
    boardStore.fetchTasks(route.params.boardID as string)
  }
  if (response.from === 'editTask') {
    boardStore.updateTask(response.task)
  }
  if (response.from === 'deleteTask') {
    boardStore.deleteTask(response.task)
  }
  if (response.from === 'addStatus') {
    boardStore.fetchStatuses(route.params.boardID as string)
  }
  if (response.from === 'editStatus') {
    boardStore.fetchTasks(route.params.boardID as string)
    boardStore.updateStatus(response.status)
  }
}

const navigateToStatus = () => {
  router.push({ name: 'BoardStatusHome', params: { boardID: route.params.boardID } })
}

const navigateToTask = () => {
  const boardID = route.params.boardID
  if (boardID) {
    router.push({ path: `/board/${boardID}` })
  } else {
    console.error('No boardID found in the route parameters.')
  }
}

const taskToDel = ref({ taskTitle: null, taskId: null })

const openDeleteDialog = (title, id) => {
  taskToDel.value.taskTitle = title
  taskToDel.value.taskId = id
}

const confirmDeleteTask = async () => {
  if (taskToDel.value.taskId !== null) {
    try {
      await deleteTask(route.params.boardID as string, taskToDel.value.taskId)
      await checkReceivedStatus({
        displayResult: true,
        result: true,
        message: `"${shortenTitle(taskToDel.value.taskTitle)}" The task has been deleted successfully`,
        from: 'deleteTask',
        task: taskToDel.value.taskId
      })
    } catch (error) {
      await checkReceivedStatus({
        displayResult: true,
        result: false,
        message: error.message
      })
    }
  }
}

const navigateToAddStatus = () => {
  router.push({ name: 'BoardStatusAdd' })
}
</script>

<style scoped></style>
