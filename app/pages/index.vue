<script setup lang="ts">
import HomeHero from "~/components/blocks/home/HomeHero.vue";
import HomeAbout from "~/components/blocks/home/HomeAbout.vue";
import ContactSection from "~/components/ui/ContactSection.vue";

const { data: homeData } = useHome();

const aboutData = computed(() => homeData.value?.data?.about ?? null);

const splashRef = ref<HTMLElement | null>(null);
const splashLogoRef = ref<HTMLElement | null>(null);
const splashCornerGlowRef = ref<HTMLElement | null>(null);

// الـ splash يظهر مرة واحدة فقط عند أول تحميل للموقع. useState يبقى محفوظًا طوال
// عمر التطبيق (يُعاد ضبطه فقط عند refresh كامل)، فالتنقل الداخلي ثم الرجوع
// للرئيسية لا يعيد تشغيله — وهذا يحل مشكلة ظهوره بحجم مختلف بعد route navigation.
const splashPlayed = useState<boolean>("home-splash-played", () => false);
const showSplash = ref(!splashPlayed.value);

// طبقات التحميل تتحكم بها فلاغات منفصلة بدل keyframe واحد، حتى تتزامن مع مراحل
// حركة الشعار المُدارة بالـ JS (انظر runSplash بالأسفل).
const bgHidden = ref(false);
const glowOn = ref(false);

const { scrollContainer, lockPageScroll, unlockPageScroll } =
  usePageScrollShell();

const { t } = useI18n();

useSeo({
  title: () => t("seo.homeTitle"),
  description: () => t("seo.homeDescription"),
});

// ══ حركة الـ Splash → شعار الهيدر (FLIP مبني على قياس فعلي) ══
// نحرّك شعار التحميل عبر Web Animations API على transforms رقمية (px) محسوبة من
// getBoundingClientRect، بدل CSS keyframes التي تعتمد على متغيّرات قد يعيد كل
// متصفح حسابها/استيفاءها بشكل مختلف (وهذا مصدر اختلاف Chrome/Safari). الشعار
// position:fixed فإحداثياته بالنسبة للـ viewport وليست لأي parent — وقد تحققنا
// أنه لا يوجد ancestor عليه transform/filter/perspective.
const DEBUG_SPLASH = false;

let headerLogo: HTMLElement | null = null;
// نسبة الشعار (height / width) من viewBox الأصل (113×50.6) — ثابت موثوق.
// لا نعتمد على naturalWidth/naturalHeight لأن Safari يرجعها 0 لـ SVG فيه viewBox
// فقط بلا width/height، فينتج حجم خاطئ. هذه القيمة تطابق aspect-ratio في الـ CSS.
const LOGO_ASPECT = 50.6 / 150;
const timers: ReturnType<typeof setTimeout>[] = [];
let p1Anim: Animation | null = null;
let p2Anim: Animation | null = null;

// مدد المراحل (ms) — تحافظ على نفس إيقاع الحركة الحالي تقريبًا
const P1_DURATION = 1250; // ظهور + نبضة عند المركز ثم انزلاق إلى الزاوية
const CORNER_HOLD = 150; // وقفة عند الزاوية مع توهج الدخان الأخضر
const P2_DURATION = 380; // الرجوع من الزاوية إلى موضع شعار الهيدر
const EASE = "cubic-bezier(0.25, 0.46, 0.45, 0.94)";

const nextFrame = () =>
  new Promise<void>((r) => requestAnimationFrame(() => r()));

function railToPx(
  rootStyles: CSSStyleDeclaration,
  varName: string,
  fallback: number,
  rootFontSize: number
) {
  const raw = rootStyles.getPropertyValue(varName).trim();
  const num = parseFloat(raw);
  if (Number.isNaN(num)) return fallback;
  return raw.endsWith("rem") ? num * rootFontSize : num;
}

// مركز شعار الهيدر بإحداثيات الـ viewport — يُقاس طازجًا قبل مرحلة الرجوع مباشرة.
// نستخدم rect.height الفعلي (محجوز بالـ aspect-ratio في CSS فهو ثابت ومتطابق بين
// المتصفحات)، ونرجع لاشتقاقه من العرض × النسبة فقط إن كان 0 احتياطيًا.
function headerCenter() {
  const r = headerLogo!.getBoundingClientRect();
  const h = r.height || r.width * LOGO_ASPECT;
  return { x: r.left + r.width / 2, y: r.top + h / 2 };
}

