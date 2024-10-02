import { ref } from 'vue'
import router from '../router'
import { useAuthStore } from '../stores/AuthStore'
import { jwtDecode } from 'jwt-decode'
import { refreshAccessTokenService } from '../api/authService'
export default async function unauthHandling() {
  const authStore = useAuthStore()
  const accessToken = localStorage.getItem('access_token')
  const refreshToken = localStorage.getItem('refresh_token')

  function isTokenExpired(token: string): boolean {
    try {
      const decoded = jwtDecode<{ exp: number }>(token)
      const currentTime = Math.floor(Date.now() / 1000)
      return decoded.exp < currentTime
    } catch (error) {
      console.error('Error decoding token:', error)
      return true
    }
  }

  if (isTokenExpired(accessToken)) {
    if (refreshToken) {
      try {
        const newAccessToken = await refreshAccessTokenService(refreshToken)
        authStore.setTokens(newAccessToken.toString(), refreshToken)
        return
      } catch (error) {
        authStore.clearTokens() // Clear tokens if refresh failed
        return router.push({ name: 'loginPage' }) // Redirect to login
      }
    } else {
      // No refresh token, clear tokens and redirect to login
      authStore.clearTokens()
      return router.push({ name: 'loginPage' })
    }
  }
}
