<template>
  <div data-theme="light">
    <CrudResponseAlert
      v-show="!transferStatus?.limitEnabled"
      class="z-100"
      :crudAlert="crudAlert"
      @update-displayResult="handleDisplayResult"
    >
    </CrudResponseAlert>
    <div class="overflow-x-scroll w-screen h-screen">
      <div class="flex justify-center items-center p-6">
        <h1>
          <span class="font-bold text-3xl items-center gap-2 flex"
            >INTEGRATED PROJECT ITBKK-SY-1 Status Page
          </span>
        </h1>
      </div>
      <div class="flex justify-between text-lg px-11 mb-4">
        <div class="breadcrumbs">
          <ul>
            <li><a @click="BackToHome" class="itbkk-button-home text-blue-600">Home</a></li>
            <li class="">Task Status</li>
          </ul>
        </div>
        <div>
          <Button
            class="itbkk-button-add bg-blue-700 text-18 text-red-50 hover:bg-blue-800"
            @click="navigateToAddStatus"
            >Add Status</Button
          >
        </div>
      </div>

      <div class="px-[3rem]">
        <table class="table mb-30">
          <thead class="text-slate-700">
            <tr>
              <th class="font-bold text-[1.5rem]"></th>
              <th class="font-bold text-[1.5rem]">Name</th>
              <th class="font-bold w-1/3 text-[1.5rem]">Description</th>
              <th class="font-bold text-[1.5rem]">Limit</th>
              <th class="font-bold w-1/5 text-[1.5rem]">Action</th>
            </tr>
          </thead>

          <tbody>
            <tr class="itbkk-item" v-for="(status, key) in statuses" :key="key">
              <td class="p-5">
                <div class="flex">
                  <p class="itbkk-id font-bold">{{ key + 1 }}</p>
                </div>
              </td>

              <td class="">
                <p
                  class="itbkk-status-name rounded-sm break-before-all"
                  :class="getStatusClass(status)"
                >
                  {{ status.name }}
                </p>
              </td>
              <td class="">
                <p
                  class="itbkk-status-description break-all"
                  :class="status.description ? '' : 'italic text-gray-400'"
                >
                  {{ status.description || 'No description is provided' }}
                </p>
              </td>
              <td class="">
                {{ status.limitEnabled ? 'Enabled' : 'Disabled' }}
                <v-icon
                  :class="status.limitEnabled ? 'scale-110' : 'scale-150'"
                  :name="status.limitEnabled ? 'oi-check' : 'bi-x'"
                ></v-icon>
              </td>
              <!-- Check the correct status property for condition -->
              <td class="" v-if="status.customizable">
                <button
                  @click="editStatus(status.id)"
                  class="itbkk-button-edit text-warning mr-4 btn"
                >
                  <v-icon name="fa-edit"></v-icon>Edit
                </button>
                <button @click="statusRemove(status)" class="itbkk-button-delete text-error btn">
                  <v-icon name="md-deleteforever"></v-icon>Delete
                </button>
              </td>
              <td class="" v-else></td>
            </tr>
          </tbody>
        </table>

        <Teleport to="#modal" v-if="deleteability.showModal">
          <div
            data-theme="light"
            class="flex justify-center items-center h-screen w-screen bg-opacity-80 bg-zinc-800"
          >
            <div class="modal-box absolute" v-if="deleteability.canDelete">
              <h3 class="font-bold text-lg">Delete a Task</h3>
              <p class="itbkk-message py-4 break-words">
                Do you want to delete the status "{{ deleteability.statusName }}"?
              </p>
              <div class="modal-action">
                <form method="dialog">
                  <button
                    class="itbkk-button-cancel btn bg-error text-white"
                    @click="deleteability.showModal = false"
                  >
                    Cancel
                  </button>
                  <button
                    class="itbkk-button-confirm btn bg-success text-white ml-2"
                    @click="confirmDelete(deleteability.statusId)"
                  >
                    <p class="itbkk-button">Confirm</p>
                  </button>
                </form>
              </div>
            </div>
            <div class="modal-box" v-else-if="!deleteability.canDelete">
              <h3 class="font-bold text-lg">Delete a Task</h3>
              <p class="itbkk-message py-4 break-words">
                There is some task associated with the "{{ deleteability.statusName }}" status.
              </p>
              <p>
                Transfer to
                <select
                  class="itbkk-status select select-bordered w-full max-w-xs"
                  v-model="transferStatus"
                >
                  <option
                    v-for="(selectStatus, key) in statuses"
                    :key="key"
                    :hidden="deleteability.statusName === selectStatus.name"
                    :value="selectStatus"
                  >
                    {{ selectStatus.name }}
                  </option>
                </select>
              </p>
              <p class="text-red-600" v-show="showTransferError">
                Please select status to transfer to before proceeding
              </p>
              <div class="modal-action">
                <form method="dialog">
                  <!-- if there is a button in form, it will close the modal -->
                  <button
                    class="itbkk-button-cancel btn bg-error text-white"
                    @click="(deleteability.showModal = false), (crudAlert.displayResult = false)"
                  >
                    Cancel
                  </button>
                  <button
                    class="itbkk-button-confirm btn bg-success text-white ml-2"
                    @click="
                      () => {
                        if (transferStatus === '') {
                          showTransferError = true
                          return
                        }
                        if (!transferStatus.limitEnabled) {
                          confirmDelete(deleteability.statusId, transferStatus)
                        } else {
                          confirmDeleteWithLimit(deleteability.statusId, transferStatus)
                        }
                      }
                    "
                  >
                    <p class="itbkk-button">Confirm</p>
                  </button>
                </form>
              </div>
            </div>
          </div>
          <CrudResponseAlert
            class="z-100"
            :crudAlert="crudAlert"
            @update-displayResult="handleDisplayResult"
          >
          </CrudResponseAlert>
        </Teleport>
      </div>
    </div>

    <Teleport to="#modal" v-if="$route.params.id > 1 && $route.path.includes('edit')">
      <StatusEdit @status-updated="handleStatusUpdate"></StatusEdit>
    </Teleport>
    <Teleport to="#addmodal" v-if="$route.path === '/status/add'">
      <StatusAdd :statuses="statuses" @return-status="checkReceivedStatus"></StatusAdd>
    </Teleport>
    <Teleport to="#addmodal" v-if="exceededStat !== null">
      <StatusTasksTransfer
        :statusToTransfer="exceededStat"
        @cancel-limit="disabledLimit"
        @crud-alert="handleExceed"
      ></StatusTasksTransfer>
    </Teleport>
  </div>
