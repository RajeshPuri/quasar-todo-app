<template>
  <div class="chat-app">
    <div class="chat-card shadow-1">
      <!-- Sidebar -->
      <div class="chat-sidebar">
        <div class="sidebar-header q-pa-md border-bottom">
          <h3 class="text-subtitle1 text-weight-bold q-ma-none">Chats</h3>
          <div class="flex gap-xs">
            <q-btn flat round dense icon="person_add" size="sm" />
            <q-btn flat round dense icon="group_add" size="sm" />
          </div>
        </div>

        <div class="conv-list scrollable">
          <div
            v-for="conv in conversations"
            :key="conv.id"
            class="conversation-item q-pa-md"
            :class="{ active: activeConv?.id === conv.id }"
            @click="setActiveConv(conv)"
          >
            <q-avatar color="primary" text-color="white" size="40px" class="q-mr-md">
              {{ getConvName(conv).charAt(0) }}
            </q-avatar>
            <div class="conv-info">
              <div class="text-weight-bold ellipsis">{{ getConvName(conv) }}</div>
              <div class="text-caption text-grey ellipsis">
                {{ conv.lastMessage ? conv.lastMessage.text : 'No messages yet' }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Chat Area -->
      <div class="chat-main">
        <div v-if="activeConv" class="chat-window">
          <div class="chat-header q-pa-md border-bottom">
            <q-avatar color="primary" text-color="white" size="32px" class="q-mr-sm">
              {{ getConvName(activeConv).charAt(0) }}
            </q-avatar>
            <div class="text-weight-bold">{{ getConvName(activeConv) }}</div>
          </div>

          <div class="messages-container q-pa-md scrollable">
            <div
              v-for="msg in messages"
              :key="msg.id"
              class="message-row"
              :class="{ own: msg.user_id === getCurrentUserId() }"
            >
              <div class="message-bubble shadow-1">
                <div class="message-text">{{ msg.text }}</div>
                <div class="message-time">{{ formatTime(msg.created_at) }}</div>
              </div>
            </div>
            <div ref="messagesEnd"></div>
          </div>

          <div class="input-area q-pa-md border-top">
            <form @submit.prevent="sendMessage" class="flex no-wrap gap-sm">
              <q-input
                v-model="newMessage"
                placeholder="Type your message..."
                filled
                dense
                class="flex-grow"
                @keyup.enter="sendMessage"
              />
              <q-btn color="primary" icon="send" unelevated round @click="sendMessage" />
            </form>
          </div>
        </div>
        <div v-else class="flex flex-center full-height column text-grey-6">
          <q-icon name="forum" size="64px" class="q-mb-md opacity-50" />
          <div class="text-h6">Select a chat to start messaging</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'

const props = defineProps({
  token: String,
  isDark: Boolean
})

const API_URL = 'http://localhost:5000/api'
const conversations = ref([])
const activeConv = ref(null)
const messages = ref([])
const newMessage = ref('')
const messagesEnd = ref(null)

onMounted(() => {
  fetchConversations()
})

const fetchConversations = async () => {
  try {
    const res = await fetch(`${API_URL}/conversations`, { headers: { 'x-auth-token': props.token } })
    if (res.ok) conversations.value = await res.json()
  } catch (err) { console.error(err) }
}

const fetchMessages = async (convId) => {
  try {
    const res = await fetch(`${API_URL}/conversations/${convId}/messages`, { headers: { 'x-auth-token': props.token } })
    if (res.ok) {
      messages.value = await res.json()
      scrollToBottom()
    }
  } catch (err) { console.error(err) }
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
      headers: { 'Content-Type': 'application/json', 'x-auth-token': props.token },
      body: JSON.stringify({ text: newMessage.value })
    })
    if (res.ok) {
      newMessage.value = ''
      fetchMessages(activeConv.value.id)
    }
  } catch (err) { console.error(err) }
}

const getConvName = (conv) => conv.type === 'group' ? conv.name : conv.members?.[0]?.name || 'Chat'
const getCurrentUserId = () => {
  try { return JSON.parse(atob(props.token.split('.')[1])).user.id } catch { return null }
}
const formatTime = (date) => new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
const scrollToBottom = () => nextTick(() => messagesEnd.value?.scrollIntoView({ behavior: 'smooth' }))
</script>

<style scoped>
.chat-app {
  height: 600px;
  max-width: 1000px;
  margin: 0 auto;
}

.chat-card {
  display: flex;
  height: 100%;
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.chat-sidebar {
  width: 280px;
  border-right: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
}

.sidebar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.conv-list {
  flex-grow: 1;
}

.conversation-item {
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: background 0.2s;
}

.conversation-item:hover {
  background: var(--bg-hover);
}

.conversation-item.active {
  background: var(--active-conv-bg);
  border-left: 4px solid var(--color-primary);
}

.conv-info {
  flex-grow: 1;
  min-width: 0;
}

.chat-main {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.chat-window {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.messages-container {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.message-row {
  display: flex;
  flex-direction: column;
}

.message-row.own {
  align-items: flex-end;
}

.message-bubble {
  max-width: 75%;
  padding: 10px 14px;
  border-radius: 12px;
  background: var(--bg-hover);
  position: relative;
}

.message-row.own .message-bubble {
  background: var(--color-primary);
  color: white;
  border-radius: 12px 12px 0 12px;
}

.message-row:not(.own) .message-bubble {
  border-radius: 12px 12px 12px 0;
}

.message-time {
  font-size: 10px;
  margin-top: 4px;
  opacity: 0.7;
}

.scrollable {
  overflow-y: auto;
}

.border-bottom { border-bottom: 1px solid var(--border-color); }
.border-top { border-top: 1px solid var(--border-color); }
.flex-grow { flex-grow: 1; }
.gap-sm { gap: 8px; }
.gap-xs { gap: 4px; }
</style>