// مركز محطة الزاوية — من قياس الـ rail وأبعاد الشعار فقط (بلا أرقام سحرية).
function cornerCenter(w: number, h: number) {
  const rs = getComputedStyle(document.documentElement);
  const fs = parseFloat(rs.fontSize) || 16;
  const railW = railToPx(rs, "--railW", 60, fs);
  const railH = railToPx(rs, "--railH", 44, fs);
  const marginX = railW + w * 0.25;
  const marginY = railH + h * 0.5;
  const isRtl = document.documentElement.dir === "rtl";
  // RTL تعكس المحور الأفقي فقط: الزاوية العليا اليمنى بدل اليسرى
  const x = isRtl ? window.innerWidth - (marginX + w / 2) : marginX + w / 2;
  const y = marginY + h / 2;
  return { x, y };
}

// الشعار fixed عند (0,0)، فنحرّك مركزه إلى نقطة في الـ viewport عبر translate.
// transform-origin center + تطابق الحجم (بلا scale عند الأطراف) يجعل المحاذاة دقيقة.
function toCenter(cx: number, cy: number, w: number, h: number, scale = 1) {
  return `translate(${cx - w / 2}px, ${cy - h / 2}px) scale(${scale})`;
}

// هل نحن على شاشة موبايل؟ نستخدم matchMedia على نفس نقطة توقف lg (1024px) التي
// يبدّل عندها الهيدر شعارَه من صف جانبي إلى عمود متمركز أفقيًا (والـ rails تصغر).
// على الموبايل لا نريد انزلاق الشعار نحو الزاوية بل نحو مركز شعار الهيدر.
function isMobileViewport() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(max-width: 1023.98px)").matches
  );
}

// محطة نهاية المرحلة 1: على الديسكتوب زاوية علوية (السلوك الحالي كما هو تمامًا)،
// وعلى الموبايل مركز شعار الهيدر الفعلي (متمركز أفقيًا) فلا يوجد شدّ يسار/يمين —
// يصح في LTR و RTL معًا لأن المركز محايد الاتجاه، ومحسوب من العنصر الحقيقي.
function stationCenter(w: number, h: number) {
  return isMobileViewport() ? headerCenter() : cornerCenter(w, h);
}

function debugLog(label: string, w: number, h: number) {
  if (!DEBUG_SPLASH) return;
  // eslint-disable-next-line no-console
  console.log(`[SPLASH] ${label}`, {
    loaderRect: splashLogoRef.value?.getBoundingClientRect(),
    headerRect: headerLogo?.getBoundingClientRect(),
    cornerCenter: cornerCenter(w, h),
    viewport: { w: window.innerWidth, h: window.innerHeight },
    devicePixelRatio: window.devicePixelRatio,
    logoAspect: LOGO_ASPECT,
  });
}

// ══ حركة scroll خفيفة جدًا لتوهج الزاوية (splash-corner-glow) ══
// نفس مفهوم دوران الحلقة في صفحة التواصل: مرتبطة بالتمرير لا بأنيميشن لانهائي.
// التوهج عنصر radial-gradient متماثل دورانيًا (فالدوران وحده غير محسوس)، لذا نضيف
// إزاحة parallax لطيفة جدًا + دوران ضئيل. نكتبها عبر خصائص rotate/translate
// المستقلة فتتركّب فوق transform:scale القادم من keyframe cornerGlowAnim بلا
// إلغائه إطلاقًا (فلا تنكسر حركة الـ splash). التمرير native (window.scrollY).
let glowRafId: number | null = null;
let glowScrollHandler: (() => void) | null = null;
let lastGlowProgress = NaN;

