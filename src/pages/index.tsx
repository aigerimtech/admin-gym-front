import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useAuthStore } from '../stores/auth/authStore'

const HomePage = () => {
  const router = useRouter()
  const token = useAuthStore((state) => state.token)

  useEffect(() => {
    if (token === undefined) return

    if (token) {
      router.push('/dashboard') 
    } else {
      router.push('/login')
    }
  }, [token, router])

  return null 
}

export default HomePage
