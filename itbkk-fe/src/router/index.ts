import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import LoginPage from '@/views/LoginPage.vue'
import { useAuthStore } from '@/stores/AuthStore'
import { useBoardStore } from '@/stores/BoardStore'
import boardHome from '@/views/boardHome.vue'
import AccessDenied from '@/views/AccessDenied.vue'
import { refreshAccessTokenService } from '@/api/authService'
import { getPermission } from '@/api/boardService'
import { jwtDecode } from 'jwt-decode'


const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: { name: 'BoardView' }
  },
  {
    path: '/login',
    name: 'loginPage',
    component: LoginPage
  },
  {
    path: '/board/:boardID?',
    name: 'BoardView',
    component: boardHome,
    meta: { requiresAuth: true }
  },
  {
    path: '/board/add',
    name: 'BoardViewAdd',
    component: boardHome,
    meta: { requiresAuth: true }
  },
  {
    path: '/board/:boardID/delete',
    name: 'BoardViewDelete',
    component: boardHome,
    meta: { requiresAuth: true } // Example meta property
  },
  {
    path: '/board/:boardID/task/:taskID',
    name: 'BoardTaskDetails',
    component: boardHome,
    meta: { requiresAuth: true } // This route requires authentication
  },
  {
    path: '/board/:boardID/task/add',
    name: 'BoardTaskAdd',
    component: boardHome,
    meta: { requiresAuth: true } // This route also requires authentication
  },
  {
    path: '/board/:boardID/task/:taskID/edit',
    name: 'BoardTaskEdit',
    component: boardHome,
    meta: { requiresAuth: true } // This route also requires authentication
  },
  {
    path: '/board/:boardID/status',
    name: 'BoardStatusHome',
    component: boardHome,
    meta: { requiresAuth: true }
  },
  {
    path: '/board/:boardID/status/add',
    name: 'BoardStatusAdd',
    component: boardHome,
    meta: { requiresAuth: true }
  },
  {
    path: '/board/:boardID/status/:statusID/edit',
    name: 'BoardStatusEdit',
    component: boardHome,
    meta: { requiresAuth: true }
  },
  {
    path: '/access-denied',
    name: 'AccessDeniedPage',
    component: AccessDenied
  },
  {
    path: '/:pathMatch(.*)*', // Catch-all route for any paths not defined
    redirect: { name: 'BoardView' } // Redirect all unmatched paths to login
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

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

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  const boardStore = useBoardStore()
  const accessToken = localStorage.getItem('access_token')
  const refreshToken = localStorage.getItem('refresh_token')

  console.log('Access token:', accessToken)
  console.log('Refresh token:', refreshToken)

  let isFinished = false //for guard order

  if (to.meta.requiresAuth) {
    if (isTokenExpired(accessToken) && accessToken || !accessToken) {
      if (refreshToken) {
        try {
          const newAccessToken = await refreshAccessTokenService(refreshToken)
          authStore.setTokens(newAccessToken.toString(), refreshToken)
          isFinished = true
          return next()
        } catch (error) {
          authStore.clearTokens() // Clear tokens if refresh failed
          authStore.setRedirectPath(to.fullPath)
          return next({ name: 'loginPage' }) // Redirect to login
        }
      } else {
        // No refresh token, clear tokens and redirect to login
        authStore.clearTokens()
        authStore.setRedirectPath(to.fullPath)
        return next({ name: 'loginPage' })
      }
    }
    isFinished = true
  }

  const boardID = to.params.boardID as string
  if (boardID && isFinished) {
    try {
      await boardStore.fetchBoardById(boardID)
      const board = boardStore.currentBoard

      const canAccess = (await getPermission(boardID)).permission
      const isPublic = board.isPublic
      const viewOnlyRoutes = ['BoardView', 'BoardTaskDetails', 'BoardStatusHome']
      const hasPermissionOnlyRoutes = [
        'BoardTaskAdd',
        'BoardTaskEdit',
        'BoardStatusAdd',
        'BoardStatusEdit'
      ]

      if (viewOnlyRoutes.includes(to.name as string)) {
        if (canAccess || isPublic) {
          return next()
        } else {
          return next({ name: 'AccessDeniedPage' })
        }
      }
      if (hasPermissionOnlyRoutes.includes(to.name as string)) {
        if (canAccess === 'write' || canAccess === 'owner') {
          return next()
        } else {
          return next({ name: 'AccessDeniedPage' })
        }
      }
    } catch (error) {
      console.error('Error fetching board:', error)
      return next({ name: 'BoardView' })
    }
  }

  if (to.name === 'BoardView' && !to.params.boardID) {
    if (!accessToken) {
      // No access token, redirect to login
      authStore.setRedirectPath(to.fullPath)
      return next({ name: 'loginPage' })
    }
  }

  // Check if the route requires authentication
  
  return next()
})

export default router