function updateGlow() {
  glowRafId = null;
  const el = splashCornerGlowRef.value;
  if (!el) return; // أُزيل مع نهاية الـ splash → نتوقف
  const vh = window.innerHeight || 1;
  const progress = (window.scrollY || 0) / vh; // 0..n مع النزول
  if (
    Number.isNaN(lastGlowProgress) ||
    Math.abs(progress - lastGlowProgress) >= 0.001
  ) {
    lastGlowProgress = progress;
    // على الموبايل: التوهج متمركز أعلى المنتصف قرب مسار الشعار، فأي إزاحة نزولية
    // (parallax) تشدّه نحو موضع الشعار الأصلي في المنتصف. لذا نُلغي الـ parallax
    // على الموبايل ونبقيه ثابتًا — مساره الصاعد يأتي كليًا من keyframe الموبايل.
    if (isMobileViewport()) {
      el.style.rotate = "0deg";
      el.style.translate = "0 0px";
      return;
    }
    // الديسكتوب (التوهج من الزاوية): قيم صغيرة جدًا = إحساس مترف هادئ؛ النزول
    // يدفع باتجاه والصعود يعكسه طبيعيًا.
    el.style.rotate = `${(progress * 8).toFixed(2)}deg`;
    el.style.translate = `0 ${(progress * 10).toFixed(1)}px`;
  }
}

function scheduleGlow() {
  if (glowRafId === null) glowRafId = requestAnimationFrame(updateGlow);
}

function startGlowScroll() {
  if (prefersReducedMotion()) return; // نحترم تقليل الحركة
  glowScrollHandler = scheduleGlow;
  window.addEventListener("scroll", glowScrollHandler, { passive: true });
  scheduleGlow(); // ضبط الحالة الابتدائية حسب موضع التمرير الحالي
}

function stopGlowScroll() {
  if (glowScrollHandler) {
    window.removeEventListener("scroll", glowScrollHandler);
    glowScrollHandler = null;
  }
  if (glowRafId !== null) {
    cancelAnimationFrame(glowRafId);
    glowRafId = null;
  }
}

function finishSplash() {
  stopGlowScroll();
  if (headerLogo) headerLogo.style.visibility = "";
  showSplash.value = false;
}

async function runSplash() {
  const splashLogo = splashLogoRef.value as HTMLImageElement | null;
  if (!splashLogo) return finishSplash();

  // 1) ننتظر فك صورة الشعار حتى تكون جاهزة للرسم (لا نقرأ أبعادها الجوهرية)
  try {
    if (!splashLogo.complete) {
      await new Promise<void>((res) => {
        splashLogo.onload = () => res();
        splashLogo.onerror = () => res();
      });
    }
    if (splashLogo.decode) await splashLogo.decode().catch(() => {});
  } catch {
    /* تجاهل — الحجم لا يعتمد على نجاح الـ decode */
  }

  // 2) استقرار الـ layout: nextTick + إطارين على الأقل
  await nextTick();
  await nextFrame();
  await nextFrame();

  if (prefersReducedMotion()) return finishSplash();

  // 3) توحيد الحجم من قياس شعار الهيدر الفعلي (rect)، والارتفاع محجوز بالـ
  //    aspect-ratio في CSS فهو متطابق بين Safari و Chrome. لا نضبط style.height
  //    بالـ JS حتى لا نعتمد على naturalWidth/Height (يرجعها سفاري 0).
  const hRect = headerLogo!.getBoundingClientRect();
  const W = hRect.width;
  if (!W) return finishSplash();
  const H = hRect.height || W * LOGO_ASPECT;
  splashLogo.style.width = `${W}px`;

  const vC = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  // زاوية على الديسكتوب، ومركز شعار الهيدر على الموبايل (بلا شدّ للزاوية).
  const station = stationCenter(W, H);
  debugLog("phase1-start", W, H);

  // 4) المرحلة 1: ظهور + نبضة عند المركز ثم انزلاق إلى الزاوية
  await nextFrame();
  p1Anim = splashLogo.animate(
    [
      { offset: 0, transform: toCenter(vC.x, vC.y, W, H, 1), opacity: 0 },
      { offset: 0.18, transform: toCenter(vC.x, vC.y, W, H, 1), opacity: 1 },
      { offset: 0.3, transform: toCenter(vC.x, vC.y, W, H, 1.1), opacity: 1 },
      { offset: 0.42, transform: toCenter(vC.x, vC.y, W, H, 1), opacity: 1 },
      { offset: 0.52, transform: toCenter(vC.x, vC.y, W, H, 1), opacity: 1 },
      {
        offset: 1,
        transform: toCenter(station.x, station.y, W, H, 1),
        opacity: 1,
      },
    ],
    { duration: P1_DURATION, easing: EASE, fill: "forwards" }
  );

  // نخفي الخلفية أثناء الانزلاق حتى تظهر الصفحة خلف الشعار
  timers.push(setTimeout(() => (bgHidden.value = true), P1_DURATION * 0.52));

  await p1Anim.finished.catch(() => {});

  // 5) وقفة عند الزاوية مع توهج الدخان الأخضر
  glowOn.value = true;
  await new Promise<void>((r) => timers.push(setTimeout(r, CORNER_HOLD)));

  // 6) المرحلة 2: نعيد قياس شعار الهيدر طازجًا (بعد استقرار حركة ظهوره) ثم نرجع
  //    الشعار فوقه تمامًا — نفس الحجم وبلا scale فالمحاذاة دقيقة ولا "نزول".
  const target = headerCenter();
  debugLog("phase2-start", W, H);
  await nextFrame();
  p2Anim = splashLogo.animate(
    [
      { transform: toCenter(station.x, station.y, W, H, 1) },
      { transform: toCenter(target.x, target.y, W, H, 1) },
    ],
    { duration: P2_DURATION, easing: EASE, fill: "forwards" }
  );
  await p2Anim.finished.catch(() => {});

  debugLog("phase2-end", W, H);
  finishSplash();
}

