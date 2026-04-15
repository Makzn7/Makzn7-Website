<template>
  <div
    class="w-full border-s-[0.3px] border-t-[0.3px] border-brand-text px-8 py-12"
    :style="`margin-inline-start: ${marginS}px;`"
  >
    <h1
      class="leading-[1.2] tracking-[0px]"
      :style="`font-size: clamp(${Math.max(
        40,
        Math.round(titleS * 0.35)
      )}px, ${(titleS / 20).toFixed(1)}vw, ${titleS}px);`"
    >
      {{ title }}
    </h1>
  </div>
</template>
<script setup lang="ts">
const props = defineProps({
  marginS: { type: Number, default: 140 },
  titleS: { type: Number, default: 130 },
  title: { type: String, default: "" },
});
</script>