</template>

<script setup>
import {
  getAllStatuses,
  deleteStatus,
  checkTaskDepend,
  getStatusById,
  updateStatus
} from '@/api/statusService'
import { getConstants } from '@/api/constantService'
import { useRouter } from 'vue-router'
import { ref, onMounted, watchEffect } from 'vue'
import { Button } from '@/components/ui/button'
import StatusAdd from '../components/statuscomponents/StatusAdd.vue'
import StatusEdit from '../components/statuscomponents/StatusEdit.vue'
import CrudResponseAlert from '../components/ui/CrudResponseAlert.vue'
import StatusTasksTransfer from '../components/statuscomponents/StatusTasksTransfer.vue'

const statuses = ref([])
const router = useRouter()
const deleteability = ref({ statusId: '', statusName: '', showModal: false, canDelete: false })
const transferStatus = ref()
const crudAlert = ref({ displayResult: false, result: false, message: '' })
const showTransferError = ref(false)
const constLimit = ref(0)
const exceededStat = ref(null)

onMounted(async () => {
  try {
    statuses.value = await getAllStatuses()
    constLimit.value = await getConstants('GStatLim')
  } catch (error) {
    crudAlert.value = { displayResult: true, result: false, message: error.message }
  }
})

watchEffect(async () => {
  const limitStatuses = await Promise.all(
    statuses.value.map(async (status) => {
      const taskDepend = await checkTaskDepend(status.id)
      return { status, taskDepend }
    })
  )
  const filteredLimitStatuses = limitStatuses.filter(
    ({ status, taskDepend }) => status.limitEnabled && taskDepend > constLimit.value
  )
  if (filteredLimitStatuses.length === 0) {
    exceededStat.value = null
    return
  }
  exceededStat.value = filteredLimitStatuses[0].status
})

