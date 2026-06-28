<template>
  <div
    class="page-content relative"
    :style="{
      '--mt': marginTop + 'rem',
      '--mt-mobile': (props.mobileMarginTop ?? props.marginTop) + 'rem',
    }"
  >
    <!-- content -->
    <div class="flex flex-col w-full min-h-screen text-white">
      <!--  -->
      <div
        class="w-full lg:border-b-[0.3px] border-white-op50 border-brand-text h-[90px]"
      >
        <div
          class="flex logo-image p-4 w-full lg:hidden justify-center items-center"
        >
          <NuxtLinkLocale to="/">
            <img
              src="/logos/svg/logo_black.svg"
              width="100"
              alt="Makzn7"
              class="dark:invert"
            />
          </NuxtLinkLocale>
        </div>
        <div
          class="lg:border-e-[0.3px] border-white-op50 h-full"
          :style="`width: ${marginS}px;`"
        ></div>
      </div>
      <!-- Content -->
      <!-- Form Section -->
      <section>
        <div
          class="contact-form-section w-full lg:border-s-[0.3px] border-y-[0.3px] border-white-op50 border-brand-text px-6 py-6 lg:px-8 lg:py-12"
          :style="`margin-inline-start: ${marginS}px; width: calc(100% - ${marginS}px);`"
        >
          <div
            class="w-full grid grid-cols-1 lg:grid-cols-5 gap-4 lg:gap-1 items-center justify-center"
          >
            <!-- Form -->
            <div
              class="lg:col-span-3 order-2 lg:order-1 contact-form mt-4 lg:mt-0 w-full"
            >
              <ContactForm :marginS="marginS" :canSend="canSend" />
            </div>
            <!-- Text + Icon -->
            <div
              class="lg:col-span-2 order-1 lg:order-2 h-full w-full flex justify-center items-center"
            >
              <div class="relative flex justify-center items-center">
                <img
                  src="/images/pages/contact/hand.svg"
                  class="hand-image"
                  alt=""
                />
                <img
                  ref="textImageRef"
                  :src="`/images/pages/contact/${
                    locale === 'ar' ? 'text-ar' : 'text-en'
                  }.svg`"
                  class="text-image"
                  id="contact-text-image"
                  alt=""
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      <!-- Info Section -->
      <section>
        <div
          class="info-section w-full grid grid-cols-7 lg:grid-cols-9 border-s-[0.3px] border-white-op50 border-brand-text lg:h-[100px] overflow-y-hidden"
          :style="`margin-inline-start: ${marginS}px; width: calc(100% - ${marginS}px);`"
        >
          <!--  -->
          <div
            class="col-span-4 lg:col-span-3 w-full h-full flex justify-center items-center py-4 px-6 font-light border-e-[0.3px] border-white-op50 border-brand-text text-center"
            :style="`font-size: clamp(${Math.max(
              14,
              Math.round(51 * 0.35)
            )}px, ${(51 / 20).toFixed(1)}vw, ${51}px);`"
          >
            <h4 class="text-nowrap">{{ $t("contact.reachOut") }}</h4>
          </div>
          <!--  -->
          <div
            class="col-span-3 lg:col-span-2 w-full h-full flex justify-center items-center py-4 px-6 font-light border-e-[0.3px] border-white-op50 border-brand-text text-center"
            :style="`font-size: clamp(${Math.max(
              12,
              Math.round(25 * 0.35)
            )}px, ${(25 / 20).toFixed(1)}vw, ${25}px);`"
          >
            <a
              :href="`mailto:${settings?.email}`"
              class="white-link-sm font-en rtl:text-right lg:text-nowrap"
              dir="ltr"
              target="_blank"
              data-keep-digits
            >
              {{ settings?.email }}
            </a>
          </div>
          <!--  -->
          <div
            class="order-7 lg:order-6 col-span-3 lg:col-span-2 w-full h-full flex justify-center items-center py-4 px-6 font-light border-e-[0.3px] border-t-[0.3px] lg:border-t-0 border-white-op50 border-brand-text text-center"
            :style="`font-size: clamp(${Math.max(
              12,
              Math.round(25 * 0.35)
            )}px, ${(25 / 20).toFixed(1)}vw, ${25}px);`"
          >
            <a
              :href="`tel:${settings?.phone}`"
              class="white-link-sm font-en rtl:text-right text-nowrap"
              dir="auto"
              target="_blank"
              data-keep-digits
            >
              ({{ settings?.phone }})
            </a>
          </div>
          <!--  -->
          <div
            class="lg:order-8 col-span-2 lg:col-span-1 w-full h-full flex justify-center items-center py-4 px-6 font-light border-e-[0.3px] border-t-[0.3px] lg:border-t-0 border-white-op50 border-brand-text text-center"
          >
            <a
              href="https://www.instagram.com/makzn7/"
              target="_blank"
              class="social-icon group transition-all duration-500 ease-in-out white-link-sm font-en rtl:text-right"
              dir="ltr"
            >
              <img
                src="/icons/general/instagram.svg"
                class="w-100 p-1"
                alt=""
              />
            </a>
          </div>
          <!--  -->
          <div
            class="lg:order-9 col-span-2 lg:col-span-1 w-full h-full flex justify-center items-center py-4 px-6 font-light border-e-[0.3px] border-t-[0.3px] lg:border-t-0 border-white-op50 border-brand-text text-center"
          >
            <a
              href="https://www.instagram.com/makzn7/"
              target="_blank"
              class="social-icon group transition-all duration-500 ease-in-out white-link-sm font-en rtl:text-right"
              dir="ltr"
            >
              <font-awesome-icon
                icon="fa-brands fa-linkedin-in"
                style="width: 100%; height: 100%"
              />
            </a>
          </div>
        </div>
      </section>
      <!-- Info Section mobile -->

      <!-- Image and address -->
      <section>
        <div
          class="contact-form-section w-full lg:border-s-[0.3px] border-t-[0.3px] border-white-op50 border-brand-text"
          :style="`margin-inline-start: ${marginS}px; width: calc(100% - ${marginS}px);`"
        >
          <div class="w-full grid grid-cols-1 lg:grid-cols-2">
            <!-- Image & Button -->
            <div class="order-2 lg:order-1 flex flex-col">
              <img
                src="/images/pages/contact/map3.png"
                alt="Location Image"
                class="w-full h-auto object-cover"
              />
              <!-- Location -->
              <a
                href="https://maps.app.goo.gl/rCWy5uqtztQDgnoe6"
                target="_blank"
                class="flex lg:hidden white-link items-center justify-center gap-1 lg:gap-3 uppercase tracking-tighter my-4"
                :style="`font-size: clamp(${Math.max(
                  16,
                  Math.round(50 * 0.35)
                )}px, ${(50 / 20).toFixed(1)}vw, ${50}px);`"
              >
                <span>
                  {{ $t("contact.goToLocation") }}
                </span>
                <img
                  src="/icons/svg/green/14.svg"
                  class="w-3.5 h-3.5 rtl:rotate-180"
                />
              </a>
            </div>
            <!-- Info -->
            <div
              class="order-1 lg:order-2 flex lg:flex-col justify-between gap-4 lg:gap-8 px-4 lg:px-6 py-4 lg:py-12"
            >
              <h3
                class="font-normal lg:ltr:font-bold tracking-[0px] lg:mb-4 lg:max-w-96"
                :style="`font-size: clamp(${Math.max(
                  14,
                  Math.round(35 * 0.35)
                )}px, ${(35 / 20).toFixed(1)}vw, ${35}px);`"
              >
                {{
                  locale === "ar" ? settings?.address_ar : settings?.address_en
                }}
              </h3>
              <!-- Location -->
              <a
                href="https://maps.app.goo.gl/rCWy5uqtztQDgnoe6"
                target="_blank"
                class="hidden lg:flex white-link items-center justify-start gap-1 lg:gap-3 uppercase tracking-tighter"
                :style="`font-size: clamp(${Math.max(
                  16,
                  Math.round(50 * 0.35)
                )}px, ${(50 / 20).toFixed(1)}vw, ${50}px);`"
              >
                <span>
                  {{ $t("contact.goToLocation") }}
                </span>
                <img
                  src="/icons/svg/green/14.svg"
                  class="w-6 h-6 rtl:rotate-180"
                />
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
    <!-- spacer أسفل عشان الأرض ما تبقى فارغة في النهاية -->
    <div
      class="content-item h-[4rem] md:h-[5rem] lg:h-[6rem] 2xl:h-[7rem]"
    ></div>
  </div>
</template>
<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from "vue";
import SectionTitle from "../../ui/SectionTitle.vue";
import ContactForm from "./ContactForm2.vue";

const { data: settings, pending } = useSettings();

const props = withDefaults(
  defineProps<{
    marginTop?: number;
    mobileMarginTop?: number;
    marginS?: number;
    px?: number;
    imageW?: number;
    titleS?: number;
    descSize?: number;

    py?: number;
    marginB?: number;
    canSend?: boolean;
  }>(),
  {
    marginTop: 4,
    mobileMarginTop: 4,
    marginS: 140,
    px: 1,
    imageW: 100,
    titleS: 110,
    descSize: 30,
    py: 4,
    marginB: 2,
    canSend: true,
  }
);

const { locale } = useI18n();

/*
  دوران الحلقة النصية (contact-text-image) مرتبط بالتمرير:
  - يُشتق الدوران من موضع العنصر الحقيقي داخل الـ viewport، فيعمل سواء
    كان التمرير داخليًا للهيرو (translate3d على الجدار) أو native للصفحة.
  - النزول يدوّر باتجاه، والصعود يعيده بالاتجاه المعاكس طبيعيًا.
  - ناعم بلا اهتزاز: يتبع الموضع المُنعَّم أصلًا للهيرو، ويُحدَّث داخل rAF
    ويُكتب transform: rotate() فقط (بلا إعادة تخطيط/تغيير للموضع أو الحجم).
  - rAF يعمل فقط حين يكون العنصر ظاهرًا (IntersectionObserver) حفاظًا على الأداء.
  - يحترم prefers-reduced-motion فيُعطَّل تمامًا.
*/
const textImageRef = ref<HTMLElement | null>(null);
// دورة كاملة لكل ارتفاع شاشة من التمرير — حركة تدريجية هادئة.
const ROTATION_PER_VIEWPORT = 360;

let rafId: number | null = null;
let io: IntersectionObserver | null = null;
let lastRotation = NaN;

function updateRotation() {
  rafId = null;
  const el = textImageRef.value;
  if (!el) return;

  const vh = window.innerHeight || 1;
  const rect = el.getBoundingClientRect();
  const centerRatio = (rect.top + rect.height / 2) / vh;
  // أسفل الشاشة (centerRatio ~ 1) → 0°، وكلما صعد العنصر يزداد الدوران.
  const rotation = (1 - centerRatio) * ROTATION_PER_VIEWPORT;

  if (Math.abs(rotation - lastRotation) >= 0.05 || Number.isNaN(lastRotation)) {
    lastRotation = rotation;
    el.style.transform = `rotate(${rotation.toFixed(2)}deg)`;
  }
  scheduleUpdate();
}

function scheduleUpdate() {
  if (rafId === null) rafId = requestAnimationFrame(updateRotation);
}

function stopLoop() {
  if (rafId !== null) {
    cancelAnimationFrame(rafId);
    rafId = null;
  }
}

onMounted(() => {
  if (prefersReducedMotion()) return;
  const el = textImageRef.value;
  if (!el) return;

  if ("IntersectionObserver" in window) {
    io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) scheduleUpdate();
        else stopLoop();
      },
      { threshold: 0 }
    );
    io.observe(el);
  } else {
    scheduleUpdate();
  }
});

onBeforeUnmount(() => {
  stopLoop();
  io?.disconnect();
  io = null;
  const el = textImageRef.value;
  if (el) el.style.transform = "";
});
</script>
<style scoped>
.page-content {
  margin-top: var(--mt, 4rem);
}
.hand-image {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 120px;
  height: auto;
  object-fit: cover;
}
.text-image {
  width: 100%;
  height: auto;
  object-fit: cover;
}

.social-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  cursor: pointer;
  color: #ffffff;
}
.social-icon:hover {
  color: var(--main-color);
}

@media (max-width: 1024px) {
  .page-content {
    margin-top: var(--mt-mobile, var(--mt, 4rem));
  }
  .pc-project-px {
    padding-right: 2rem;
    padding-left: 2rem;
  }
  .contact-form-section {
    margin-inline-start: 0px !important;
    width: 100% !important;
  }
  .info-section {
    margin-inline-start: 0px !important;
    width: 100% !important;
  }
  .hand-image {
    width: 70px;
  }
  .text-image {
    width: 70%;
  }
}
</style>