<!-- ContactSection -->
<template>
  <section
    ref="sectionRef"
    class="home-contact text-white"
    :style="`background-color: ${bgColor};`"
  >
    <div class="flex">
      <div
        class="border-e-[0.3px]"
        :class="borderClasses"
        style="width: calc(var(--railW) + 3.5px)"
      ></div>
      <div class="w-full mx-auto grid grid-cols-1 gap-12 py-16 px-28">
        <!-- Title -->
        <div class="flex flex-col justify-between items-start space-y-12">
          <!-- Title -->
          <h2
            class="font-light leading-none fade-in tracking-[-2.06px]"
            :style="`animation-delay: 0s; font-size: clamp(${Math.max(
              16,
              Math.round(103 * 0.35)
            )}px, ${(103 / 15.36).toFixed(1)}vw, ${103}px);`"
          >
            {{ $t("home.contactTitle") }}
          </h2>
        </div>

        <!-- Options + Contact Info + Social Media -->
        <div
          class="grid grid-cols-1 md:grid-cols-6 gap-16 lg:gap-16 fade-in-left"
          style="animation-delay: 0.15s"
        >
          <!-- Options + Year -->
          <div class="col-span-2 flex flex-col justify-between gap-6">
            <div
              class="flex flex-col w-full gap-2 justify-start items-start"
              :style="`font-size: clamp(${Math.max(
                18,
                Math.round(31 * 0.35)
              )}px, ${(31 / 20).toFixed(1)}vw, ${31}px);`"
            >
              <button
                v-if="showTheme"
                id="toggle-theme-mode"
                @click="toggleTheme"
              >
                <img src="/icons/general/Artboard1.svg" width="30" />
              </button>
              <button
                class="flex justify-start items-center gap-2"
                id="toggle-lang"
                @click="toggleLocale"
                :class="locale === 'ar' ? 'font-en' : 'font-ar'"
              >
                <img src="/icons/general/Artboard2.svg" width="30" />
                <span
                  class="text-[14px] sm:text-[18px] md:text-[22px] lg:text-[26px] xl:text-[28px] 2xl:text-[31px] leading-[1.2] ltr:mb-[15px]"
                  >{{ $t("buttons.lang") }}</span
                >
              </button>
            </div>
            <div class="flex flex-col justify-start items-start gap-2">
              <NuxtLink
                to="/privacy-policy"
                class="white-link uppercase text-white leading-[1.2]"
                :style="`font-size: clamp(${Math.max(
                  18,
                  Math.round(42 * 0.35)
                )}px, ${(42 / 20).toFixed(1)}vw, ${42}px);`"
                >{{ $t("buttons.privacyPolicy") }}</NuxtLink
              >
              <p
                class="text-white font-light leading-[1.2]"
                :style="`font-size: clamp(${Math.max(
                  18,
                  Math.round(49 * 0.35)
                )}px, ${(49 / 20).toFixed(1)}vw, ${49}px);`"
              >
                {{ new Date().getFullYear() }}
              </p>
            </div>
          </div>
          <!-- Contact Information List -->
          <div
            class="col-span-3 flex flex-col justify-between gap-8 font-extralight"
            :style="`font-size: clamp(${Math.max(
              18,
              Math.round(37 * 0.35)
            )}px, ${(37 / 20).toFixed(1)}vw, ${37}px);`"
          >
            <!-- Email and Phone -->
            <div class="flex flex-col">
              <a
                href="mailto:{{ settings.email }}"
                class="white-link-sm font-en rtl:text-right"
                dir="ltr"
              >
                {{ settings.email }}
              </a>
              <a
                :href="`tel:${settings.phone}`"
                class="white-link-sm font-en rtl:text-right"
                dir="ltr"
              >
                ({{ settings.phone }})
              </a>
            </div>
            <!-- Address -->
            <div class="space-y-1">
              <p class="text-white">
                {{
                  locale === "ar" ? settings.address_ar : settings.address_en
                }}
              </p>
            </div>
            <!-- VAT -->
            <div>
              <p class="text-white font-en rtl:text-right" dir="ltr">
                {{ $t("contact.cr") }}: <bdi>{{ settings.cr_number }}</bdi>
              </p>
              <p class="text-white font-en rtl:text-right" dir="ltr">
                {{ $t("contact.vat") }}: <bdi>{{ settings.vat_number }}</bdi>
              </p>
            </div>
          </div>

          <!-- Social Media Icons (Vertical Stack) -->
          <div
            class="flex flex-row lg:flex-col gap-1 justify-between items-start"
          >
            <!-- Instagram -->
            <a
              :href="settings.social_links.instagram"
              target="_blank"
              rel="noopener noreferrer"
              class="social-icon group hover:!text-brand-primary transition-all duration-500 ease-in-out"
              aria-label="Instagram"
            >
              <font-awesome-icon
                icon="fa-brands fa-instagram"
                style="width: 40px; height: 40px"
              />
            </a>

            <!-- Vimeo -->
            <a
              :href="settings.social_links.vimeo"
              target="_blank"
              rel="noopener noreferrer"
              class="social-icon group hover:!text-brand-primary transition-all duration-500 ease-in-out"
              aria-label="Vimeo"
            >
              <font-awesome-icon
                icon="fa-brands fa-vimeo-v"
                style="width: 40px; height: 40px"
              />
            </a>

            <!-- LinkedIn -->
            <a
              :href="settings.social_links.linkedin"
              target="_blank"
              rel="noopener noreferrer"
              class="social-icon group hover:!text-brand-primary transition-all duration-500 ease-in-out"
              aria-label="LinkedIn"
            >
              <font-awesome-icon
                icon="fa-brands fa-linkedin-in"
                style="width: 40px; height: 40px"
              />
            </a>

            <!-- X (Twitter) -->
            <a
              :href="settings.social_links.twitter"
              target="_blank"
              rel="noopener noreferrer"
              class="social-icon group hover:!text-brand-primary transition-all duration-500 ease-in-out"
              aria-label="X (Twitter)"
            >
              <font-awesome-icon
                icon="fa-brands fa-x-twitter"
                style="width: 40px; height: 40px"
              />
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useScrollAnimation } from "~/composables/useScrollAnimation";
import { settings } from "~/mocks/settings";

const props = defineProps({
  bgColor: { type: String, default: "#000000" },
  showTheme: { type: Boolean, default: true },
  borderClasses: { type: String, default: "border-white" },
});

const sectionRef = ref(null);
useScrollAnimation(sectionRef);

const { locale, setLocale } = useI18n();
const colorMode = useColorMode();

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function toggleTheme() {
  colorMode.preference = colorMode.value === "dark" ? "light" : "dark";
  scrollToTop();
}

function toggleLocale() {
  setLocale(locale.value === "ar" ? "en" : "ar");
  scrollToTop();
}
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