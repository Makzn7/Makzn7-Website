<template>
  <div
    class="filter-section w-full border-y-[0.3px] lg:border-t-0 border-white-op50 border-brand-text pe-[var(--railW)]"
    :style="`padding-inline-start: ${marginS}px;`"
  >
    <!-- Loading skeleton -->
    <div
      v-if="loading"
      class="flex items-start gap-8 px-4 py-4 lg:border-s-[0.3px] border-white-op50"
    >
      <div v-for="i in 3" :key="i" class="flex flex-col gap-2">
        <div class="h-2.5 w-16 rounded bg-white/10 animate-pulse" />
        <div
          v-for="j in 4"
          :key="j"
          class="h-2.5 w-20 rounded bg-white/5 animate-pulse"
        />
      </div>
    </div>

    <!-- Error state -->
    <div
      v-else-if="error"
      class="flex px-4 py-4 border-s-[0.3px] border-white-op50"
    >
      <span class="text-brand-text/30 text-[12px] uppercase tracking-wider">
        {{ $t("filters.error") }}
      </span>
    </div>

    <template v-else>
      <!-- ══ Desktop: original inline filters layout ══ -->
      <div
        class="hidden lg:flex justify-between items-start px-4 py-4 border-s-[0.3px] border-white-op50"
      >
        <template
          v-for="(group, groupIndex) in groupedFilters"
          :key="groupIndex"
        >
          <div
            v-for="(subCol, subIndex) in splitGroup(group.items)"
            :key="`${groupIndex}-${subIndex}`"
            class="flex flex-col gap-[5px] min-w-[100px] pe-6"
          >
            <span
              v-if="subIndex === 0"
              class="font-light text-[14px] uppercase tracking-none text-brand-text/30 mb-0.5 whitespace-nowrap text-primary"
            >
              {{ $t(`filters.${group.type}`, group.type) }}:
            </span>
            <button
              v-for="filter in subCol"
              :key="`${filter.type}-${filter.id}`"
              class="white-link-sm text-start text-[14px] font-light uppercase leading-[1.45] transition-colors duration-200 whitespace-nowrap"
              :class="
                isActive(filter)
                  ? 'active'
                  : 'text-brand-text/50 hover:text-brand-text/80'
              "
              @click="$emit('toggle-filter', filter)"
            >
              {{ locale === "ar" ? filter.name_ar : filter.name_en }}
            </button>
          </div>
        </template>
      </div>

      <!-- ══ Mobile: trigger button row ══ -->
      <div class="lg:hidden flex items-center justify-between gap-3 px-4 py-3">
        <button
          type="button"
          class="flex items-center gap-2 text-[13px] uppercase font-light tracking-[1px] text-brand-text/80"
          @click="mobileOpen = true"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path d="M3 5h18M6 12h12M10 19h4" />
          </svg>
          <span>{{ $t("filters.button") }}</span>
          <span
            v-if="activeFilters.length"
            class="ms-1 px-1.5 py-0.5 text-[11px] leading-none rounded-full bg-[var(--main-color)] text-black font-medium"
          >
            {{ activeFilters.length }}
          </span>
        </button>

        <button
          v-if="activeFilters.length"
          type="button"
          class="text-[12px] uppercase tracking-[1px] text-brand-text/50 hover:text-brand-text/80 transition-colors"
          @click="clearAll"
        >
          {{ $t("filters.clear") }}
        </button>
      </div>

      <!-- ══ Mobile bottom-sheet dialog ══ -->
      <ClientOnly>
        <Teleport to="body">
          <Transition name="filter-sheet">
            <div
              v-if="mobileOpen"
              class="filter-sheet"
              role="dialog"
              aria-modal="true"
              :aria-label="$t('filters.title')"
            >
              <div
                class="filter-sheet__backdrop"
                @click="mobileOpen = false"
                aria-hidden="true"
              />
              <div class="filter-sheet__panel" @click.stop>
                <header class="filter-sheet__header">
                  <span class="filter-sheet__title">
                    {{ $t("filters.title") }}
                  </span>
                  <button
                    type="button"
                    class="filter-sheet__close"
                    :aria-label="$t('filters.close')"
                    @click="mobileOpen = false"
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      aria-hidden="true"
                    >
                      <path d="M6 6l12 12M18 6L6 18" />
                    </svg>
                  </button>
                </header>

                <div class="filter-sheet__body-wrap">
                  <div
                    ref="bodyEl"
                    class="filter-sheet__body"
                    @scroll.passive="onBodyScroll"
                  >
                    <div
                      v-for="group in groupedFilters"
                      :key="group.type"
                      class="filter-sheet__group"
                    >
                      <span class="filter-sheet__group-title">
                        {{ $t(`filters.${group.type}`, group.type) }}
                      </span>
                      <div class="filter-sheet__chips">
                        <button
                          v-for="filter in group.items"
                          :key="`${filter.type}-${filter.id}`"
                          type="button"
                          class="filter-sheet__chip"
                          :class="{ 'is-active': isActive(filter) }"
                          @click="$emit('toggle-filter', filter)"
                        >
                          {{
                            locale === "ar" ? filter.name_ar : filter.name_en
                          }}
                        </button>
                      </div>
                    </div>
                  </div>

                  <!--
                    Affordances for "there's more below" — many users on mobile
                    don't realise a sheet scrolls. Both the fade and the
                    bouncing chevron disappear once the user reaches (or has
                    started scrolling toward) the bottom.
                  -->
                  <div
                    class="filter-sheet__fade"
                    :class="{ 'is-hidden': scrollAtBottom }"
                    aria-hidden="true"
                  />
                  <div
                    v-if="showScrollHint"
                    class="filter-sheet__scroll-hint"
                    aria-hidden="true"
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="1.6"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </div>
                </div>

                <footer class="filter-sheet__footer">
                  <button
                    type="button"
                    class="filter-sheet__action filter-sheet__action--ghost"
                    :disabled="!activeFilters.length"
                    @click="clearAll"
                  >
                    {{ $t("filters.clear") }}
                  </button>
                  <button
                    type="button"
                    class="filter-sheet__action filter-sheet__action--primary"
                    @click="mobileOpen = false"
                  >
                    {{ $t("filters.done") }}
                  </button>
                </footer>
              </div>
            </div>
          </Transition>
        </Teleport>
      </ClientOnly>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from "vue";

