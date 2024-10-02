<template>
  <div></div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router' // To get the route params
import { useBoardStore } from '@/stores/BoardStore'
const boardStore = useBoardStore()
const route = useRoute()
const router = useRouter()
const statuses = ref([])
const boardID = route.params.boardID

onMounted(async () => {
  if (boardID) {
    try {
      await boardStore.fetchStatuses(boardID)
      statuses.value = boardStore.statuses
    } catch (error) {
      console.error('Error fetching board statuses:', error)
    }
  }
})

const navigateToBoard = () => {
  if (boardID) {
    router.push({ path: `/board/${boardID}` })
  } else {
    console.error('No boardID found in the route parameters.')
  }
}
</script>

<style lang="scss" scoped></style>
