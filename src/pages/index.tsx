import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useAuthStore } from '../stores/auth/authStore'

const HomePage = () => {
  const router = useRouter()
  const currentUser = useAuthStore((state) => state.currentUser)

  useEffect(() => {
    if (currentUser === undefined) return 

    if (currentUser) {
      router.push('/dashboard') 
    } else {
      router.push('/login')
    }
  }, [currentUser, router])

  return null 
}

export default HomePage
