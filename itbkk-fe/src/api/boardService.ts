import axios from 'axios'
import unauthHandling from '@/lib/unauthHandler'

// Get the base URL from the environment variable
const BASE_URL = import.meta.env.VITE_BOARD_URL

// Function to get the auth token from localStorage
export const getAuthToken = (): string | null => {
  const tokenString = localStorage.getItem('access_token')
  if (!tokenString) {
    return null
  }
  return tokenString
}

// Fetch all boards
export const fetchBoards = async () => {
  const token = getAuthToken()
  if (!token) {
    throw new Error('No authentication token found.')
  }

  const response = await axios
    .get(`${BASE_URL}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .catch(async function (error) {
      if (error.response.status === 401) {
        await unauthHandling()
      }
      return null
    })

  if (!response) {
    throw new Error('Failed to fetch boards.')
  }

  return response.data
}

export const fetchBoardById = async (boardId: string) => {
  const token = getAuthToken()
  if (!token) {
    const response = await axios.get(`${BASE_URL}/${boardId}`).catch(function (error) {
      if (error.response.status === 401) {
        unauthHandling()
      }
      return null
    })
    return response.data
  }

  const response = await axios
    .get(`${BASE_URL}/${boardId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .catch(async function (error) {
      if (error.response.status === 401) {
        await unauthHandling()
      }
      return null
    })

  if (!response) {
    throw new Error('Failed to fetch boards.')
  }

  return response.data
}

// Fetch tasks for a specific board
export const fetchBoardTasks = async (boardID: string) => {
  const token = getAuthToken()
  if (!token) {
    const response = await axios.get(`${BASE_URL}/${boardID}/tasks`)
    return response.data
  }

  try {
    const response = await axios.get(`${BASE_URL}/${boardID}/tasks`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    return response.data
  } catch (error) {
    console.error('Error fetching tasks for board:', error)
    throw error
  }
}

export const fetchBoardStatuses = async (boardID: string) => {
  const token = getAuthToken()
  if (!token) {
    const response = await axios.get(`${BASE_URL}/${boardID}/statuses`)
    return response.data
  }

  try {
    const response = await axios.get(`${BASE_URL}/${boardID}/statuses`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    return response.data
  } catch (error) {
    console.error('Error fetching statuses for board:', error)
    throw error
  }
}

export const createBoard = async (board: any) => {
  try {
    const token = getAuthToken()
    if (!token) {
      throw new Error('No authentication token found.')
    }

    // Make a POST request using Axios
    const response = await axios
      .post(`${BASE_URL}`, board, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      })
      .catch(async function (error) {
        if (error.response.status === 401) {
          await unauthHandling()
          return
        }
        if (error.response.status !== 201) {
          throw new Error('Unable to save the board')
        }
      })

    // Check if the response status is not 201 (Created)
    return response
  } catch (error) {
    console.error('Error creating board:', error)
    throw error
  }
}

export const deleteBoard = async (boardId: string) => {
  const token = getAuthToken()

  if (!token) {
    throw new Error('No authentication token found.')
  }
  try {
    const response = await axios.delete(`${BASE_URL}/${boardId}/delete`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    if (response.status < 200 || response.status >= 300) {
      throw new Error(
        `Failed to delete board with ID ${boardId}. Response status: ${response.status}`
      )
    }
  } catch (error) {
    console.error('Error deleting board:', error)
    throw error
  }
}

export const changeVisibility = async (boardId: string, visibility: string) => {
  const token = getAuthToken()
  if (!token) {
    throw new Error('No authentication token found.')
  }

  try {
    const response = await axios.patch(
      `${BASE_URL}/${boardId}`, // Ensure the URL endpoint is correct
      { visibility: visibility }, // Sending visibility in a structured object
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      }
    )

    return response.data
  } catch (error) {
    if (error.response && error.response.status === 403) {
      window.alert("you do not have permission")
    }
    // if (error.response && error.response.status === 401) {
    //   unauthHandling()
    // } else {
    //   console.error('Error changing visibility:', error)
    //   throw new Error('Failed to change visibility.')
    // }
  }
}

export const getPermission = async (boardId: string) => {
  const token = getAuthToken()
  if (!token) {
    return { permission: '' }
  }

  try {
    const response = await axios.get(
      `${BASE_URL}/${boardId}/permissions`, // Ensure the URL endpoint is correct
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      }
    )
    return response.data
  } catch (error) {
    return { permission: '' }
  }
}