onMounted(async () => {
  // عند الرجوع للرئيسية بعد تنقل داخلي: الـ splash سبق تشغيله → لا نعيده ولا
  // نلمس شعار الهيدر إطلاقًا (يبقى ظاهرًا بحجمه الطبيعي).
  if (!showSplash.value) return;
  // نُعلّم أنه تم التشغيل فورًا حتى لو خرج المستخدم أثناء الحركة ثم رجع.
  splashPlayed.value = true;

  await nextTick();
  headerLogo = document.getElementById("logo");
  // نخفي شعار الهيدر دون إخراجه من الـ layout (visibility لا display) ليبقى قابلاً
  // للقياس ومكانه محجوزًا/ثابتًا قبل وبعد اختفاء الـ splash.
  if (headerLogo) headerLogo.style.visibility = "hidden";
  // حركة scroll خفيفة للتوهج طوال حياة الـ splash (تُوقَف في finishSplash/unmount)
  startGlowScroll();
  runSplash();
});

onBeforeUnmount(() => {
  timers.forEach(clearTimeout);
  p1Anim?.cancel();
  p2Anim?.cancel();
  stopGlowScroll();
  if (headerLogo) headerLogo.style.visibility = "";
});
</script>

<template>
  <div>
    <!-- صفحة التحميل -->
    <div v-if="showSplash" ref="splashRef" class="splash-screen">
      <div
        class="splash-bg"
        :class="{ 'is-hidden': bgHidden }"
        aria-hidden="true"
      />
      <div
        ref="splashCornerGlowRef"
        class="splash-corner-glow"
        :class="{ 'glow-animate': glowOn }"
        aria-hidden="true"
      />
      <img
        ref="splashLogoRef"
        src="/logos/svg/logo_black.svg"
        alt="Makzn7"
        class="splash-logo dark:invert"
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
        <ContactSection
          border-classes="border-primary dark:border-brand-bg"
          :showTheme="true"
        />
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

/* خلفية التحميل كطبقة مستقلة تتلاشى أثناء انزلاق الشعار نحو الزاوية */
.splash-bg {
  position: absolute;
  inset: 0;
  background-color: var(--color-bg);
  opacity: 1;
  transition: opacity 0.9s ease;
}
.splash-bg.is-hidden {
  opacity: 0;
}

