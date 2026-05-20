<script setup lang="ts">
import type { NuxtError } from "#app";

const props = defineProps<{
  error: NuxtError;
}>();

const statusCode = computed(() => props.error.statusCode ?? 500);
const isNotFound = computed(() => statusCode.value === 404);

useSeoMeta({
  title: () =>
    isNotFound.value ? "Page Not Found — Makzn7" : "Error — Makzn7",
  robots: "noindex, nofollow",
});

function handleError() {
  clearError({ redirect: "/" });
}
</script>

<template>
  <div class="error-page">
    <div class="error-content">
      <h1
        class="error-code"
        :style="`font-size: clamp(${Math.max(80, Math.round(310 * 0.35))}px, ${(
          310 / 20
        ).toFixed(1)}vw, ${310}px);`"
      >
        <span class="bracket">(</span>
        {{ statusCode }}
        <span class="bracket">)</span>
      </h1>
      <p
        class="font-en error-message font-light"
        :style="`font-size: clamp(${Math.max(14, Math.round(35 * 0.35))}px, ${(
          35 / 20
        ).toFixed(1)}vw, ${35}px);`"
      >
        {{ isNotFound ? "Page not Found" : "Something went wrong" }}
      </p>
      <button class="font-en error-button" @click="handleError">Go Home</button>
    </div>
  </div>
</template>

<style scoped>
.error-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #000000;
  color: #ffffff;
}

.error-content {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
}

.error-code {
  font-family: "DotGothic16", monospace;
  line-height: 1;
  color: #ffffff;
}

.bracket {
  font-family: "DotGothic16", monospace;
  color: #ffffff;
}

.error-message {
  color: #ffffff;
  letter-spacing: 0.05em;
}

.error-button {
  margin-top: 0.5rem;
  padding: 0.75rem 2.5rem;
  background-color: #54ea62;
  border: 1px solid #54ea62;
  color: #000000;
  cursor: pointer;
  transition: background-color 0.25s ease, color 0.25s ease;
}

.error-button:hover {
  background-color: transparent;
  color: #ffffff;
  border-color: #ffffff;
}
</style>
