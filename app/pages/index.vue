<script setup lang="ts">
import HomeHero from "~/components/blocks/home/HomeHero.vue";
import HomeAbout from "~/components/blocks/home/HomeAbout.vue";
import ContactSection from "~/components/ui/ContactSection.vue";

const splashRef = ref<HTMLElement | null>(null);
const splashLogoRef = ref<HTMLElement | null>(null);
const showSplash = ref(true);
const splashAnimating = ref(false);

const { scrollContainer, lockPageScroll, unlockPageScroll } =
  usePageScrollShell();
useGsapReveal();

useHead({
  title: "Makzn7",
  meta: [
    {
      name: "description",
      content: "Makzn7 – production design & prop house.",
    },
  ],
});

onMounted(async () => {
  await nextTick();
  const targetLogo = document.getElementById("logo");
  const splashLogo = splashLogoRef.value;
  if (targetLogo && splashLogo) {
    const tr = targetLogo.getBoundingClientRect();
    const splashW = splashLogo.offsetWidth;
    const splashCx = window.innerWidth / 2;
    const splashCy = window.innerHeight / 2;
    const targetCx = tr.left + tr.width / 2;
    const targetCy = tr.top + tr.height / 2;
    const dx = targetCx - splashCx;
    const dy = targetCy - splashCy;
    const sc = tr.width / splashW;
    splashLogo.style.setProperty("--dx", `${dx}px`);
    splashLogo.style.setProperty("--dy", `${dy}px`);
    splashLogo.style.setProperty("--sc", `${sc}`);
  }

  splashAnimating.value = true;
  setTimeout(() => {
    showSplash.value = false;
  }, 3200);
});
</script>

<template>
  <!-- صفحة التحميل -->
  <div
    v-if="showSplash"
    ref="splashRef"
    class="splash-screen"
    :class="{ 'splash-fade-out': splashAnimating }"
  >
    <img
      ref="splashLogoRef"
      src="/logos/svg/logo_black.svg"
      alt="Makzn7"
      class="splash-logo dark:invert"
      :class="{ 'splash-animate': splashAnimating }"
    />
  </div>

  <div
    ref="scrollContainer"
    class="bg-brand-bg"
    data-scroll-container
  >
    <section class="sticky top-0 z-[1]" id="hero-section">
      <HomeHero
        @lock-page-scroll="lockPageScroll"
        @unlock-page-scroll="unlockPageScroll"
      />
    </section>
    <section class="relative z-[2]" id="content-section" data-scroll-section>
      <HomeAbout />
      <ContactSection />
    </section>
  </div>
</template>

<style scoped>
.splash-screen {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--color-bg);
}

.splash-logo {
  width: 280px;
  opacity: 0;
  transform: translate(0, 0) scale(0.5);
}

/* ══ أنيميشن الشعار ══ */
.splash-logo.splash-animate {
  animation: splashLogoAnim 2.9s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
}

@keyframes splashLogoAnim {
  /* ظهور مع تكبير */
  0% {
    opacity: 0;
    transform: translate(0, 0) scale(0.5);
  }
  20% {
    opacity: 1;
    transform: translate(0, 0) scale(1);
  }
  /* نبضة - تكبير */
  30% {
    opacity: 1;
    transform: translate(0, 0) scale(1.1);
  }
  /* نبضة - رجوع */
  40% {
    opacity: 1;
    transform: translate(0, 0) scale(1);
  }
  /* ثبات لحظي */
  50% {
    opacity: 1;
    transform: translate(0, 0) scale(1);
  }
  /* يتحرك ويصغر تدريجياً */
  100% {
    opacity: 1;
    transform: translate(var(--dx, -200px), var(--dy, -150px)) scale(var(--sc, 0.35));
  }
}

/* ══ اختفاء الخلفية ══ */
.splash-screen.splash-fade-out {
  animation: splashBgFade 3.2s ease forwards;
}

@keyframes splashBgFade {
  0%, 85% {
    opacity: 1;
    pointer-events: all;
  }
  100% {
    opacity: 0;
    pointer-events: none;
  }
}
</style>
