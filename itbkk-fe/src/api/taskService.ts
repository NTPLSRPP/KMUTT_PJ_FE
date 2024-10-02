/* eslint-disable no-useless-catch */
// const BASE_URL = 'http://ip23sy1.sit.kmutt.ac.th:8080/v1/tasks'
// const BASE_URL = 'http://localhost:8080/v1/tasks'
// const BASE_URL = 'http://localhost:3000/tasks'
const BASE_URL = import.meta.env.VITE_BOARD_URL
import unauthHandling from "@/lib/unauthHandler"
import { fetchAuth } from "@/lib/utils"

export const getAllTasks = async (): Promise<any> => {
  try {
    const response = await fetchAuth(BASE_URL, {})
    if(response.status === 401){
      await unauthHandling();
    }
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Failed to fetch tasks:', error)
    throw error // Rethrowing the error to be handled by the caller
  }
}

// you can combine getAllTasksInStatus to getAllTasks but am not cuz i'll go to sleep
export const getAllTasksInStatus = async (filterStatuses: any): Promise<any> => {
  try {
    const response = await fetchAuth(`${BASE_URL}?filterStatuses=${filterStatuses}`, {})
    if(response.status === 401){
     await unauthHandling();
    }
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Failed to fetch tasks:', error)
    throw error
  }
}

export const getTaskById = async (boardId: string, id: string): Promise<any> => {
  try {
    const response = await fetchAuth(`${BASE_URL}/${boardId}/tasks/${id}`, {})
    if(response.status === 401){
      await unauthHandling();
    }
    if (response.status === 404) {
      throw new Error('The requested task does not exist')
    }
    if (!response.ok) {
      throw new Error(`Unable to fetch task Id: ${id}.`)
    }
    return response.json()
  } catch (error) {
    throw error
  }
}

export const createTask = async (newTask: any, boardID: string): Promise<any> => {
  try {
    const response = await fetchAuth(`${BASE_URL}/${boardID}/tasks` , {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({ ...newTask })
    })
    if(response.status === 401){
      await unauthHandling();
    }
    if (response.status !== 201) {
      throw new Error(`Unable to save the task`)
    }

    return await response.json()
  } catch (error) {
    throw error
  }
}

export const deleteTask = async (boardId: string,id: number): Promise<void> => {
  try {
    const response = await fetchAuth(`${BASE_URL}/${boardId}/tasks/${id}`, {
      method: 'DELETE'
    })
    if(response.status === 401){
      await unauthHandling();
    }
    if (response.status === 404) {
      throw new Error(`Unable to delete, Requested task ID: ${id} not exist.`)
    }

    if (!response.ok) {
      throw new Error(`Unable to delete task ID: ${id}`)
    }
  } catch (error) {
    throw error
  }
}

export const updateTask = async (boardID: number, id: number, updatedTask: any) => {
  try {
    const response = await fetchAuth(`${BASE_URL}/${boardID}/tasks/${id}`, {
      method: 'PUT',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        title: updatedTask.title,
        description: updatedTask.description,
        assignees: updatedTask.assignees,
        statusId: updatedTask.status.id
      })
    })
    if(response.status === 401){
      await unauthHandling();
    }
    if (response.status === 404) {
      throw new Error(`Unable to update task with ID: ${updatedTask.id}. Task not found.`)
    }
    if (!response.ok) {
      throw new Error(`Failed to update task with ID: ${updatedTask.id}.`)
    }
  } catch (error) {
    throw error
  }
}

export const updateAllTasks = async (updatedTasks: any) => {
  try {
    const response = await fetchAuth(BASE_URL, {
      method: 'PUT',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify(updatedTasks)
    })
    if(response.status === 401){
      await unauthHandling();
    }
    if (!response.ok) {
      throw new Error(`Failed to update all tasks.`)
    }
  } catch (error) {
    throw error
  }
}

