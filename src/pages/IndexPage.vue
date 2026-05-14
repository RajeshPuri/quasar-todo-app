<template>
  <div class="q-pa-md">
    <q-tab-panels v-model="localActiveTab" animated class="bg-transparent">
      <q-tab-panel name="todo" class="q-pa-none">
        <TodoApp :token="token" :isDark="$q.dark.isActive" />
      </q-tab-panel>
      <q-tab-panel name="chat" class="q-pa-none">
        <ChatApp :token="token" :isDark="$q.dark.isActive" />
      </q-tab-panel>
    </q-tab-panels>
  </div>
</template>


<script setup>
import { ref, watch } from 'vue'
import TodoApp from '../components/TodoApp.vue'
import ChatApp from '../components/ChatApp.vue'

const props = defineProps({
  activeTab: String
})

const token = ref(localStorage.getItem('combined-token'))
const localActiveTab = ref(props.activeTab || 'todo')

watch(() => props.activeTab, (val) => {
  if (val) localActiveTab.value = val
})
</script>
