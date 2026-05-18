<!-- ContactSection -->
<template>
  <section
    ref="sectionRef"
    class="home-contact text-white"
    :style="`background-color: ${bgColor};`"
  >
    <div class="flex">
      <!-- <div
        class="border-e-[0.3px]"
        :class="borderClasses"
        style="width: calc(var(--railW) + 3.5px)"
      ></div> -->
      <div
        class="w-full mx-auto grid grid-cols-1 gap-12 py-6 lg:py-16 px-6 lg:px-28"
      >
        <!-- Title -->
        <div class="flex flex-col justify-between items-start space-y-12">
          <!-- Title -->
          <h2
            class="font-light leading-none fade-in tracking-[-2.06px]"
            :style="`animation-delay: 0s; font-size: clamp(${Math.max(
              16,
              Math.round(103 * 0.35)
            )}px, ${(103 / 20).toFixed(1)}vw, ${103}px);`"
          >
            {{ $t("home.contactTitle") }}
          </h2>
        </div>

        <!-- Loading skeleton -->
        <div
          v-if="pending"
          class="h-48 animate-pulse rounded opacity-20 bg-white"
        />

        <div v-else>
          <!-- Desktop Options + Contact Info + Social Media -->

          <!-- Mobile -->
          <div
            class="grid grid-cols-5 lg:grid-cols-3 gap-16 lg:gap-16 fade-in-left"
            style="animation-delay: 0.15s"
          >
            <!-- Options -->
            <div class="flex flex-col justify-between gap-6">
              <div
                class="flex flex-col w-full gap-2 justify-start items-start"
                :style="`font-size: clamp(${Math.max(
                  14,
                  Math.round(31 * 0.35)
                )}px, ${(31 / 20).toFixed(1)}vw, ${31}px);`"
              >
                <button
                  v-if="showTheme"
                  id="toggle-theme-mode"
                  @click="toggleTheme"
                >
                  <img
                    src="/icons/general/Artboard1.svg"
                    class="w-[25px] lg:w-[35px]"
                  />
                </button>
                <button
                  class="flex justify-start items-center gap-2"
                  id="toggle-lang"
                  @click="toggleLocale"
                  :class="locale === 'ar' ? 'font-en' : 'font-ar'"
                >
                  <img
                    src="/icons/general/Artboard2.svg"
                    class="w-[25px] lg:w-[35px]"
                  />
                  <span
                    class="text-[14px] sm:text-[18px] md:text-[22px] lg:text-[26px] xl:text-[28px] 2xl:text-[31px] leading-[1.2] ltr:mb-[10px]"
                    >{{ $t("buttons.lang") }}</span
                  >
                </button>
              </div>
            </div>
            <!-- Contact Information List -->
            <div
              class="col-span-4 lg:col-span-2 grid grid-cols-2 gap-8 font-extralight"
              :style="`font-size: clamp(${Math.max(
                14,
                Math.round(37 * 0.35)
              )}px, ${(37 / 20).toFixed(1)}vw, ${37}px);`"
            >
              <!-- Email & Phone and VAT -->
              <div flex flex-col justify-between gap-8>
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
                    class="white-link-sm font-en rtl:text-right"
                    dir="ltr"
                  >
                    ({{ settings?.phone }})
                  </a>
                </div>
              </div>

              <!-- Address -->
              <div class="space-y-1">
                <p class="text-white">
                  {{
                    locale === "ar"
                      ? settings?.address_ar
                      : settings?.address_en
                  }}
                </p>
              </div>
            </div>

            <!-- Social Media Icons (Vertical Stack) -->
            <div
              class="col-span-5 lg:col-span-3 grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-12 items-center"
            >
              <!-- Years -->
              <div class="flex flex-col justify-start items-start gap-2">
                <p
                  class="text-white font-light leading-[1.2]"
                  :style="`font-size: clamp(${Math.max(
                    14,
                    Math.round(49 * 0.35)
                  )}px, ${(49 / 20).toFixed(1)}vw, ${49}px);`"
                >
                  {{ new Date().getFullYear() }}
                </p>
                <NuxtLink
                  to="/privacy-policy"
                  class="white-link uppercase text-white leading-[1.2]"
                  :style="`font-size: clamp(${Math.max(
                    14,
                    Math.round(42 * 0.35)
                  )}px, ${(42 / 20).toFixed(1)}vw, ${42}px);`"
                  >{{ $t("buttons.privacyPolicy") }}</NuxtLink
                >
              </div>
              <!-- Social Media -->
              <div
                class="lg:col-start-3 w-full flex flex-row gap-1 lg:gap-6 justify-between lg:justify-start items-start"
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
.social-icon:hover {
  color: var(--main-color);
}

.hand-icon-large svg,
.hand-icon-small svg {
  stroke-linecap: round;
  stroke-linejoin: round;
}

@media (max-width: 768px) {
  .social-icon {
    width: 30px;
    height: 30px;
  }
}
</style>