<!-- BoardDelete.vue -->
<template>
  <div
    theme-data="light"
    class="flex justify-center items-center h-screen w-screen bg-opacity-80 bg-zinc-800"
  >
    <div class="w-3/5">
      <Card class="itbkk-modal-task light items-center self-center min-w-full h-full light">
        <CardHeader>
          <div>Delete A Board</div>
          <!-- Display the boardName correctly -->
          <p>Board Name: {{ boardName }}</p>
        </CardHeader>
        <hr />
        <CardContent class="flex">
          <div class="w-1/2">
            <div class="flex gap-1 k">
              <p class="pb-2">Do you want to delete this board?</p>
            </div>
          </div>
        </CardContent>
        <CardContent class="-mt-6 -mb-4">
          <div v-if="warning.length > 0" class="gap-3 text-red-600">
            {{ warning }}
          </div>
        </CardContent>
        <CardFooter class="gap-3">
          <button class="itbkk-button-confirm btn btn-success text-white" @click="confirmDelete">
            Confirm
          </button>
          <button class="itbkk-button-cancel btn btn-error text-white" @click="cancelDelete">
            Cancel
          </button>
        </CardFooter>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card/index.ts'
import { ref, defineProps, computed } from 'vue'
import { useBoardStore } from '@/stores/BoardStore'

const router = useRouter()
const boardStore = useBoardStore() // Access the board store

const props = defineProps<{ boardID: string }>()

const warning = ref('')

const cancelDelete = () => {
  router.push({ name: 'BoardView' }) // Navigate back without deleting
}


const confirmDelete = async () => {
  try {
    await boardStore.deleteBoard(props.boardID) 
    console.log(`Board with ID ${props.boardID} deleted.`)
    router.push({ name: 'BoardView' }) 
  } catch (error) {
    warning.value = 'Failed to delete the board. Please try again.'
    console.error('Error deleting board:', error)
  }
}


const boardName = computed(() => boardStore.getBoardNameById(props.boardID))
</script>

<style scoped>
/* Add any scoped styles for your modal here */
</style>
