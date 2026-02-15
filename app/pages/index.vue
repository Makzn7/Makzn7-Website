<script setup lang="ts">
import HomeHero from "~/components/blocks/home/HomeHero.vue";

useHead({
  title: "Makzn7",
  meta: [
    {
      name: "description",
      content: "Makzn7 – production design & prop house.",
    },
  ],
});
</script>

<template>
  <div>
    <HomeHero />
    <!-- <HomeContact />
    <HomeTeam :team="[]" /> -->
    <!-- <CustomCursor /> -->
  </div>
</template>