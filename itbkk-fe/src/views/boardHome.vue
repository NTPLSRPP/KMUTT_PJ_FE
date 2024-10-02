<!-- src/App.vue -->
<template>
  <div class="flex h-screen overflow-hidden">
    <!-- Sidebar -->
    <aside
      v-if="authStore.isAuthenticated"
      :class="[
        'bg-white shadow-md h-full transition-transform duration-300',
        sidebarOpen ? 'w-64' : 'w-16'
      ]"
    >
      <button @click="toggleSidebar" class="p-4 focus:outline-none text-black">
        <!-- Icon for toggling the sidebar (e.g., hamburger icon) -->
        <svg
          v-if="sidebarOpen"
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
        <svg
          v-else
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      <nav class="p-4" v-if="sidebarOpen">
        <p class="flex items-center justify-center text-black pb-3">
          You have a total of {{ boards.length }} boards.
        </p>
        <ul class="space-y-2">
          <li @click="navigateToBoard(board.boardID)" class="cursor-pointer" v-for="(board, index) in boards" :key="index">
            <a class="flex items-center p-2 text-gray-700 rounded hover:bg-gray-200">
              <span class="ml-3" :class="boardID === board.boardID ? 'text-green-500' : ''">{{
                board.boardName
              }}</span>
            </a>
          </li>
        </ul>
      </nav>
    </aside>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col">
      <!-- Top Bar -->
      <header class="flex justify-between items-center p-4 bg-white shadow-sm">
        <div class="text-xl font-semibold text-black">INTEGRATED PROJECT ITBKK-SY-1</div>
        <div class="flex items-center space-x-4">
          <button
            class="btn btn-success text-white itbkk-button-create"
            @click="addBoard()"
            v-show="authStore.isAuthenticated"
          >
            + Add Board
          </button>
          <button
            class="btn btn-success text-white disabled"
            @click="delBoard($route.params.boardID as string)"
            v-show="authStore.isAuthenticated"
          >
            Delete Board
          </button>
          <span
            v-if="authStore.decodedToken.name"
            class="text-black"
            v-show="authStore.isAuthenticated"
            >Welcome, {{ authStore.decodedToken.name }}</span
          >
          <button
            class="btn btn-success text-white"
            @click="handleLogout()"
            v-show="authStore.isAuthenticated"
          >
            Logout
          </button>
        </div>
      </header>
      <!-- <button @click="fetchBoards">Fetch Boards</button>
      <button @click="loadBoardDetails(boardID)">Load Details</button> -->

      <!-- Main Content Area -->
      <NewTaskHome></NewTaskHome>
      <div
        class="bg-white shadow rounded-lg p-4 flex justify-center"
        v-if="boardStore.boardCount === 0"
      >
        <div class="text-black">You don't have any board. Get started by creating a new board!</div>
      </div>
    </div>
    <Teleport to="#addmodal" v-if="$route.path === '/board/add'">
      <BoardAdd @return-status="addResult" class="itbkk-modal-new"></BoardAdd>
    </Teleport>
    <Teleport to="#delmodal" v-if="$route.name === 'BoardViewDelete'">
      <BoardDelete :boardID as string="$route.params.boardID"></BoardDelete>
    </Teleport>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue'
import { useAuthStore } from '@/stores/AuthStore'
import { useRouter, useRoute } from 'vue-router'
import { useBoardStore } from '@/stores/BoardStore'
import BoardAdd from '@/components/boardcomponents/BoardAdd.vue'
import BoardDelete from '@/components/boardcomponents/BoardDelete.vue'
import NewTaskHome from '@/views/NewTaskHome.vue'
const boardStore = useBoardStore()
const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()

const boardID = computed(() => {
  return route.params.boardID as string
})

onMounted(() => {
  if (authStore.isAuthenticated) {
    fetchBoards()
  }
})

const boards = computed(() => boardStore.boards)

const statuses = computed(() => boardStore.statuses)

const fetchBoards = async () => {
  await boardStore.fetchBoards()
}
const handleLogout = () => {
  authStore.logout()
  router.push({ name: 'loginPage' })
}

const sidebarOpen = ref(true)
const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}

// Function to load tasks and statuses for the specific board
const loadBoardDetails = async (boardID: string) => {
  try {
    await boardStore.fetchTasks(boardID)
    await boardStore.fetchStatuses(boardID)
  } catch (error) {
    console.error('Error loading board details:', error)
  }
}

// Fetch board details on component mount if boardID exists
onMounted(() => {
  if (boardID.value) {
    loadBoardDetails(boardID.value)
  }
})

const addBoard = () => {
  router.push({ name: 'BoardViewAdd' })
}

const delBoard = (boardID: string) => {
  if (boardID) {
    router.push({
      name: 'BoardViewDelete',
      params: { boardID } // Pass boardID as route params
    })
  } else {
    console.error('No boardID provided.')
  }
}

const addResult = (stat) => {
  if (stat.status) {
    boardStore.fetchBoards()
    fetchBoards()
  }
}

const navigateToBoard = (boardID: string) => {
  router.push({ name: 'BoardView', params: { boardID } })
  boardStore.fetchTasks(boardID)
}
</script>

<style scoped>
/* Add any additional styling if needed */
</style>