.splash-logo {
  /* position:fixed → الإحداثيات بالنسبة للـ viewport لا لأي parent.
     العرض والارتفاع يُضبطان بالبكسل من JS (عرض شعار الهيدر × نسبة الصورة)،
     فلا clamp/vw مختلف بين المتصفحات. الحركة كلها عبر Web Animations API. */
  position: fixed;
  top: 0;
  left: 0;
  /* نفس مصدر حجم شعار الهيدر — حجم صحيح فورًا بلا اعتماد على الحجم الجوهري للـ SVG.
     الـ JS يضبط نفس القيمة بالبكسل لاحقًا لحساب إحداثيات الحركة فقط. */
  width: var(--site-logo-width);
  /* نفس حجز الأبعاد كشعار الهيدر — يمنع وميض الحجم قبل فك صورة الـ SVG */
  aspect-ratio: 113 / 50.6;
  height: auto;
  display: block;
  object-fit: contain;
  opacity: 0;
  z-index: 2;
  /* مركز ثابت للـ transform حتى يتطابق سلوك Safari و Chrome */
  transform-origin: center center;
  will-change: transform, opacity;
  backface-visibility: hidden;
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

/* في RTL ينطلق التوهج/الدخان الأخضر من الزاوية العليا اليمنى بدل اليسرى */
:global(html[dir="rtl"] .splash-corner-glow) {
  left: auto;
  right: -45vmax;
}

/* على الشاشات الصغيرة (نفس نقطة توقف الشعار: يهبط للمركز لا للزاوية) نُركّز
   التوهج أعلى المنتصف بدل الزاوية، فيتوافق مع مسار الشعار المتمركز ولا يظهر
   على الأطراف. نستخدم left/margin (بلا transform) حتى لا نتعارض مع scale
   القادم من keyframe cornerGlowAnim. يسري على LTR و RTL معًا. */
@media (max-width: 1023.98px) {
  .splash-corner-glow,
  :global(html[dir="rtl"] .splash-corner-glow) {
    top: -45vmax;
    left: 50%;
    right: auto;
    margin-left: -45vmax; /* نصف العرض (90vmax) لتوسيط التوهج أفقيًا */
  }
}

/* يُفعّل عند وصول الشعار للزاوية (glowOn من JS) فيلعب التوهج كاملاً عندها */
.splash-corner-glow.glow-animate {
  animation: cornerGlowAnim 0.65s ease-in-out forwards;
}

@keyframes cornerGlowAnim {
  0% {
    opacity: 0;
    transform: scale(0.4);
  }
  /* توهج قصير وخافت عند وصول الشعار للزاوية */
  45% {
    opacity: 0.8;
    transform: scale(1);
  }
  100% {
    opacity: 0;
    transform: scale(1.1);
  }
}

/* على الموبايل التوهج متمركز أعلى المنتصف (لا زاوية جانبية). keyframe الديسكتوب
   يكبّر scale حول هذا المركز فيتمدّد نصفه السفلي نزولًا نحو موضع الشعار الأصلي في
   المنتصف ثم يختفي فجأة = إحساس "نزول ثم قفز". لذا نمنح الموبايل مساره الخاص:
   يصعد للأعلى فقط (translateY موجب→سالب) مع نفس نبضة الـ opacity، بلا شدّ للأسفل.
   نفس التصميم/الحجم/الـ blur/اللون تمامًا — المتغيّر هو مسار الحركة فقط.
   transform هنا مستقل عن translate/rotate القادمة من scroll (خاصية مختلفة). */
@media (max-width: 1023.98px) {
  .splash-corner-glow.glow-animate {
    animation: cornerGlowAnimMobile 0.65s ease-in-out forwards;
  }
}

@keyframes cornerGlowAnimMobile {
  0% {
    opacity: 0;
    transform: translateY(6vmax) scale(0.85);
  }
  45% {
    opacity: 0.8;
    transform: translateY(0) scale(1);
  }
  100% {
    opacity: 0;
    transform: translateY(-5vmax) scale(1.06);
  }
}

/* Reduced motion: نتخطى الحركة كليًا (runSplash يستدعي finishSplash مباشرة) */
@media (prefers-reduced-motion: reduce) {
  .splash-logo {
    opacity: 0;
    animation: none;
  }
  .splash-bg {
    transition: none;
  }
  .splash-corner-glow,
  .splash-corner-glow.glow-animate {
    animation: none;
    opacity: 0;
  }
}
</style>