const { locale } = useI18n();

interface Filter {
  id: number | string;
  type: string;
  name_ar: string;
  name_en: string;
  slug: string;
}

const props = withDefaults(
  defineProps<{
    marginS?: number;
    filters?: Filter[];
    activeFilters?: Filter[];
    loading?: boolean;
    error?: boolean;
  }>(),
  {
    marginS: 140,
    filters: () => [],
    activeFilters: () => [],
    loading: false,
    error: false,
  }
);

const emit = defineEmits<{
  "toggle-filter": [filter: Filter];
}>();

const MAX_ROWS = 6;
const mobileOpen = ref(false);

/* ── scroll-hint state for the sheet body ─────────────────────
   Many users don't realise a bottom-sheet scrolls. We show a
   fade gradient + a small bouncing chevron at the bottom edge
   while there's still content below the fold; both disappear
   once the user has scrolled near the bottom (or in one motion). */
const bodyEl = ref<HTMLElement | null>(null);
const scrollAtBottom = ref(false);
const hasScrolled = ref(false);
const hasOverflow = ref(false);

const showScrollHint = computed(
  () => hasOverflow.value && !scrollAtBottom.value && !hasScrolled.value
);

function onBodyScroll() {
  const el = bodyEl.value;
  if (!el) return;
  hasScrolled.value = true;
  scrollAtBottom.value = el.scrollTop + el.clientHeight >= el.scrollHeight - 8;
}

function measureOverflow() {
  const el = bodyEl.value;
  if (!el) {
    hasOverflow.value = false;
    return;
  }
  hasOverflow.value = el.scrollHeight - el.clientHeight > 4;
  scrollAtBottom.value = el.scrollTop + el.clientHeight >= el.scrollHeight - 8;
}

