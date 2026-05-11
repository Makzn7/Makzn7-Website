<template>
  <div
    class="section-title w-full lg:border-s-[0.3px] lg:border-t-[0.3px] border-brand-text px-6 py-6 lg:px-8 lg:py-12"
    :style="`margin-inline-start: ${marginS}px;`"
  >
    <h2
      class="font-light lg:font-normal leading-[1.2] tracking-[0px]"
      :style="`font-size: clamp(34px, ${(titleS / 20).toFixed(
        1
      )}vw, ${titleS}px);`"
    >
      {{ title }}
    </h2>
  </div>
</template>
<script setup lang="ts">
const props = defineProps({
  marginS: { type: Number, default: 140 },
  titleS: { type: Number, default: 130 },
  title: { type: String, default: "" },
});
</script>
<style scoped>
@media (max-width: 768px) {
  .section-title {
    margin-inline-start: 0 !important;
  }
}
</style>