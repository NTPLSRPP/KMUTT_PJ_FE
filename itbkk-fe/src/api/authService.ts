import { method } from 'cypress/types/bluebird'
import { ref } from 'vue'
/* eslint-disable no-useless-catch */
const BASE_URL = import.meta.env.VITE_AUTH_URL
const TOKEN_REFRESH_URL = import.meta.env.VITE_TOKEN_URL

// const ACCESS_TOKEN_KEY = 'access_token'
// const REFRESH_TOKEN_KEY = 'refresh_token'

export const loginService = async (
  username: string,
  password: string
): Promise<{ access_token: string; refresh_token: string }> => {
  try {
    const response = await fetch(`${BASE_URL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    })

    if (!response.ok) {
      const errorDetails = await response.json()
      throw new Error(`${errorDetails.message || 'Unknown error'}`)
    }

    const { access_token, refresh_token } = await response.json()
    return { access_token, refresh_token }
  } catch (error) {
    throw error
  }
}

export const refreshAccessTokenService = async (refreshToken: string): Promise<String> => {
  try {
    const response = await fetch(`${TOKEN_REFRESH_URL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${refreshToken}`
      }
    })

    if (!response.ok) {
      throw new Error('Failed to refresh to accessToken')
    }
    const { access_token } = await response.json()
    return access_token
  } catch (error) {
    throw error
  }
}