const statusRemove = async (status) => {
  try {
    await getStatusById(status.id)
    let canBeDeleted = (await checkTaskDepend(status.id)) === 0
    deleteability.value.statusId = status.id
    deleteability.value.statusName = status.name
    if (canBeDeleted) {
      deleteability.value.canDelete = true
    } else {
      deleteability.value.canDelete = false
    }
    deleteability.value.showModal = true
  } catch (error) {
    crudAlert.value = { displayResult: true, result: false, message: error.message }
    statuses.value = await getAllStatuses()
  }
}

const confirmDelete = async (statusId, newStatus = null) => {
  try {
    if (newStatus !== null) {
      await deleteStatus(statusId, newStatus.id)
    } else {
      await deleteStatus(statusId)
    }
    statuses.value = statuses.value.filter((status) => status.id !== statusId)
    crudAlert.value = { displayResult: true, result: true, message: 'Status deleted successfully' }
  } catch (error) {
    crudAlert.value = { displayResult: true, result: false, message: error.message }
  }
  deleteability.value.showModal = false
}

const confirmDeleteWithLimit = async (deleteStatus, newStatus) => {
  const numTasksInStatus1 = await checkTaskDepend(deleteStatus)
  const numTasksInStatus2 = await checkTaskDepend(transferStatus.value.id)
  if (numTasksInStatus1 + numTasksInStatus2 > constLimit.value) {
    crudAlert.value = {
      displayResult: true,
      result: false,
      message: `Cannot transfer to ${transferStatus.value.name} status since it will exceed the limit
      Please choose another status to transfer to.`
    }
    return
  } else {
    transferStatus.value = null
    confirmDelete(deleteStatus, newStatus)
  }
}

const checkReceivedStatus = async (response) => {
  crudAlert.value = { ...response }
  if (crudAlert.value.result) {
    if (response.from === 'edit') {
      let updatedStatusId = statuses.value.findIndex((status) => status.id === response.value.id)
      statuses.value.splice(updatedStatusId, 1, response.value)
    } else if (response.from === 'delete') {
      let deletedTaskId = statuses.value.findIndex((status) => status.id === response.value.id)
      statuses.value.splice(deletedTaskId, 1)
    } else {
      try {
        statuses.value = await getAllStatuses()
      } catch (error) {
        crudAlert.value = { displayResult: true, result: false, message: error.message }
      }
    }
  }
}
const BackToHome = () => {
  router.push({ name: 'home' })
}

const handleDisplayResult = (displayResult) => {
  crudAlert.value.displayResult = displayResult
}

const handleStatusUpdate = (updatedStatus) => {
  if (updatedStatus.result) {
    const index = statuses.value.findIndex((s) => s.id === updatedStatus.newStatus.id)
    statuses.value[index] = updatedStatus.newStatus
    crudAlert.value.displayResult = true
    crudAlert.value.result = updatedStatus.result
    crudAlert.value.message = updatedStatus.message
  } else {
    crudAlert.value.displayResult = true
    crudAlert.value.result = updatedStatus.result
    crudAlert.value.message = updatedStatus.message
  }
}
const navigateToAddStatus = () => {
  router.push({ name: 'statusAdd' })
}

const getStatusClass = (status) => {
  switch (status.name) {
    case 'No Status':
      return 'badge bg-gray-400'
    case 'To Do':
      return 'badge bg-blue-400'
    case 'Doing':
      return 'badge bg-yellow-400'
    case 'Done':
      return 'badge bg-green-400'
    default:
      return 'badge bg-indigo-400'
  }
}

const disabledLimit = async (id) => {
  let status = statuses.value.find((status) => status.id === id)
  try {
    await updateStatus(id, { ...status, limitEnabled: false })
    statuses.value = await getAllStatuses()
  } catch (error) {
    crudAlert.value = { displayResult: true, result: false, message: error.message }
  }
}

const handleExceed = (response) => {
  crudAlert.value = { ...response }
  exceededStat.value = null
}

const editStatus = async (id) => {
  await router.push({ name: 'statusEdit', params: { id: id } })
}
</script>

<style></style>
