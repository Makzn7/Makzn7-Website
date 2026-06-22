<template>
  <div class="relative group">
    <NuxtLinkLocale :to="link">
      <img
        :src="imageSrc"
        :alt="title"
        class="w-full h-auto filter grayscale block"
      />
      <div
        class="absolute inset-0 hidden group-hover:flex items-center justify-center px-8 py-4"
        :style="`background-color: ${bgColor}; opacity: 0.6;`"
      ></div>
      <div
        class="absolute inset-0 hidden group-hover:flex items-center justify-center px-8 py-4 bg-transparent"
      >
        <span
          :class="`font-bold`"
          :style="`font-size: clamp(${Math.max(
            18,
            Math.round(100 * 0.35)
          )}px, ${(100 / 20).toFixed(1)}vw, ${100}px); color: ${textColor};`"
        >
          {{ title }}
        </span>
      </div>
    </NuxtLinkLocale>
  </div>
</template>
<script setup>
defineProps({
  link: {
    type: String,
    required: true,
  },
  imageSrc: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  bgColor: {
    type: String,
    default: "transparent",
  },
  textColor: {
    type: String,
    default: "#FFFFFF",
  },
});
</script>