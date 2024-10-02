<template>
  <div class="overflow-y-auto max-h-[80%] min-h-[80vh]">
    <table class="min-w-full divide-y divide-gray-200 mt-4">
      <thead>
      <tr>
        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
          Description
        </th>
        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Limit</th>
        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
      </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200">
      <tr v-for="status in statuses" :key="status.id" class="hover:bg-gray-100 text-black itbkk-item">
        <td class="px-6 py-4 whitespace-nowrap itbkk-status-name">{{ status.name }}</td>
        <td class="px-6 py-4 whitespace-nowrap">
          <div class="flex items-center">{{ status.description }}</div>
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
          {{ status.limitEnabled ? 'Enabled' : 'Disabled' }}
        </td>
        <td class="px-6 py-4 whitespace-nowrap" v-if="permission === 'owner' || permission === 'write'">
          <div class="dropdown itbkk-button-action" v-if="status.customizable">
            <div tabindex="0" role="button" class="btn m-1">
              <v-icon name="co-settings" tabindex="0" role="button"></v-icon>
            </div>
            <ul
                tabindex="0"
                class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-36"
            >
              <li class="flex flex-row" @click="openEditStatus(status.id)">
                <button class="itbkk-button-edit text-warning w-full">
                  <v-icon name="fa-edit"></v-icon>
                  Edit
                </button>
              </li>
              <li class="flex flex-row" @click="openDeleteDialog(status.name, status.id)">
                <button class="itbkk-button-delete text-error w-full">
                  <v-icon name="md-deleteforever"></v-icon>
                  Delete
                </button>
              </li>
            </ul>
          </div>
          <div class="py-4" v-else><p class="text-slate-400 text-sm">This status cannot be edited.</p></div>
        </td>
        <td v-else class="px-6 py-4 ">
          <div class="itbkk-button-action tooltip " data-tip="You need to be board owner to perform this action." v-if="status.customizable">
            <div tabindex="0" class="btn m-1 cursor-not-allowed" disabled="true">
              <v-icon name="co-settings" tabindex="0" class="text-black"></v-icon>
            </div>
          </div>
          <div class="py-4" v-else><p class="text-slate-400 text-sm">This status cannot be edited.</p></div>
        </td>
      </tr>
      </tbody>
    </table>

    <!-- Modal for task transfer and deletion -->
    <dialog id="my_modal_2" class="modal" ref="myModal">
      <div class="modal-box">
        <h3 class="font-bold text-lg">Delete a Status</h3>
        <p class="itbkk-message py-4 break-words" v-if="hasTasksUsingStatus">
          Status "{{ statusName }}" is still being used by tasks. Please transfer tasks to a new
          status.
        </p>
        <p class="itbkk-message py-4 break-words" v-else>
          Do you want to delete the status: "{{ statusName }}"?
        </p>

        <!-- Task Transfer Dropdown -->
        <div v-if="hasTasksUsingStatus" class="mt-2">
          <label for="transfer-status" class="block text-sm font-medium text-gray-700"
          >Transfer Tasks To:</label
          >
          <select
              id="transfer-status"
              v-model="newStatusID"
              class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option v-for="status in availableStatuses" :key="status.id" :value="status.id">
              {{ status.name }}
            </option>
          </select>
        </div>

        <!-- <div class="modal-action"> -->
          <button class="itbkk-button-status-cancel btn bg-error text-white" @click="closeModal">
            Cancel
          </button>
          <button
              class="itbkk-button-status-confirm btn bg-success text-white ml-2"
              @click="confirmDeleteStatus"
              :disabled="hasTasksUsingStatus && !newStatusID"
          >
            Confirm
          </button>
        <!-- </div> -->
      </div>
    </dialog>
  </div>
</template>

<script setup lang="ts">
import {useBoardStore} from '@/stores/BoardStore'
import {ref, computed, onMounted} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import {fetchBoardById, getPermission} from "@/api/boardService";
import {useAuthStore} from "@/stores/AuthStore";

const route = useRoute()
const boardStore = useBoardStore()
const authStore = useAuthStore()
const router = useRouter()

const statusName = ref('') // Name of the status
const statusID = ref<number | null>(null) // ID of the status
const newStatusID = ref<number | null>(null) // Holds the new status to transfer tasks to
const myModal = ref<HTMLDialogElement | null>(null) // Modal reference

const statuses = computed(() => boardStore.statuses)
const hasTasksUsingStatus = computed(
    () => statusID.value !== null && boardStore.tasksUsingStatus(statusID.value).length > 0
)
const availableStatuses = computed(() => boardStore.availableStatuses(statusID.value as number))
const permission = ref(null)

onMounted(async () => {
      updateList()
      if (authStore.isAuthenticated) {
        permission.value = (await getPermission(route.params.boardID as string)).permission
      } else {
        let boardInfo = await fetchBoardById(route.params.boardID as string)
        boardStore.addBoard(boardInfo)
      }
    }
)

const updateList = () => {
  boardStore.fetchStatuses(route.params.boardID as string)
}

const openEditStatus = async (id: number) => {
  router.push({
    name: 'BoardStatusEdit',
    params: {boardID: route.params.boardID as string, statusID: id}
  })
}

const openDeleteDialog = (name: string, id: number) => {
  statusName.value = name
  statusID.value = id
  newStatusID.value = null
  myModal.value?.showModal()
}

const closeModal = () => {
  myModal.value?.close()
}

defineExpose({
  updateList
})

const emit = defineEmits(['returnStatus'])

const confirmDeleteStatus = async () => {
  if (statusID.value !== null) {
    try {
      if (hasTasksUsingStatus.value && newStatusID.value) {
        // Pass the replaceID to deleteBoardStatusWithReplacement if tasks are using the status
        await boardStore.deleteBoardStatusWithReplacement(
            route.params.boardID as string,
            statusID.value,
            newStatusID.value
        )
      } else {
        // Delete without replacement if no tasks are using the status
        await boardStore.deleteBoardStatusWithReplacement(
            route.params.boardID as string,
            statusID.value
        )
      }
      closeModal() // Close the modal
      updateList() // Refresh the status list
      emit('returnStatus', {
        displayResult: true,
        result: true,
        message: `Status "${statusName.value}" deleted successfully`
      })
    } catch (error) {
      emit('returnStatus', {
        displayResult: true,
        result: false,
        message: `An error occurred: ${error.message}`
      })
    }
  }
}
</script>
