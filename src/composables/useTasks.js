import { ref, computed } from 'vue'
import { useQuasar } from 'quasar'

const API_URL = 'http://localhost:5000/api'

export function useTasks(token) {
  const $q = useQuasar()
  const tasks = ref([])
  const filter = ref('all')
  const newTask = ref('')

  const fetchTasks = async () => {
    try {
      const res = await fetch(`${API_URL}/tasks`, {
        headers: { 'x-auth-token': token }
      })
      if (res.ok) tasks.value = await res.json()
    } catch (err) {
      console.error(err)
    }
  }

  const addTask = async () => {
    if (!newTask.value.trim()) return
    try {
      const res = await fetch(`${API_URL}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify({ text: newTask.value })
      })
      if (res.ok) {
        newTask.value = ''
        fetchTasks()
        $q.notify({
          color: 'positive',
          message: 'Task added successfully',
          icon: 'check',
          timeout: 2000
        })
      } else {
        $q.notify({
          color: 'negative',
          message: 'Failed to add task',
          icon: 'error'
        })
      }
    } catch (err) {
      console.error(err)
      $q.notify({
        color: 'negative',
        message: 'Network error',
        icon: 'wifi_off'
      })
    }
  }

  const toggleTask = async (task) => {
    try {
      const res = await fetch(`${API_URL}/tasks/${task.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify({ completed: task.completed })
      })

      if (!res.ok) {
        task.completed = !task.completed
        $q.notify({
          color: 'negative',
          message: 'Failed to update task',
          icon: 'error'
        })
      } else {
        fetchTasks()
      }
    } catch (err) {
      console.error(err)
      task.completed = !task.completed
      $q.notify({
        color: 'negative',
        message: 'Network error occurred',
        icon: 'wifi_off'
      })
    }
  }

  const deleteTask = async (id) => {
    try {
      const res = await fetch(`${API_URL}/tasks/${id}`, {
        method: 'DELETE',
        headers: { 'x-auth-token': token }
      })
      if (res.ok) {
        fetchTasks()
        $q.notify({
          color: 'warning',
          message: 'Task deleted',
          icon: 'delete',
          timeout: 2000
        })
      } else {
        $q.notify({
          color: 'negative',
          message: 'Failed to delete task',
          icon: 'error'
        })
      }
    } catch (err) {
      console.error(err)
      $q.notify({
        color: 'negative',
        message: 'Network error',
        icon: 'wifi_off'
      })
    }
  }

  const filteredTasks = computed(() => {
    if (filter.value === 'active') return tasks.value.filter(t => !t.completed)
    if (filter.value === 'completed') return tasks.value.filter(t => t.completed)
    return tasks.value
  })

  const activeCount = computed(() => tasks.value.filter(t => !t.completed).length)

  return {
    tasks,
    filter,
    newTask,
    fetchTasks,
    addTask,
    toggleTask,
    deleteTask,
    filteredTasks,
    activeCount
  }
}
