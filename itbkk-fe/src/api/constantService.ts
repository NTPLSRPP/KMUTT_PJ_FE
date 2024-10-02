const BASE_URL = import.meta.env.VITE_CONSTANT_URL
import unauthHandling from "@/lib/unauthHandler"
import { fetchAuth } from "@/lib/utils"


export const getConstants = async (name: string): Promise<any> => {
  try {
    const response = await fetchAuth(`${BASE_URL}/${name}`, {})
    if(response.status === 401){
      await unauthHandling();
    }
    if (!response.ok) {
      const errorDetails = await response.json()
      throw new Error(`${errorDetails.message || 'Unknown error'}`)
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Failed to fetch constants:', error)
    throw error // Rethrowing the error to be handled by the caller
  }
}
