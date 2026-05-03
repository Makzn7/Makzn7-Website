<template>
  <div
    class="w-full border-b-[0.3px] border-white-op50 border-brand-text pe-[var(--railW)]"
    :style="`padding-inline-start: ${marginS}px;`"
  >
    <!-- Loading skeleton -->
    <div
      v-if="loading"
      class="flex items-start gap-8 px-4 py-4 border-s-[0.3px] border-white-op50"
    >
      <div v-for="i in 3" :key="i" class="flex flex-col gap-2">
        <div class="h-2.5 w-16 rounded bg-white/10 animate-pulse" />
        <div v-for="j in 4" :key="j" class="h-2.5 w-20 rounded bg-white/5 animate-pulse" />
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

    <!-- Filters -->
    <div
      v-else
      class="flex justify-between items-start px-4 py-4 border-s-[0.3px] border-white-op50"
    >
      <template v-for="(group, groupIndex) in groupedFilters" :key="groupIndex">
        <div
          v-for="(subCol, subIndex) in splitGroup(group.items)"
          :key="`${groupIndex}-${subIndex}`"
          class="flex flex-col gap-[5px] min-w-[100px] pe-6"
        >
          <span
            v-if="subIndex === 0"
            class="font-light text-[14px] uppercase tracking-none text-brand-text/30 mb-0.5 whitespace-nowrap"
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
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

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

defineEmits<{
  "toggle-filter": [filter: Filter];
}>();

const MAX_ROWS = 6;

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
</script>
