<template>
  <div class="todo-app q-mx-auto" style="max-width: 500px">
    <div class="text-center q-mb-xl">
      <h2
        class="text-h4 text-weight-bold flex justify-center items-center gap-sm">
        <span class="text-h3">📝</span> My Tasks
      </h2>
    </div>

    <!-- Add Task Section -->
    <div class="q-mb-lg flex no-wrap gap-sm">
      <q-input
        v-model="newTask"
        placeholder="Add a new task..."
        outlined
        class="flex-grow"
        bg-color="transparent"
        @keyup.enter="addTask"
        dense
        style="flex: 1" />
      <q-btn
        color="primary"
        label="Add"
        unelevated
        @click="addTask"
        class="q-px-lg text-weight-bold"
        style="height: 40px" />
    </div>

    <!-- Filter Buttons (Segmented style) -->
    <div class="filter-wrapper q-mb-lg">
      <div class="filter-container">
        <div
          v-for="f in ['all', 'active', 'completed']"
          :key="f"
          class="filter-item"
          :class="{ active: filter === f }"
          @click="filter = f">
          {{ f.charAt(0).toUpperCase() + f.slice(1) }}
        </div>
      </div>
    </div>

    <!-- Task List -->
    <div class="task-container shadow-1 q-mb-xl">
      <div
        v-for="(task, index) in filteredTasks"
        :key="task.id"
        class="task-row">
        <div class="flex items-center full-width q-pa-md">
          <q-checkbox
            v-model="task.completed"
            @update:model-value="toggleTask(task)"
            color="primary"
            size="md" />
          <div
            class="q-ml-md flex-grow text-weight-medium"
            :class="{ 'text-strike text-grey': task.completed }"
            style="flex: 1">
            {{ task.text }}
          </div>
          <q-btn
            flat
            round
            icon="delete_outline"
            color="grey-7"
            size="sm"
            @click="deleteTask(task.id)" />
        </div>
        <q-separator
          v-if="index < filteredTasks.length - 1"
          color="border-color" />
      </div>
      <div
        v-if="filteredTasks.length === 0"
        class="q-pa-xl text-center text-grey-6">
        <q-icon name="assignment" size="48px" class="q-mb-sm opacity-50" />
        <div class="text-subtitle1">No tasks found</div>
      </div>
    </div>

    <!-- Stats Bar -->
    <div class="stats-card q-pa-lg text-center shadow-1">
      <span class="text-weight-bold text-primary text-h6">{{
        activeCount
      }}</span>
      <span class="text-grey-7 q-ml-sm text-subtitle1">remaining</span>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { useTasks } from "../composables/useTasks";

const props = defineProps({
  token: String,
  isDark: Boolean,
});

const {
  tasks,
  filter,
  newTask,
  fetchTasks,
  addTask,
  toggleTask,
  deleteTask,
  filteredTasks,
  activeCount,
} = useTasks(props.token);

onMounted(() => {
  fetchTasks();
});
</script>

<style scoped>
.gap-sm {
  gap: 12px;
}

.filter-wrapper {
  background: var(--bg-card);
  padding: 6px;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow);
}

.filter-container {
  display: flex;
  gap: 4px;
}

.filter-item {
  flex: 1;
  text-align: center;
  padding: 8px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  color: var(--text-secondary);
  transition: all 0.2s ease;
}

.filter-item.active {
  background: var(--color-primary);
  color: white;
}

.task-container {
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow);
}

.stats-card {
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow);
}

.opacity-50 {
  opacity: 0.5;
}
</style>
