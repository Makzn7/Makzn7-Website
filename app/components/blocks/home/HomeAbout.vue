<!-- HomeAbout -->
<template>
  <section
    ref="sectionRef"
    class="home-contact bg-black text-white border-b-[0.3px] border-primary"
  >
    <div class="flex">
      <div
        class="border-e-[0.3px] border-primary"
        style="width: calc(var(--railW) + 3.5px)"
      ></div>
      <div
        class="w-full mx-auto grid grid-cols-1 gap-12 py-6 lg:py-16 px-6 lg:px-28"
      >
        <!-- Title -->
        <div class="flex flex-col justify-between items-start space-y-12">
          <h2
            class="font-light leading-none tracking-[-2.06px] fade-in"
            :style="`font-size: clamp(${Math.max(
              16,
              Math.round(103 * 0.35)
            )}px, ${(103 / 15.36).toFixed(1)}vw, ${103}px);`"
          >
            {{ $t("home.aboutTitle") }}
          </h2>
        </div>

        <!-- Content -->
        <div class="ms-6 lg:ms-40 lg:me-8 flex flex-col gap-16">
          <!-- Description — appears after discoverMore -->
          <div
            class="font-light leading-[1.2] lg:tracking-[-1.44px] rtl:tracking-normal rtl:leading-[1.8] fade-in-left"
            :style="`animation-delay: 0.25s; font-size: clamp(${Math.max(
              16,
              Math.round(37 * 0.35)
            )}px, ${(37 / 15.36).toFixed(1)}vw, ${37}px);`"
            v-html="
              locale === 'ar'
                ? aboutData?.description_ar
                : aboutData?.description_en
            "
          ></div>
          <!-- discoverMore — appears earlier (delay 0.1s) -->
          <NuxtLink
            to="/about"
            class="white-link flex items-center gap-3 lg:gap-6 uppercase text-white leading-[1.2] tracking-tighter ms-auto fade-in-right"
            :style="`animation-delay: 0.1s; font-size: clamp(${Math.max(
              24,
              Math.round(57 * 0.35)
            )}px, ${(57 / 15.36).toFixed(1)}vw, ${57}px);`"
          >
            <span>
              {{ $t("buttons.discoverMore") }}
            </span>
            <span
              class="font-pixel mb-[8px] lg:mb-[20px] inline-block text-brand-primary"
              >-></span
            >
          </NuxtLink>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useScrollAnimation } from "~/composables/useScrollAnimation";

const props = defineProps<{
  aboutData: any; // Replace 'any' with the actual type if available
}>();

const { locale } = useI18n();

const sectionRef = ref(null);
useScrollAnimation(sectionRef);
</script>

<style scoped>
.social-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  cursor: pointer;
  color: #ffffff;
}

.hand-icon-large svg,
.hand-icon-small svg {
  stroke-linecap: round;
  stroke-linejoin: round;
}
</style>
