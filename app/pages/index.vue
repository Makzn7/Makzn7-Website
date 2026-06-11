<script setup lang="ts">
import HomeHero from "~/components/blocks/home/HomeHero.vue";
import HomeAbout from "~/components/blocks/home/HomeAbout.vue";
import ContactSection from "~/components/ui/ContactSection.vue";

const { data: homeData } = useHome();

const aboutData = computed(() => homeData.value?.data?.about ?? null);

const splashRef = ref<HTMLElement | null>(null);
const splashLogoRef = ref<HTMLElement | null>(null);
const showSplash = ref(true);
const splashAnimating = ref(false);

const { scrollContainer, lockPageScroll, unlockPageScroll } =
  usePageScrollShell();

const { t } = useI18n();

useSeo({
  title: () => t("seo.homeTitle"),
  description: () => t("seo.homeDescription"),
});

let splashTimer: ReturnType<typeof setTimeout> | null = null;
let measureTimer: ReturnType<typeof setTimeout> | null = null;
let headerLogo: HTMLElement | null = null;

function applySplashTarget() {
  const splashLogo = splashLogoRef.value;
  if (!headerLogo || !splashLogo) return;
  const tr = headerLogo.getBoundingClientRect();
  const splashW = splashLogo.offsetWidth;
  const dx = tr.left + tr.width / 2 - window.innerWidth / 2;
  const dy = tr.top + tr.height / 2 - window.innerHeight / 2;
  const sc = tr.width / splashW;
  splashLogo.style.setProperty("--dx", `${dx}px`);
  splashLogo.style.setProperty("--dy", `${dy}px`);
  splashLogo.style.setProperty("--sc", `${sc}`);
}

onMounted(async () => {
  await nextTick();
  headerLogo = document.getElementById("logo");
  const splashLogo = splashLogoRef.value;
  if (headerLogo) {
    applySplashTarget();
    // نخفي شعار الصفحة حتى لا يظهر شعاران أثناء الانتقال
    headerLogo.style.visibility = "hidden";
  }

  // إزاحة الزاوية العليا اليسرى — المحطة الأولى قبل موضع شعار الصفحة
  if (splashLogo) {
    const cornerScale = 0.5;
    // المسافة من الزاوية تُحسب من نفس عرض/ارتفاع الـ rail (--railW / --railH)
    // مع زيادة خفيفة حتى لا يستقر الشعار فوق الـ rail بالضبط
    const rootStyles = getComputedStyle(document.documentElement);
    const rootFontSize = parseFloat(rootStyles.fontSize) || 16;
    const railToPx = (varName: string, fallback: number) => {
      const raw = rootStyles.getPropertyValue(varName).trim();
      const num = parseFloat(raw);
      if (Number.isNaN(num)) return fallback;
      return raw.endsWith("rem") ? num * rootFontSize : num;
    };
    const cornerExtra = 8;
    const cornerMarginX = railToPx("--railW", 60) + cornerExtra;
    const cornerMarginY = railToPx("--railH", 44) + cornerExtra;
    const splashW = splashLogo.offsetWidth;
    const splashH = splashLogo.offsetHeight || splashW * 0.35;
    const cdx = -(
      window.innerWidth / 2 -
      (splashW * cornerScale) / 2 -
      cornerMarginX
    );
    const cdy = -(
      window.innerHeight / 2 -
      (splashH * cornerScale) / 2 -
      cornerMarginY
    );
    // تعيين إزاحة الزاوية كمتغيرات CSS لاستخدامها في keyframes
    splashLogo.style.setProperty("--cdx", `${cdx}px`);
    splashLogo.style.setProperty("--cdy", `${cdy}px`);
  }

  splashAnimating.value = true;
  // إعادة قياس موضع شعار الصفحة قبل الخطوة الثانية مباشرة بعد استقرار التخطيط
  measureTimer = setTimeout(applySplashTarget, 2600);
  // عند وصول شعار التحميل لموضع شعار الصفحة: تسليم سلس في نفس الإطار
  splashTimer = setTimeout(() => {
    if (headerLogo) headerLogo.style.visibility = "";
    showSplash.value = false;
  }, 3600);
});

onBeforeUnmount(() => {
  if (splashTimer) clearTimeout(splashTimer);
  if (measureTimer) clearTimeout(measureTimer);
  if (headerLogo) headerLogo.style.visibility = "";
});
</script>

