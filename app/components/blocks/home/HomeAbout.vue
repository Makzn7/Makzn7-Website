<!-- HomeAbout -->
<template>
  <section
    ref="sectionRef"
    class="home-contact bg-black text-white border-b-[0.3px] border-white"
  >
    <div class="flex">
      <div
        class="border-e-[0.3px] border-white"
        style="width: calc(var(--railW) + 3.5px)"
      ></div>
      <div class="w-full mx-auto grid grid-cols-1 gap-12 py-16 px-28">
        <!-- Title -->
        <div class="flex flex-col justify-between items-start space-y-12">
          <h2
            class="text-[38px] sm:text-[50px] md:text-[65px] lg:text-[80px] xl:text-[90px] 2xl:text-[103px] font-medium uppercase leading-none fade-in"
          >
            {{ $t("home.aboutTitle") }}
          </h2>
        </div>

        <!-- Content -->
        <div class="ms-40 me-8 flex flex-col gap-16">
          <!-- Description — appears after discoverMore -->
          <p
            class="font-light text-[16px] sm:text-[20px] md:text-[26px] lg:text-[30px] xl:text-[33px] 2xl:text-[37px] leading-[1.2] tracking-[-0.59px] rtl:tracking-normal rtl:leading-[1.8] fade-in-left"
            style="animation-delay: 0.25s"
          >
            {{ $t("home.aboutDescription") }}
          </p>
          <!-- discoverMore — appears earlier (delay 0.1s) -->
          <NuxtLink
            to="/about"
            class="white-link flex items-center gap-6 uppercase text-white text-[24px] sm:text-[32px] md:text-[40px] lg:text-[48px] xl:text-[52px] 2xl:text-[57px] leading-[1.2] ms-auto fade-in-right"
            style="animation-delay: 0.1s"
          >
            <span>
              {{ $t("buttons.discoverMore") }}
            </span>
            <span class="font-pixel mb-[20px] inline-block">-></span>
          </NuxtLink>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from "vue";
import { useScrollAnimation } from "~/composables/useScrollAnimation";

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
