<script setup lang="ts">
import HomeHero from "~/components/blocks/home/HomeHero.vue";
import HomeContact from "~/components/blocks/home/HomeContact.vue";
import HomeTeam from "~/components/blocks/home/HomeTeam.vue";

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
    <HomeContact />
    <HomeTeam />
  </div>
</template>