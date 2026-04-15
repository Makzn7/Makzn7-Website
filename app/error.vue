<script setup lang="ts">
import type { NuxtError } from "#app";

const props = defineProps<{
  error: NuxtError;
}>();

const statusCode = computed(() => props.error.statusCode ?? 500);
const isNotFound = computed(() => statusCode.value === 404);

function handleError() {
  clearError({ redirect: "/" });
}
</script>

<template>
  <div class="error-page">
    <div class="error-content">
      <h1 class="error-code font-pixel text-brand-primary">
        {{ statusCode }}
      </h1>
      <p class="error-message">
        {{ isNotFound ? "Page not found" : "Something went wrong" }}
      </p>
      <button
        class="error-button uppercase tracking-wider"
        @click="handleError"
      >
        Home
      </button>
    </div>
  </div>
</template>

<style scoped>
.error-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--color-bg);
  color: var(--color-text);
}

.error-content {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}

.error-code {
  font-size: clamp(80px, 15vw, 200px);
  line-height: 1;
}

.error-message {
  font-size: clamp(16px, 2vw, 24px);
  opacity: 0.6;
}

.error-button {
  margin-top: 1rem;
  padding: 0.75rem 2rem;
  border: 0.3px solid var(--color-text);
  font-size: 14px;
  transition: all 0.3s ease;
}

.error-button:hover {
  background-color: var(--color-primary);
  border-color: var(--color-primary);
  color: var(--color-bg);
}
</style>
