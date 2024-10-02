<template>
    <div
      theme-data="light"
      class="flex justify-center items-center h-screen w-screen bg-opacity-80 bg-zinc-800"
    >
      <div class="w-3/5">
        <Card class="itbkk-modal-task light items-center self-center min-w-full h-full light">
          <CardHeader
            ><div>New Board</div>
          </CardHeader>
          <hr>
          <CardContent class="flex">
            <div class="w-1/2">
              <div class="flex gap-1">
                <p class="pb-2">Name</p>
                <p class="text-gray-500">({{ boardLength }}/120)</p>
              </div>
              <input
                type="text"
                placeholder="enter board name here"
                class="itbkk-assignees input input-bordered w-full bg-white itbkk-board-name"
                v-model="newBoard.boardName"
                maxlength="120"
              />
            </div>
          </CardContent>
          <CardContent class="-mt-6 -mb-4">
            <div v-if="warning.length > 0" class="gap-3 text-red-600">
              {{ warning }}
            </div>
          </CardContent>
          <CardFooter class="gap-3">
            <button
              class="itbkk-button-confirm btn btn-success text-white itbkk-button-ok"
              :class="titleError ? 'disabled btn-disabled' : ''"
              @click="saveNewTask"
            >
              save
            </button>
            <button class="itbkk-button-cancel btn btn-error text-white" @click="closePage">
              cancel
            </button>
          </CardFooter>
        </Card>
      </div>
    </div>
  </template>
  
  <script setup>
  import { useRouter } from 'vue-router'
  import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card/index.ts'
  import { createBoard} from "@/api/boardService.ts"
  import { ref, defineEmits, computed, onMounted } from 'vue'
  import { shortenTitle } from '@/lib/utils.ts'
  import {useBoardStore} from "@/stores/BoardStore.ts";
  import {useAuthStore} from "@/stores/AuthStore.ts";

  const boardStore = useBoardStore()
  const authStore = useAuthStore()
  const warning = ref('')
  const emit = defineEmits(['returnStatus'])
  const newBoard = ref({
    boardName: `${authStore.decodedToken.name} personal board`
    })
  const router = useRouter()
  
  const closePage = () => {
    router.back()
  }

  const boardLength = computed(() => {
    return newBoard.value.boardName.length
  })

  const titleError = computed(() =>{
    return !(newBoard.value.boardName.length > 0)
  })
  
  const saveNewTask = async () => {
    if (newBoard.value.boardName.length === 0) {
      warning.value = "Title can't be empty!"
      return
    }
    try {
      const boardToCreate = {...newBoard.value}
      console.log(boardToCreate)
      await createBoard(boardToCreate)
      emit('returnStatus', {
        status: true,
        message: `The task "${shortenTitle(newBoard.value.boardName)}" has been saved! ...`
      })
      router.back()
    } 
    catch (error) {
      emit('returnStatus', {
        status: false,
        message: `An error occured: task "${shortenTitle(newBoard.value.boardName)}" couldn't be saved, Please try again later`
      })
      router.back()
    }
  }
  </script>
  
  <style lang="scss" scoped></style>
  