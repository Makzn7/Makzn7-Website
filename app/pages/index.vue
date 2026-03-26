<script setup lang="ts">
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HomeHero from "~/components/blocks/home/HomeHero.vue";
import HomeAbout from "~/components/blocks/home/HomeAbout.vue";
import ContactSection from "~/components/ui/ContactSection.vue";
const { locale } = useI18n();
const scrollContainer = ref<HTMLElement | null>(null);
const splashRef = ref<HTMLElement | null>(null);
const splashLogoRef = ref<HTMLElement | null>(null);
const showSplash = ref(true);
const splashAnimating = ref(false);
let scroll: any = null;

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
  gsap.registerPlugin(ScrollTrigger);

  // حساب موقع الشعار الأصلي وتعيين CSS variables
  await nextTick();
  const targetLogo = document.getElementById("logo");
  const splashLogo = splashLogoRef.value;
  if (targetLogo && splashLogo) {
    const tr = targetLogo.getBoundingClientRect();
    // offsetWidth يعطي العرض الحقيقي بدون تأثير transform
    const splashW = splashLogo.offsetWidth; // 280px
    const splashH = splashLogo.offsetHeight;
    // مركز الشعار في الـ splash (وسط الشاشة)
    const splashCx = window.innerWidth / 2;
    const splashCy = window.innerHeight / 2;
    // مركز الشعار الهدف
    const targetCx = tr.left + tr.width / 2;
    const targetCy = tr.top + tr.height / 2;
    const dx = targetCx - splashCx;
    const dy = targetCy - splashCy;
    const sc = tr.width / splashW;
    splashLogo.style.setProperty("--dx", `${dx}px`);
    splashLogo.style.setProperty("--dy", `${dy}px`);
    splashLogo.style.setProperty("--sc", `${sc}`);
  }

  // تشغيل الأنيميشن
  splashAnimating.value = true;

  // حذف شاشة التحميل بعد انتهاء الأنيميشن
  setTimeout(() => {
    showSplash.value = false;
  }, 3200);

  const { $LocomotiveScroll } = useNuxtApp();

  if (scrollContainer.value) {
    scroll = new $LocomotiveScroll({
      el: scrollContainer.value,
      smooth: true,
      lerp: 0.08,
      multiplier: 1,
      smartphone: {
        smooth: true,
      },
      tablet: {
        smooth: true,
      },
    });

    const lenis = scroll.lenisInstance;
    if (lenis) {
      lenis.on("scroll", ScrollTrigger.update);
      ScrollTrigger.addEventListener("refresh", () => lenis.resize?.());
    }
    ScrollTrigger.refresh();
  }

  const isRTL = locale.value === "ar";

  gsap.utils.toArray<HTMLElement>("#content-section .fade-in").forEach((el) => {
    gsap.from(el, {
      opacity: 0,
      y: 50,
      duration: 1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: el,
        start: "top 85%",
        toggleActions: "play none none reverse",
      },
    });
  });

  gsap.utils
    .toArray<HTMLElement>("#content-section .fade-in-left")
    .forEach((el) => {
      gsap.from(el, {
        opacity: 0,
        x: isRTL ? 60 : -60,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      });
    });

  gsap.utils
    .toArray<HTMLElement>("#content-section .fade-in-right")
    .forEach((el) => {
      gsap.from(el, {
        opacity: 0,
        x: isRTL ? -60 : 60,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      });
    });
});

onBeforeUnmount(() => {
  if (scroll) scroll.destroy();
  ScrollTrigger.getAll().forEach((t) => t.kill());
});

function lockPageScroll() {
  if (!scroll) return;
  scroll.stop();
}

function unlockPageScroll() {
  if (!scroll) return;
  scroll.start();
}
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
