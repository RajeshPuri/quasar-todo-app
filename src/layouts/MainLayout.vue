<template>
  <q-layout view="hHh lpR fFf" class="main-layout">
    <q-header
      elevated
      :class="$q.dark.isActive ? 'bg-dark' : 'bg-white'"
      class="q-py-xs">
      <q-toolbar>
        <q-btn flat round dense color="primary" icon="rocket_launch" />
        <q-toolbar-title class="text-weight-bold text-primary">
          Combined App
        </q-toolbar-title>

        <q-space />

        <div class="flex items-center gap-sm">
          <q-btn
            flat
            round
            :icon="$q.dark.isActive ? 'light_mode' : 'dark_mode'"
            @click="toggleDark"
            color="orange" />

          <q-btn
            unelevated
            label="Logout"
            color="negative"
            @click="logout"
            class="text-weight-bold q-px-md"
            rounded />
        </div>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <q-page class="q-pa-md flex flex-center column no-wrap">
        <!-- Custom Navigation -->
        <div class="navigation-container">
          <div
            class="nav-item"
            :class="{ active: activeTab === 'todo' }"
            @click="activeTab = 'todo'">
            <q-icon name="edit_note" size="xs" />
            Todo
          </div>
          <div
            class="nav-item"
            :class="{ active: activeTab === 'chat' }"
            @click="activeTab = 'chat'">
            <q-icon name="chat" size="xs" />
            Chat
          </div>
        </div>

        <div class="content-wrapper full-width">
          <router-view :active-tab="activeTab" />
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from "vue";
import { useQuasar } from "quasar";
import { useAuth } from "../composables/useAuth";

const $q = useQuasar();
const { logout } = useAuth();
const activeTab = ref("todo");

const toggleDark = () => {
  $q.dark.toggle();
  localStorage.setItem("combined-dark", String($q.dark.isActive));
};
</script>

<style scoped>
.main-layout {
  background: var(--bg-primary);
}

.content-wrapper {
  max-width: 1000px;
  margin: 0 auto;
}

.gap-sm {
  gap: 8px;
}
</style>
