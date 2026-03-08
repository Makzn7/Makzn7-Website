<!-- HomeTeam -->
<template>
  <section
    ref="sectionRef"
    class="home-team bg-black text-white py-16 px-6 border-t-[1px] border-white"
  >
    <div class="max-w-7xl mx-auto">
      <!-- Section Title -->
      <h2 class="text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-medium uppercase mb-16 fade-in">
        {{ $t("team.title") }}
      </h2>

      <!-- Team Grid -->
      <div
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
      >
        <div
          v-for="(member, index) in team"
          :key="member.id"
          class="team-card group cursor-pointer fade-in"
          :style="{ animationDelay: (0.1 + index * 0.08) + 's' }"
        >
          <!-- Photo -->
          <div class="aspect-square overflow-hidden mb-4 bg-gray-100">
            <img
              :src="member.photo"
              :alt="member.name"
              class="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
            />
          </div>

          <!-- Name -->
          <h3 class="font-light mb-1">
            {{ member.name }}
          </h3>

          <!-- Title/Role -->
          <p class="font-medium text-sm">
            {{ member.title }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from "vue";
import { useScrollAnimation } from "~/composables/useScrollAnimation";
import { team } from "~/mocks/team";

const { $locale } = useNuxtApp();

const sectionRef = ref(null);
useScrollAnimation(sectionRef);
</script>

<style scoped>
.team-card {
  transition: transform 0.3s ease;
}

.team-card:hover {
  transform: translateY(-4px);
}
</style>