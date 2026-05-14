import { ref, nextTick } from 'vue'

const API_URL = 'http://localhost:5000/api'

export function useChat(token) {
  const conversations = ref([])
  const activeConv = ref(null)
  const messages = ref([])
  const newMessage = ref('')
  const messagesEnd = ref(null)

  const fetchConversations = async () => {
    try {
      const res = await fetch(`${API_URL}/conversations`, {
        headers: { 'x-auth-token': token }
      })
      if (res.ok) conversations.value = await res.json()
    } catch (err) {
      console.error(err)
    }
  }

  const fetchMessages = async (convId) => {
    try {
      const res = await fetch(`${API_URL}/conversations/${convId}/messages`, {
        headers: { 'x-auth-token': token }
      })
      if (res.ok) {
        messages.value = await res.json()
        scrollToBottom()
      }
    } catch (err) {
      console.error(err)
    }
  }

  const setActiveConv = (conv) => {
    activeConv.value = conv
    fetchMessages(conv.id)
  }

  const sendMessage = async () => {
    if (!newMessage.value.trim() || !activeConv.value) return
    try {
      const res = await fetch(`${API_URL}/conversations/${activeConv.value.id}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify({ text: newMessage.value })
      })
      if (res.ok) {
        newMessage.value = ''
        fetchMessages(activeConv.value.id)
      }
    } catch (err) {
      console.error(err)
    }
  }

  const getConvName = (conv) => conv.type === 'group' ? conv.name : conv.members?.[0]?.name || 'Chat'

  const getCurrentUserId = () => {
    try {
      return JSON.parse(atob(token.split('.')[1])).user.id
    } catch {
      return null
    }
  }

  const formatTime = (date) => new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

  const scrollToBottom = () => {
    nextTick(() => {
      if (messagesEnd.value) {
        messagesEnd.value.scrollIntoView({ behavior: 'smooth' })
      }
    })
  }

  return {
    conversations,
    activeConv,
    messages,
    newMessage,
    messagesEnd,
    fetchConversations,
    fetchMessages,
    setActiveConv,
    sendMessage,
    getConvName,
    getCurrentUserId,
    formatTime
  }
}