const groupedFilters = computed(() => {
  const map: Record<string, Filter[]> = {};
  const order: string[] = [];
  for (const f of props.filters) {
    if (!map[f.type]) {
      map[f.type] = [];
      order.push(f.type);
    }
    map[f.type]!.push(f);
  }
  return order.map((type) => ({ type, items: map[type]! }));
});

function splitGroup(items: Filter[]) {
  const cols: Filter[][] = [];
  for (let i = 0; i < items.length; i += MAX_ROWS) {
    cols.push(items.slice(i, i + MAX_ROWS));
  }
  return cols;
}

function isActive(filter: Filter) {
  return props.activeFilters.some(
    (f) => f.type === filter.type && f.slug === filter.slug
  );
}

function clearAll() {
  /*
    Toggle each active filter off via the same channel the parent already
    listens to — keeps URL syncing logic in one place (ProjectsHero).
  */
  for (const f of [...props.activeFilters]) {
    emit("toggle-filter", f);
  }
}

/*
  Lock body scroll while the sheet is open so background gestures don't
  fight the dialog. Restored when closed or on unmount.
*/
let previousBodyOverflow = "";
watch(mobileOpen, (open) => {
  if (typeof document === "undefined") return;
  if (open) {
    previousBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    /* Reset scroll-hint state on each open and measure once mounted */
    hasScrolled.value = false;
    scrollAtBottom.value = false;
    hasOverflow.value = false;
    nextTick(() => {
      measureOverflow();
    });
  } else {
    document.body.style.overflow = previousBodyOverflow;
  }
});

/* Re-measure when the filter list itself changes (data loaded async) */
watch(
  () => props.filters.length,
  () => {
    if (mobileOpen.value) {
      nextTick(measureOverflow);
    }
  }
);
onBeforeUnmount(() => {
  if (typeof document !== "undefined" && mobileOpen.value) {
    document.body.style.overflow = previousBodyOverflow;
  }
});
</script>

<style scoped>
@media (max-width: 1024px) {
  .filter-section {
    padding-inline-start: 0 !important;
  }
}

/* ══════════════════════════════════════════════
   Mobile bottom-sheet — matches site identity
   (dark surface, primary accent, hairline borders)
   ══════════════════════════════════════════════ */
.filter-sheet {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: flex-end;
  justify-content: stretch;
}

.filter-sheet__backdrop {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
}

.filter-sheet__panel {
  position: relative;
  width: 100%;
  max-height: 85vh;
  display: flex;
  flex-direction: column;
  /*
    Sheet is teleported to <body>, outside the projects page's local `.dark`
    scope, so theme tokens don't resolve. The projects hero is always dark
    by design — pin the surface to match without relying on inherited vars.
  */
  background: #000;
  color: #fff;
  border-top: 0.3px solid var(--main-color, #54ea62);
  /* border-inline-start: 0.3px solid var(--main-color, #54ea62);
  border-inline-end: 0.3px solid var(--main-color, #54ea62);
  border-top-left-radius: 4px;
  border-top-right-radius: 4px; */
  padding-bottom: env(safe-area-inset-bottom, 0px);
}

.filter-sheet__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 0.3px solid var(--border-op-color, rgba(255, 255, 255, 0.5));
}

.filter-sheet__title {
  font-size: 14px;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: var(--main-color, #54ea62);
  font-weight: 300;
}

.filter-sheet__close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  color: #fff;
  opacity: 0.7;
  transition: opacity 0.2s ease;
}
.filter-sheet__close:hover {
  opacity: 1;
}

/* Wraps the scroll area so the fade + chevron can be absolutely positioned
   over the bottom edge without being clipped by the scroll container. */
.filter-sheet__body-wrap {
  position: relative;
  flex: 1 1 auto;
  min-height: 0;
  display: flex;
}

