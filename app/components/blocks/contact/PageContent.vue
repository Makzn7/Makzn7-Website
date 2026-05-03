<template>
  <div class="relative" :style="`margin-top: ${marginTop}rem;`">
    <!-- content -->
    <div class="flex flex-col w-full min-h-screen text-white">
      <!--  -->
      <div
        class="w-full border-b-[0.3px] border-white-op50 border-brand-text h-[90px]"
      >
        <div
          class="border-e-[0.3px] border-white-op50 h-full"
          :style="`width: ${marginS}px;`"
        ></div>
      </div>
      <!-- Content -->
      <!-- Form Section -->
      <section>
        <div
          class="w-full border-s-[0.3px] border-t-[0.3px] border-white-op50 border-brand-text px-8 py-16"
          :style="`margin-inline-start: ${marginS}px; width: calc(100% - ${marginS}px);`"
        >
          <div class="w-full grid grid-cols-1 lg:grid-cols-2 items-center">
            <!-- Text + Icon -->
            <div
              class="contact-left-side flex flex-col leading-[1.1]"
              :style="`font-size: clamp(${Math.max(
                80,
                Math.round(141 * 0.35)
              )}px, ${(141 / 20).toFixed(1)}vw, ${141}px);`"
            >
              <div class="grid grid-cols-2 items-end justify-start">
                <div class="text-left flex flex-col">
                  <h2>{{ $t("contact.leftText1") }}</h2>
                  <h2>{{ $t("contact.leftText2") }}</h2>
                </div>
                <div>
                  <img
                    src="/icons/svg/green/10-1.svg"
                    width="170"
                    class="mb-4"
                    alt=""
                  />
                </div>
              </div>
              <div>
                <h2>{{ $t("contact.leftText3") }}</h2>
              </div>
            </div>
            <!-- Form -->
            <div class="contact-form">
              <ContactForm :marginS="marginS" />
            </div>
          </div>
        </div>
      </section>
      <!-- Image Section -->
      <section>
        <SectionTitle
          :title="$t('contact.contactSectionTitle')"
          :marginS="marginS"
          :titleS="titleS"
          class="border-white-op50"
        />
        <div
          class="w-full border-s-[0.3px] border-t-[0.3px] border-white-op50 border-brand-text"
          :style="`margin-inline-start: ${marginS}px; width: calc(100% - ${marginS}px);`"
        >
          <img
            src="/images/pages/contact/contact.jpg"
            alt="Contact Hero Image"
            class="w-full h-auto object-cover"
          />
        </div>
      </section>
      <!-- Contact Info -->
      <section>
        <div
          class="w-full border-s-[0.3px] border-t-[0.3px] border-white-op50 border-brand-text px-8 py-16"
          :style="`margin-inline-start: ${marginS}px; width: calc(100% - ${marginS}px);`"
        >
          <div class="w-full grid grid-cols-1 lg:grid-cols-2">
            <!-- Info -->
            <div class="flex flex-col gap-8">
              <h3
                class="font-bold tracking-[0px] mb-4 lg:max-w-96"
                :style="`font-size: clamp(${Math.max(
                  18,
                  Math.round(35 * 0.35)
                )}px, ${(35 / 20).toFixed(1)}vw, ${35}px);`"
              >
                {{
                  locale === "ar" ? settings?.address_ar : settings?.address_en
                }}
              </h3>
              <!-- Email and Phone -->
              <div
                class="flex flex-col font-light"
                :style="`font-size: clamp(${Math.max(
                  18,
                  Math.round(35 * 0.35)
                )}px, ${(35 / 20).toFixed(1)}vw, ${35}px);`"
              >
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
            <!-- Image & Button -->
            <div class="flex flex-col justify-between">
              <img
                src="/images/pages/contact/map.jpg"
                alt="Location Image"
                class="w-full h-auto object-cover mb-8"
              />
              <a
                href="https://maps.app.goo.gl/rCWy5uqtztQDgnoe6"
                target="_blank"
                class="white-link flex items-center justify-end gap-4 uppercase tracking-tighter"
                :style="`font-size: clamp(${Math.max(
                  16,
                  Math.round(50 * 0.35)
                )}px, ${(50 / 15.36).toFixed(1)}vw, ${50}px);`"
              >
                <span>
                  {{ $t("contact.goToLocation") }}
                </span>
                <span class="font-pixel mb-[20px] inline-block text-primary"
                  >-></span
                >
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
    <!-- spacer أسفل عشان الأرض ما تبقى فارغة في النهاية -->
    <div
      class="content-item h-[2rem] md:h-[3rem] lg:h-[4rem] 2xl:h-[5rem]"
    ></div>
  </div>
</template>
<script setup lang="ts">
import SectionTitle from "../../ui/SectionTitle.vue";
import ContactForm from "./ContactForm.vue";

const { data: settings, pending } = useSettings();

const props = withDefaults(
  defineProps<{
    marginTop?: number;
    marginS?: number;
    px?: number;
    imageW?: number;
    titleS?: number;
    descSize?: number;

    py?: number;
    marginB?: number;
  }>(),
  {
    marginTop: 4,
    marginS: 140,
    px: 1,
    imageW: 100,
    titleS: 110,
    descSize: 30,
    py: 4,
    marginB: 2,
  }
);

const { locale } = useI18n();
</script>
