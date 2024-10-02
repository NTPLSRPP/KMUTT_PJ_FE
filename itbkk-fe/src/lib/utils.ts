import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
// import { useAuthStore } from "@/stores/AuthStore"
import { getAuthToken } from '@/api/boardService'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function shortenTitle(title, maxSize = 20) {
  if (title.length > maxSize) {
    return `${title.slice(-maxSize)}...`
  }
  return title
}

export const getStatusClass = (status) => {
  switch (status) {
    case 'No Status':
      return 'border border-gray-400 bg-grey-300'
    case 'To Do':
      return 'border border-blue-400 bg-sky-200'
    case 'Doing':
      return 'border border-yellow-400 bg-yellow-300'
    case 'Done':
      return ' border-green-400 bg-green-300' // Green border
    default:
      return 'border-indigo-400 bg-indigo-300' // Default border if no status matches
  }
}

export async function fetchAuth(URL: string, load: RequestInit = {}) {
  const token = getAuthToken()

  if (token) {
    if (!load.headers) {
      load.headers = {}
    }
    load.headers['Authorization'] = `Bearer ${token}`
    return await fetch(URL, load)
  } else {
    return await fetch(URL, load)
  }
}