.filter-sheet__body {
  flex: 1 1 auto;
  overflow-y: auto;
  padding: 12px 20px 8px;
  -webkit-overflow-scrolling: touch;
  /* Visible scrollbar so users have a static "there's more" cue too */
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.25) transparent;
}
.filter-sheet__body::-webkit-scrollbar {
  width: 4px;
}
.filter-sheet__body::-webkit-scrollbar-track {
  background: transparent;
}
.filter-sheet__body::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.25);
  border-radius: 2px;
}

/* Bottom fade — signals that content continues past the visible area. */
.filter-sheet__fade {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 56px;
  pointer-events: none;
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.95) 0%,
    rgba(0, 0, 0, 0.6) 45%,
    rgba(0, 0, 0, 0) 100%
  );
  transition: opacity 0.25s ease;
}
.filter-sheet__fade.is-hidden {
  opacity: 0;
}

/* Bouncing chevron — only shown when overflow exists AND the user
   hasn't started scrolling yet. */
.filter-sheet__scroll-hint {
  position: absolute;
  left: 50%;
  bottom: 8px;
  transform: translateX(-50%);
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--main-color, #54ea62);
  pointer-events: none;
  animation: scroll-hint-bounce 1.6s ease-in-out infinite;
}

@keyframes scroll-hint-bounce {
  0%,
  100% {
    transform: translate(-50%, 0);
    opacity: 0.55;
  }
  50% {
    transform: translate(-50%, 6px);
    opacity: 1;
  }
}

.filter-sheet__group {
  padding: 14px 0;
  border-bottom: 0.3px solid rgba(255, 255, 255, 0.12);
}
.filter-sheet__group:last-child {
  border-bottom: none;
}

.filter-sheet__group-title {
  display: block;
  font-size: 12px;
  letter-spacing: 1.2px;
  text-transform: uppercase;
  color: var(--main-color, #54ea62);
  font-weight: 300;
  margin-bottom: 10px;
}

.filter-sheet__chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 10px;
}

.filter-sheet__chip {
  font-size: 13px;
  line-height: 1;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  font-weight: 300;
  padding: 9px 14px;
  border: 0.3px solid rgba(255, 255, 255, 0.25);
  color: rgba(255, 255, 255, 0.7);
  background: transparent;
  transition: color 0.2s ease, border-color 0.2s ease,
    background-color 0.2s ease;
}
.filter-sheet__chip:hover {
  color: #fff;
  border-color: rgba(255, 255, 255, 0.55);
}
.filter-sheet__chip.is-active {
  color: var(--main-color, #54ea62);
  border-color: var(--main-color, #54ea62);
  background: rgba(84, 234, 98, 0.08);
}

.filter-sheet__footer {
  display: flex;
  gap: 10px;
  padding: 14px 20px 18px;
  border-top: 0.3px solid var(--border-op-color, rgba(255, 255, 255, 0.5));
}

.filter-sheet__action {
  flex: 1 1 0;
  padding: 12px 16px;
  font-size: 13px;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  font-weight: 400;
  border-radius: 2px;
  transition: background-color 0.2s ease, color 0.2s ease, opacity 0.2s ease;
}

.filter-sheet__action--ghost {
  background: transparent;
  color: rgba(255, 255, 255, 0.7);
  border: 0.3px solid rgba(255, 255, 255, 0.35);
}
.filter-sheet__action--ghost:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.filter-sheet__action--primary {
  background: var(--main-color, #54ea62);
  color: #000;
  border: 0.3px solid var(--main-color, #54ea62);
}

/* Slide-up + fade */
.filter-sheet-enter-active,
.filter-sheet-leave-active {
  transition: opacity 0.25s ease;
}
.filter-sheet-enter-active .filter-sheet__panel,
.filter-sheet-leave-active .filter-sheet__panel {
  transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);
}
.filter-sheet-enter-from,
.filter-sheet-leave-to {
  opacity: 0;
}
.filter-sheet-enter-from .filter-sheet__panel,
.filter-sheet-leave-to .filter-sheet__panel {
  transform: translateY(100%);
}
</style>