<template>
  <div>
    <!-- صفحة التحميل -->
    <div
      v-if="showSplash"
      ref="splashRef"
      class="splash-screen"
      :class="{ 'splash-fade-out': splashAnimating }"
    >
      <div class="splash-bg" aria-hidden="true" />
      <div
        class="splash-corner-glow"
        :class="{ 'glow-animate': splashAnimating }"
        aria-hidden="true"
      />
      <img
        ref="splashLogoRef"
        src="/logos/svg/logo_black.svg"
        alt="Makzn7"
        class="splash-logo dark:invert"
        :class="{ 'splash-animate': splashAnimating }"
      />
    </div>

    <div ref="scrollContainer" class="bg-brand-bg" data-scroll-container>
      <section class="relative z-[1]" id="hero-section">
        <HomeHero
          @lock-page-scroll="lockPageScroll"
          @unlock-page-scroll="unlockPageScroll"
          :homeData="homeData"
        />
      </section>
      <section class="relative z-[2]" id="content-section" data-scroll-section>
        <HomeAbout :aboutData="aboutData" />
        <ContactSection border-classes="border-primary" />
      </section>
    </div>
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
}

/* خلفية التحميل كطبقة مستقلة حتى تتلاشى بالتوازي مع حركة الشعار */
.splash-bg {
  position: absolute;
  inset: 0;
  background-color: var(--color-bg);
}

.splash-logo {
  width: 280px;
  opacity: 0;
  transform: translate(0, 0) scale(0.5);
}

/* ══ أنيميشن الشعار ══ */
.splash-logo.splash-animate {
  position: relative;
  z-index: 1;
  animation: splashLogoAnim 2.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
}

@keyframes splashLogoAnim {
  /* ظهور مع تكبير */
  0% {
    opacity: 0;
    transform: translate(0, 0) scale(0.5);
  }
  16% {
    opacity: 1;
    transform: translate(0, 0) scale(1);
  }
  /* نبضة - تكبير */
  24% {
    opacity: 1;
    transform: translate(0, 0) scale(1.1);
  }
  /* نبضة - رجوع */
  32% {
    opacity: 1;
    transform: translate(0, 0) scale(1);
  }
  /* ثبات لحظي */
  40% {
    opacity: 1;
    transform: translate(0, 0) scale(1);
  }
  /* الخطوة الأولى: ينزلق إلى أقصى الزاوية العليا اليسرى */
  68% {
    opacity: 1;
    transform: translate(var(--cdx, -40vw), var(--cdy, -40vh)) scale(0.5);
  }
  /* وقفة قصيرة عند الزاوية مع توهج الدخان الأخضر */
  82% {
    opacity: 1;
    transform: translate(var(--cdx, -40vw), var(--cdy, -40vh)) scale(0.5);
  }
  /* الخطوة الثانية: انتقال خفيف من الزاوية إلى موضع شعار الصفحة */
  100% {
    opacity: 1;
    transform: translate(var(--dx, -200px), var(--dy, -150px))
      scale(var(--sc, 0.35));
  }
}

/* ══ توهج/دخان أخضر من الزاوية العليا اليسرى ══ */
.splash-corner-glow {
  position: absolute;
  top: -45vmax;
  left: -45vmax;
  width: 90vmax;
  height: 90vmax;
  pointer-events: none;
  opacity: 0;
  transform: scale(0.4);
  background: radial-gradient(
      circle at center,
      rgba(84, 234, 98, 0.28) 0%,
      rgba(84, 234, 98, 0.14) 25%,
      rgba(84, 234, 98, 0.05) 45%,
      transparent 65%
    ),
    radial-gradient(
      circle at center,
      rgba(84, 234, 98, 0.18) 0%,
      transparent 35%
    );
  will-change: opacity, transform;
}

.splash-corner-glow.glow-animate {
  animation: cornerGlowAnim 2.6s ease-in-out forwards;
}

@keyframes cornerGlowAnim {
  0%,
  64% {
    opacity: 0;
    transform: scale(0.4);
  }
  /* توهج قصير وخافت عند وصول الشعار للزاوية */
  78% {
    opacity: 0.8;
    transform: scale(1);
  }
  100% {
    opacity: 0;
    transform: scale(1.1);
  }
}

/* ══ اختفاء الخلفية بالتوازي مع الخطوة الأولى نحو الزاوية ══ */
.splash-screen.splash-fade-out .splash-bg {
  animation: splashBgFade 3.6s ease forwards;
}

@keyframes splashBgFade {
  0%,
  40% {
    opacity: 1;
  }
  68%,
  100% {
    opacity: 0;
  }
}

/* Reduced motion: show the logo statically, skip the morph + fade */
@media (prefers-reduced-motion: reduce) {
  .splash-logo,
  .splash-logo.splash-animate {
    opacity: 1;
    transform: none;
    animation: none;
  }
  .splash-screen.splash-fade-out .splash-bg {
    animation: none;
  }
  .splash-corner-glow,
  .splash-corner-glow.glow-animate {
    animation: none;
    opacity: 0;
  }
}
</style>
