// stores/boardStore.ts
import { defineStore } from 'pinia'
import {
  fetchBoards,
  fetchBoardStatuses,
  fetchBoardTasks,
  deleteBoard,
  changeVisibility,
  fetchBoardById
} from '@/api/boardService' // Adjust the import path as needed
import { deleteBoardStatus } from '@/api/statusService' // Adjust the import path as needed
import { toRaw } from 'vue'
interface Board {
  boardID: string
  boardName: string
  ownerID: string
  isPublic: boolean
  owner: {
    userID: string
  }
}

interface TaskStatus {
  id: number
  name: string
  description: string
  customizable: boolean
  limitEnabled: boolean
  boardID: string
}

// Define an interface for the task itself
interface Task {
  id: number
  status: TaskStatus
  title: string
  assignees: string // Could also be an array of strings if there are multiple assignees
}

export const useBoardStore = defineStore('board', {
  state: () => ({
    boards: [] as Board[],
    tasks: [] as Task[],
    statuses: [] as TaskStatus[],
    currentBoardId: '' as string,
    currentBoard: {} as Board
  }),
  actions: {
    async fetchBoards() {
      try {
        const boards = await fetchBoards()
        this.boards = boards
      } catch (error) {
        console.error('Error fetching boards:', error)
      }
    },
    async fetchBoardById(boardId: string) {
      try {
        const board = await fetchBoardById(boardId)
        this.currentBoard = board
        if (!this.boards.find((b) => b.boardID === board.boardID)) {
          this.boards.push(board)
        }
      } catch (error) {
        console.error('Error fetching board:', error)
      }
    },
    async fetchTasks(boardID: string) {
      try {
        const tasks = await fetchBoardTasks(boardID)
        this.tasks = tasks
      } catch (error) {
        console.error('Error fetching tasks for board:', error)
      }
    },
    async fetchStatuses(boardID: string) {
      try {
        const statuses = await fetchBoardStatuses(boardID)
        this.statuses = statuses
      } catch (error) {
        console.error('Error fetching statuses for board:', error)
      }
    },
    addBoard(Board: Board) {
      this.boards.push(Board)
    },

    async deleteBoard(boardID: string) {
      try {
        await deleteBoard(boardID)
        this.boards = this.boards.filter((board) => board.boardID !== boardID)
        console.log(`Board with ID ${boardID} deleted successfully.`)
      } catch (error) {
        console.error('Error deleting the board:', error)
        throw new Error('Failed to delete the board. Please try again.')
      }
    },

    getBoardById(boardID: string) {
      return this.boards.find((board) => board.boardID === boardID)
    },
    // update value in task by not refetching all tasks
    updateTask(taskData: Task) {
      this.tasks = this.tasks.map((task: Task) => {
        if (task.id === taskData.id) {
          task = taskData
        }
        return task
      })
    },
    deleteTask(taskID: number) {
      this.tasks = this.tasks.filter((task) => task.id !== taskID)
    },
    // update value in status by not refetching all statuses
    updateStatus(statusData: TaskStatus) {
      this.statuses = this.statuses.map((status: TaskStatus) => {
        if (status.id === statusData.id) {
          status = statusData
        }
        return status
      })
    },

    // New action to delete a board
    async deleteBoardStatusWithReplacement(boardID: string, statusID: number, replaceID?: number) {
      try {
        await deleteBoardStatus(boardID, statusID, replaceID)
        this.statuses = this.statuses.filter((status) => status.id !== statusID)
        this.tasks = this.tasks.map((task: Task) => {
          if (task.status.id === statusID) {
            task.status = this.statuses.find((status: TaskStatus) => {
              return status.id === replaceID
            })
          }
          return task
        })
      } catch (error) {
        console.error(error)
        throw error
      }
    },

    async switchVisibility(boardID: string, options: boolean) {
      const visibility = options ? 'public' : 'private'
      try {
        await changeVisibility(boardID, visibility)
        this.boards.map((board) => {
          if (board.boardID === boardID) {
            board.isPublic = options
          }
        })
      } catch (error) {
        console.error('Error changing visibility:', error)
        throw new Error('Failed to change visibility. Please try again.')
      }
    }
  },
  getters: {
    tasksUsingStatus:
      (state) =>
      (statusID: number): Task[] => {
        return state.tasks.filter((task) => task.status.id === statusID)
      },
    availableStatuses:
      (state) =>
      (excludeStatusID: number): TaskStatus[] => {
        return state.statuses.filter((status) => status.id !== excludeStatusID)
      },
    boardCount: (state) => state.boards.length,

    // Getter to find board name by ID
    getBoardNameById:
      (state) =>
      (boardID: string): string | undefined => {
        const board = state.boards.find((board) => board.boardID === boardID)
        return board ? board.boardName : undefined
      },
    getBoardisPublicById:
      (state) =>
      (boardID: string): boolean | undefined => {
        const board = toRaw(state.boards).find((board) => board.boardID === boardID)
        return board ? board.isPublic : undefined
      }
  }
})
