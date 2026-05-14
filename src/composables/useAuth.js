import { ref } from 'vue'
import { useRouter } from 'vue-router'

const API_URL = 'http://localhost:5000/api'

export function useAuth() {
  const router = useRouter()
  const authForm = ref({ name: '', email: '', password: '' })
  const authError = ref('')
  const authMode = ref('login')

  const handleAuth = async () => {
    authError.value = ''
    const endpoint = authMode.value === 'login' ? '/auth/login' : '/auth/register'
    try {
      const res = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(authForm.value)
      })
      const data = await res.json()
      if (res.ok) {
        localStorage.setItem('combined-token', data.token)
        router.push('/')
      } else {
        authError.value = data.message
      }
    } catch (err) {
      authError.value = 'Server error'
    }
  }

  const logout = () => {
    localStorage.removeItem('combined-token')
    router.push('/login')
  }

  const toggleAuthMode = () => {
    authMode.value = authMode.value === 'login' ? 'register' : 'login'
    authError.value = ''
  }

  return {
    authForm,
    authError,
    authMode,
    handleAuth,
    logout,
    toggleAuthMode
  }
}
