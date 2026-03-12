<!-- HomeContact -->
<template>
  <section ref="sectionRef" class="home-contact bg-black text-white">
    <div class="flex">
      <div
        class="border-e-[0.3px] dark-border"
        style="width: calc(var(--railW) + 3.5px)"
      ></div>
      <div class="w-full mx-auto grid grid-cols-1 gap-12 py-16 px-28">
        <!-- Title -->
        <div class="flex flex-col justify-between items-start space-y-12">
          <!-- Title -->
          <h2
            class="text-[38px] sm:text-[50px] md:text-[65px] lg:text-[80px] xl:text-[90px] 2xl:text-[103px] font-medium uppercase leading-none fade-in"
            style="animation-delay: 0s"
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
          <div class="col-span-3 flex flex-col justify-between gap-6">
            <div class="flex flex-col w-full gap-2 justify-start items-start">
              <button id="toggle-theme-mode" @click="toggleTheme">
                <img src="/icons/general/Artboard1.svg" width="30" />
              </button>
              <button
                class="flex justify-start items-center gap-2"
                id="toggle-lang"
                @click="toggleLocale"
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
                class="white-link uppercase text-white text-[18px] sm:text-[24px] md:text-[30px] lg:text-[36px] xl:text-[39px] 2xl:text-[42px] leading-[1.2]"
                >{{ $t("buttons.privacyPolicy") }}</NuxtLink
              >
              <p
                class="text-white font-light text-[20px] sm:text-[28px] md:text-[35px] lg:text-[42px] xl:text-[45px] 2xl:text-[49px] leading-[1.2]"
              >
                {{ new Date().getFullYear() }}
              </p>
            </div>
          </div>
          <!-- Contact Information List -->
          <div class="col-span-2 text-lg flex flex-col justify-between gap-8">
            <!-- Email and Phone -->
            <div class="flex flex-col font-light">
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
              <p class="text-white font-light">
                {{
                  locale === "ar" ? settings.address_ar : settings.address_en
                }}
              </p>
            </div>
            <!-- VAT -->
            <div>
              <p class="text-white font-light font-en rtl:text-right" dir="ltr">
                {{ $t("contact.cr") }}: <bdi>{{ settings.cr_number }}</bdi>
              </p>
              <p class="text-white font-light font-en rtl:text-right" dir="ltr">
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
                style="width: 30px; height: 30px"
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
                style="width: 30px; height: 30px"
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
                style="width: 30px; height: 30px"
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
                style="width: 30px; height: 30px"
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