<script setup lang="ts">
import HomeHero2 from "~/components/blocks/home/HomeHero2.vue";
import HomeAbout from "~/components/blocks/home/HomeAbout.vue";
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
    <HomeHero2 />
    <HomeAbout />
    <HomeContact />
    <!-- <HomeTeam /> -->
  </div>
</template>