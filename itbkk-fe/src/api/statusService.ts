/* eslint-disable no-useless-catch */

const BASE_URL = import.meta.env.VITE_BOARD_URL
import unauthHandling from '@/lib/unauthHandler'
import { fetchAuth } from '@/lib/utils'
import axios from 'axios'
import { getAuthToken } from '@/api/boardService'

export const getAllStatuses = async (boardId: string) => {
  try {
    const response = await fetchAuth(`${BASE_URL}/${boardId}/statuses`, {})
    if (response.status === 401) {
      await unauthHandling()
    }
    if (!response.ok) {
      throw new Error('Unable to fetch Status.')
    }
    return response.json()
  } catch (error) {
    throw error
  }
}

export const getStatusById = async (boardId: string, id: number): Promise<any> => {
  try {
    const response = await fetchAuth(`${BASE_URL}/${boardId}/statuses/${id}`, {})
    if (response.status === 404) {
      throw new Error(`Status with ID ${id} does not exist.`)
    } else if (response.status === 401) {
      await unauthHandling()
    } else if (!response.ok) {
      throw new Error(`Unable to fetch Status with ID ${id}.`)
    }
    return response.json()
  } catch (error) {
    throw error
  }
}

export const createStatus = async (boardId: string, newStatus: status): Promise<any> => {
  try {
    const response = await fetchAuth(`${BASE_URL}/${boardId}/statuses`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({ ...newStatus })
    })
    if (response.status === 401) {
      await unauthHandling()
    }
    if (response.status !== 201) {
      throw new Error(`Unable to save the status "${newStatus.name}"`)
    }

    return await response.json()
  } catch (error) {
    throw error
  }
}

export const deleteStatus = async (statusId: number, newStatusId: number = null): Promise<any> => {
  try {
    let response: Response
    if (newStatusId != null) {
      response = await fetchAuth(`${BASE_URL}/${statusId}/${newStatusId}`, {
        method: 'DELETE'
      })
    } else {
      response = await fetchAuth(`${BASE_URL}/${statusId}`, {
        method: 'DELETE'
      })
    }
    if (response.status === 401) {
      await unauthHandling()
    }
    if (!response.ok) {
      throw new Error(`Unable to delete the status with id "${statusId}"`)
    }
  } catch (error) {
    throw error
  }
}

export const checkTaskDepend = async (boardID: string, statusId?: number) => {
  try {
    let response
    if (statusId === undefined) {
      response = await fetchAuth(`${BASE_URL}/${boardID}/statuses/usage`, {})
    } else {
      response = await fetchAuth(`${BASE_URL}/${boardID}/statuses/usage/${statusId}`, {})
    }
    if (response.status === 401) {
      await unauthHandling()
    }
    if (!response.ok) {
      throw new Error(`Unable to get usage of status "${statusId}"`)
    }
    return response.json()
  } catch (error) {
    throw error
  }
}

export const updateStatus = async (boardId: string, statusId: number, statusData: status): Promise<any> => {
  try {
    const response = await fetchAuth(`${BASE_URL}/${boardId}/statuses/${statusId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ ...statusData })
    })
    if (response.status === 401) {
      await unauthHandling()
    }
    if (!response.ok) {
      throw new Error(`Unable to update the status with id "${statusId}".`)
    }
    return response.json() // Assuming the server responds with the updated status object
  } catch (error) {
    throw error
  }
}

export const deleteBoardStatus = async (
  boardID: string,
  statusID: number,
  replaceID?: number
): Promise<void> => {
  const token = getAuthToken() 
  if (!token) {
    throw new Error('Authentication token is missing. Please log in.')
  }

  try {
    const url = replaceID
      ? `${BASE_URL}/${boardID}/statuses/${statusID}/${replaceID}` // With replace ID
      : `${BASE_URL}/${boardID}/statuses/${statusID}` // Without replace ID

    const response = await axios.delete(url, {
      headers: {
        Authorization: `Bearer ${token}` // Include the authorization token
      }
    })

    // Handle non-successful status codes
    if (![200, 204].includes(response.status)) {
      throw new Error(
        `Unable to delete status with ID "${statusID}" from board "${boardID}". Status code: ${response.status}`
      )
    }

    console.log(
      `Successfully deleted status with ID ${statusID} from board ${boardID}${replaceID ? ` and replaced with ${replaceID}` : ''}.`
    )
  } catch (error) {
    console.error('Error deleting status:', error)
    throw new Error(`Failed to delete status: ${error.message}`)
  }
}
