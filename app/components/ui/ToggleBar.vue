<template>
  <!-- Fixed top-right toggle group: language + theme -->
  <div class="fixed top-6 end-6 z-50 flex items-center gap-3">
    <!-- Language Toggle -->
    <button class="toggle-btn" @click="toggleLocale">
      {{ locale === "ar" ? "EN" : "عر" }}
    </button>

    <!-- Theme Toggle -->
    <button class="toggle-btn" @click="toggleTheme" :aria-label="colorMode.value === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'">
      <span v-if="colorMode.value === 'dark'">☀</span>
      <span v-else>☾</span>
    </button>
  </div>
</template>

<script setup lang="ts">
const { locale, setLocale } = useI18n();
const colorMode = useColorMode();

function toggleTheme() {
  colorMode.preference = colorMode.value === "dark" ? "light" : "dark";
}

function toggleLocale() {
  setLocale(locale.value === "ar" ? "en" : "ar");
}
</script>

<style scoped>
.toggle-btn {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  color: var(--color-text);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.toggle-btn:hover {
  background: var(--color-primary);
  color: #0a0a0a;
  border-color: transparent;
}
</style>
