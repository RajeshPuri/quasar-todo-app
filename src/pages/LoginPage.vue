<template>
  <q-page class="flex flex-center login-page">
    <div class="auth-box shadow-24 bg-white q-pa-xl">
      <div class="text-center q-mb-xl">
        <q-icon name="rocket_launch" size="64px" color="primary" />
        <h2 class="text-h4 text-weight-bold text-primary q-mt-md q-mb-none">
          {{ authMode === 'login' ? 'Login' : 'Register' }}
        </h2>
        <p class="text-grey-7 q-mt-sm">Welcome to Combined App</p>
      </div>

      <q-form @submit="handleAuth" class="q-gutter-md">
        <q-input
          v-if="authMode === 'register'"
          v-model="authForm.name"
          label="Full Name"
          filled
          lazy-rules
          :rules="[ val => val && val.length > 0 || 'Please type your name']"
          bg-color="grey-1"
        >
          <template v-slot:prepend><q-icon name="person" /></template>
        </q-input>

        <q-input
          v-model="authForm.email"
          label="Email"
          type="email"
          filled
          lazy-rules
          :rules="[ val => val && val.length > 0 || 'Please type your email']"
          bg-color="grey-1"
        >
          <template v-slot:prepend><q-icon name="email" /></template>
        </q-input>

        <q-input
          v-model="authForm.password"
          label="Password"
          type="password"
          filled
          lazy-rules
          :rules="[ val => val && val.length > 0 || 'Please type your password']"
          bg-color="grey-1"
        >
          <template v-slot:prepend><q-icon name="lock" /></template>
        </q-input>

        <div v-if="authError" class="text-negative text-center q-mb-md">
          {{ authError }}
        </div>

        <div class="q-mt-xl">
          <q-btn
            type="submit"
            :label="authMode === 'login' ? 'Sign In' : 'Sign Up'"
            color="primary"
            class="full-width text-weight-bold"
            unelevated
            size="lg"
            rounded
            style="height: 56px;"
          />
        </div>

        <div class="text-center q-mt-lg">
          <span class="text-grey-7">{{ authMode === 'login' ? "Don't have an account? " : 'Already have an account? ' }}</span>
          <q-btn flat color="primary" :label="authMode === 'login' ? 'Register' : 'Login'" @click="toggleAuthMode" dense class="text-weight-bold" />
        </div>
      </q-form>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const API_URL = 'http://localhost:5000/api'

const authMode = ref('login')
const authForm = ref({ name: '', email: '', password: '' })
const authError = ref('')

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

const toggleAuthMode = () => {
  authMode.value = authMode.value === 'login' ? 'register' : 'login'
  authError.value = ''
}
</script>

<style scoped>
.login-page {
  background: linear-gradient(135deg, #f0f2f5 0%, #e9ecef 100%);
}

.auth-box {
  width: 100%;
  max-width: 450px;
  border-radius: 24px;
  border: 1px solid rgba(0,0,0,0.05);
}

:deep(.q-field--filled .q-field__control) {
  border-radius: 12px;
}
</style>
