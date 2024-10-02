import { defineStore } from 'pinia'
import { jwtDecode } from 'jwt-decode'
import { refreshAccessTokenService } from '@/api/authService'

interface JwtPayload {
  iss: string
  iat: number
  exp: number
  name: string
  oid: string
  email: string
  role: string
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    accessToken: localStorage.getItem('access_token') || '',
    refreshToken: localStorage.getItem('refresh_token') || '',
    decodedToken: {} as JwtPayload,
    redirectPath: '/'
  }),
  actions: {
    setTokens(accessToken: string, refreshToken: string) {
      this.accessToken = accessToken
      this.refreshToken = refreshToken
      this.decodedToken = jwtDecode<JwtPayload>(accessToken)

      localStorage.setItem('access_token', accessToken)
      localStorage.setItem('refresh_token', refreshToken)
    },
    clearTokens() {
      this.accessToken = ''
      this.refreshToken = ''
      this.decodedToken = {} as JwtPayload
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
    },
    initializeStore() {
      const accessToken = localStorage.getItem('access_token')
      const refreshToken = localStorage.getItem('refresh_token')

      if (accessToken && refreshToken) {
        try {
          const decoded = jwtDecode<JwtPayload>(accessToken)
          const currentTime = Math.floor(Date.now() / 1000)

          if (decoded.exp < currentTime) {
            this.refreshAccessToken()
          } else {
            this.accessToken = accessToken
            this.refreshToken = refreshToken
            this.decodedToken = decoded
          }
        } catch (error) {
          console.error('Error decoding token:', error)
          this.clearTokens()
        }
      }
    },
    async refreshAccessToken() {
      try {
        const newAccessToken = await refreshAccessTokenService(this.refreshToken)
        this.setTokens(newAccessToken, this.refreshToken)
      } catch (error) {
        console.error('Failed to refresh access token:', error)
        this.clearTokens()
      }
    },

    logout() {
      this.clearTokens()
      
    },
    setRedirectPath(path: string) {
      this.redirectPath = path
    },
    clearRedirectPath() {
      this.redirectPath = '/'
    }
  },
  getters: {
    isAuthenticated: (state) => !!state.accessToken,
    userID: (state) => state.decodedToken.iss
  }
})
