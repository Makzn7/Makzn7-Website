<!-- ContactSection -->
<template>
  <section
    ref="sectionRef"
    class="home-contact text-white"
    :style="`background-color: ${bgColor};`"
  >
    <div class="flex">
      <div
        class="w-full mx-auto grid grid-cols-1 gap-12 py-6 lg:py-16 px-6 lg:px-28"
      >
        <!-- Title -->
        <div class="flex justify-between items-center">
          <!-- Title -->
          <h2
            class="leading-none fade-in tracking-[-2.06px] text-nowrap"
            :style="`animation-delay: 0s; font-size: clamp(${Math.max(
              24,
              Math.round(57 * 0.35)
            )}px, ${(57 / 20).toFixed(1)}vw, ${57}px);`"
          >
            {{ $t("home.contactTitle") }}
          </h2>
          <!-- Options -->
          <div
            class="w-full flex gap-4 justify-end items-center"
            :style="`font-size: clamp(${Math.max(
              14,
              Math.round(18 * 0.35)
            )}px, ${(18 / 20).toFixed(1)}vw, ${18}px);`"
          >
            <button
              class="flex justify-start items-start gap-1 min-w-[20px]"
              id="toggle-lang"
              @click="toggleLocale"
              :class="locale === 'ar' ? 'font-en' : 'font-ar'"
            >
              <img
                src="/icons/general/Artboard2.svg"
                class="w-[20px] lg:w-[30px]"
              />
              <span
                class="text-[14px] sm:text-[16px] md:text-[20px] lg:text-[24px] ltr:leading-[1.2] rtl:leading-[1.2] ltr:lg:leading-[1]"
                >{{ $t("buttons.lang") }}</span
              >
            </button>
            <button
              v-if="showTheme"
              id="toggle-theme-mode"
              class="flex justify-start items-center gap-2 min-w-[20px]"
              @click="toggleTheme"
            >
              <img
                src="/icons/general/Artboard1.svg"
                class="w-[20px] lg:w-[30px]"
              />
            </button>
          </div>
        </div>

        <!-- Loading skeleton -->
        <div
          v-if="pending"
          class="h-48 animate-pulse rounded opacity-20 bg-white"
        />

        <div v-else>
          <!-- Desktop -->
          <div class="hidden lg:grid lg:grid-cols-3 gap-4 fade-in-left">
            <!-- Contact Info + Social Media -->
            <div class="flex flex-col gap-4 items-start justify-start">
              <div class="flex flex-col justify-between gap-8">
                <div class="flex flex-col">
                  <a
                    :href="`mailto:${settings?.email}`"
                    class="white-link-sm font-en rtl:text-right font-extralight"
                    :style="`font-size: clamp(${Math.max(
                      14,
                      Math.round(37 * 0.35)
                    )}px, ${(37 / 20).toFixed(1)}vw, ${37}px);`"
                    dir="ltr"
                  >
                    {{ settings?.email }}
                  </a>
                  <a
                    :href="`tel:${settings?.phone}`"
                    class="white-link-sm font-en rtl:text-right font-extralight text-nowrap"
                    :style="`font-size: clamp(${Math.max(
                      14,
                      Math.round(37 * 0.35)
                    )}px, ${(37 / 20).toFixed(1)}vw, ${37}px);`"
                    dir="auto"
                    data-keep-digits
                  >
                    ({{ settings?.phone }})
                  </a>
                </div>
              </div>
              <!-- Social Media -->
              <div class="w-full flex gap-4 justify-start items-start">
                <!-- Instagram -->
                <a
                  :href="settings?.social_links?.instagram"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="social-icon group transition-all duration-500 ease-in-out"
                  aria-label="Instagram"
                >
                  <img
                    src="/icons/general/instagram.svg"
                    class="w-100 p-1"
                    alt=""
                  />
                  <!-- <font-awesome-icon
                    icon="fa-brands fa-instagram"
                    style="width: 100%; height: 100%"
                  /> -->
                </a>
                <!-- LinkedIn -->
                <a
                  :href="settings?.social_links?.linkedin"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="social-icon group transition-all duration-500 ease-in-out"
                  aria-label="LinkedIn"
                >
                  <font-awesome-icon
                    icon="fa-brands fa-linkedin-in"
                    style="width: 100%; height: 100%"
                  />
                </a>
                <!-- Vimeo -->
                <a
                  :href="settings?.social_links?.vimeo"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="social-icon group transition-all duration-500 ease-in-out"
                  aria-label="Vimeo"
                >
                  <font-awesome-icon
                    icon="fa-brands fa-vimeo-v"
                    style="width: 100%; height: 100%"
                  />
                </a>

                <!-- YouTube -->
                <a
                  :href="settings?.social_links?.youtube"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="social-icon group transition-all duration-500 ease-in-out"
                  aria-label="YouTube"
                >
                  <font-awesome-icon
                    icon="fa-brands fa-youtube"
                    style="width: 100%; height: 100%"
                  />
                </a>
              </div>
            </div>
            <!-- Address -->
            <div>
              <p
                class="text-white ltr:font-extralight rtl:font-light"
                :style="`font-size: clamp(${Math.max(
                  14,
                  Math.round(37 * 0.35)
                )}px, ${(37 / 20).toFixed(1)}vw, ${37}px);`"
              >
                {{
                  locale === "ar" ? settings?.address_ar : settings?.address_en
                }}
              </p>
            </div>
            <!-- Privacy Policy + Year -->
            <div class="flex flex-col gap-1 justify-start items-end">
              <!-- Privacy Policy -->
              <div>
                <NuxtLinkLocale
                  to="/privacy-policy"
                  class="white-link-sm uppercase text-white ltr:font-extralight rtl:font-light"
                  :style="`font-size: clamp(${Math.max(
                    14,
                    Math.round(37 * 0.35)
                  )}px, ${(37 / 20).toFixed(1)}vw, ${37}px);`"
                  >{{ $t("buttons.privacyPolicy") }}</NuxtLinkLocale
                >
              </div>
              <!-- Year -->
              <div>
                <p
                  class="text-white ltr:font-extralight rtl:font-light leading-[1]"
                  :style="`font-size: clamp(${Math.max(
                    14,
                    Math.round(37 * 0.35)
                  )}px, ${(37 / 20).toFixed(1)}vw, ${37}px);`"
                >
                  {{ new Date().getFullYear() }}
                </p>
              </div>
            </div>
          </div>
          <!-- Desktop Options + Contact Info + Social Media -->

          <!-- Mobile -->
          <div
            class="grid grid-cols-5 lg:grid-cols-3 gap-8 items-end fade-in-left lg:hidden"
            style="animation-delay: 0.15s"
          >
            <!-- Contact Information List -->
            <div
              class="col-span-3 flex flex-col gap-4 font-extralight"
              :style="`font-size: clamp(${Math.max(
                14,
                Math.round(37 * 0.35)
              )}px, ${(37 / 20).toFixed(1)}vw, ${37}px);`"
            >
              <!-- Email & Phone and VAT -->
              <div class="flex flex-col justify-between gap-8">
                <div class="flex flex-col">
                  <a
                    :href="`mailto:${settings?.email}`"
                    class="white-link-sm font-en rtl:text-right"
                    dir="ltr"
                  >
                    {{ settings?.email }}
                  </a>
                  <a
                    :href="`tel:${settings?.phone}`"
                    class="white-link-sm font-en rtl:text-right text-nowrap"
                    dir="auto"
                    data-keep-digits
                  >
                    ({{ settings?.phone }})
                  </a>
                </div>
              </div>
              <!-- Address -->
              <div class="space-y-1 ltr:font-light rtl:font-normal">
                <p class="text-white">
                  {{
                    locale === "ar"
                      ? settings?.address_ar
                      : settings?.address_en
                  }}
                </p>
              </div>
            </div>
            <!-- Years -->
            <div class="col-span-2 flex flex-col justify-end items-end gap-2">
              <p
                class="text-white ltr:font-light rtl:font-normal leading-[1.2] w-full"
                :style="`font-size: clamp(${Math.max(
                  14,
                  Math.round(37 * 0.35)
                )}px, ${(37 / 20).toFixed(1)}vw, ${37}px);`"
              >
                {{ new Date().getFullYear() }}
              </p>
              <NuxtLinkLocale
                to="/privacy-policy"
                class="white-link uppercase text-white leading-[1.2] w-full"
                :style="`font-size: clamp(${Math.max(
                  14,
                  Math.round(37 * 0.35)
                )}px, ${(37 / 20).toFixed(1)}vw, ${37}px);`"
                >{{ $t("buttons.privacyPolicy") }}</NuxtLinkLocale
              >
            </div>
            <!-- Social Media Icons (Vertical Stack) -->
            <div class="col-span-5 grid grid-cols-2 gap-4 items-center">
              <!-- Social Media -->
              <div
                class="col-span-1 w-full flex flex-row gap-1 justify-between items-start"
              >
                <!-- Social Media Icons (Vertical Stack) -->
                <!-- Instagram -->
                <a
                  :href="settings?.social_links?.instagram"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="social-icon group transition-all duration-500 ease-in-out"
                  aria-label="Instagram"
                >
                  <font-awesome-icon
                    icon="fa-brands fa-instagram"
                    style="width: 100%; height: 100%"
                  />
                </a>

                <!-- Vimeo -->
                <a
                  :href="settings?.social_links?.vimeo"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="social-icon group transition-all duration-500 ease-in-out"
                  aria-label="Vimeo"
                >
                  <font-awesome-icon
                    icon="fa-brands fa-vimeo-v"
                    style="width: 100%; height: 100%"
                  />
                </a>

                <!-- LinkedIn -->
                <a
                  :href="settings?.social_links?.linkedin"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="social-icon group transition-all duration-500 ease-in-out"
                  aria-label="LinkedIn"
                >
                  <font-awesome-icon
                    icon="fa-brands fa-linkedin-in"
                    style="width: 100%; height: 100%"
                  />
                </a>

                <!-- X (Twitter) -->
                <a
                  :href="settings?.social_links?.twitter"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="social-icon group transition-all duration-500 ease-in-out"
                  aria-label="X (Twitter)"
                >
                  <font-awesome-icon
                    icon="fa-brands fa-x-twitter "
                    style="width: 100%; height: 100%"
                  />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useScrollAnimation } from "~/composables/useScrollAnimation";
import { useSettings } from "~/composables/useSettings";

const { data: settings, pending } = useSettings();

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
  // Mark the theme as an explicit user choice so the per-route default
  // (dark home / light elsewhere) stops overriding it and this choice
  // persists across every page from now on.
  localStorage.setItem("makzn7-theme-user-set", "1");
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
  width: 38px;
  height: 38px;
  cursor: pointer;
  color: #ffffff;
}
.social-icon:hover {
  color: var(--main-color);
}

.hand-icon-large svg,
.hand-icon-small svg {
  stroke-linecap: round;
  stroke-linejoin: round;
}

@media (max-width: 1024px) {
  .social-icon {
    width: 30px;
    height: 30px;
  }
}
</style>