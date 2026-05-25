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
          <NuxtLink to="/">
            <img
              src="/logos/svg/logo_black.svg"
              width="100"
              alt="Makzn7"
              class="dark:invert"
            />
          </NuxtLink>
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
          class="contact-form-section w-full lg:border-s-[0.3px] border-y-[0.3px] border-white-op50 border-brand-text px-6 py-6 lg:px-8 lg:py-16"
          :style="`margin-inline-start: ${marginS}px; width: calc(100% - ${marginS}px);`"
        >
          <div
            class="w-full grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-1 items-center"
          >
            <!-- Text + Icon -->
            <div
              class="contact-left-side flex flex-col leading-[1.1]"
              :style="`font-size: clamp(${Math.max(
                18,
                Math.round(141 * 0.35)
              )}px, ${(141 / 20).toFixed(1)}vw, ${141}px);`"
            >
              <div
                class="grid grid-cols-2 rtl:grid-cols-4 rtl:lg:grid-cols-3 rtl:gap-4 items-end justify-start"
              >
                <div
                  class="rtl:order-2 rtl:col-span-2 ltr:text-left rtl:text-left rtl:lg:text-right flex flex-col"
                >
                  <h2>{{ $t("contact.leftText1") }}</h2>
                  <h2>{{ $t("contact.leftText2") }}</h2>
                </div>
                <div class="rtl:order-1 rtl:col-span-2 rtl:lg:col-span-1">
                  <img
                    src="/icons/svg/green/10-1.svg"
                    class="mb-4 hand-image"
                    alt=""
                  />
                </div>
              </div>
              <div class="rtl:grid rtl:lg:grid-cols-6">
                <div></div>
                <h2 class="rtl:text-end rtl:lg:col-span-4">
                  {{ $t("contact.leftText3") }}
                </h2>
                <div></div>
              </div>
            </div>
            <!-- Form -->
            <div class="contact-form mt-4 lg:mt-0">
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
          class="contact-form-section w-full lg:border-s-[0.3px] border-t-[0.3px] border-white-op50 border-brand-text"
          :style="`margin-inline-start: ${marginS}px; width: calc(100% - ${marginS}px);`"
        >
          <img
            src="/images/pages/contact/contact.jpg"
            alt="Contact Hero Image"
            class="w-full h-auto min-h-[8rem] object-cover"
          />
        </div>
      </section>
      <!-- Contact Info -->
      <section>
        <div
          class="contact-form-section w-full lg:border-s-[0.3px] border-t-[0.3px] border-white-op50 border-brand-text px-6 py-6 lg:px-8 lg:py-16"
          :style="`margin-inline-start: ${marginS}px; width: calc(100% - ${marginS}px);`"
        >
          <div class="w-full grid grid-cols-1 lg:grid-cols-2">
            <!-- Info -->
            <div class="flex lg:flex-col justify-between gap-4 lg:gap-8">
              <h3
                class="font-normal lg:font-bold rtl:font-light tracking-[0px] mb-4 lg:max-w-96"
                :style="`font-size: clamp(${Math.max(
                  14,
                  Math.round(35 * 0.35)
                )}px, ${(35 / 20).toFixed(1)}vw, ${35}px);`"
              >
                {{
                  locale === "ar" ? settings?.address_ar : settings?.address_en
                }}
              </h3>
              <!-- Email and Phone -->
              <div
                class="flex flex-col gap-2 lg:gap-0 font-light"
                :style="`font-size: clamp(${Math.max(
                  14,
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
              <!-- Location -->
              <a
                href="https://maps.app.goo.gl/rCWy5uqtztQDgnoe6"
                target="_blank"
                class="hidden white-link lg:flex items-center justify-start gap-1 lg:gap-2 uppercase tracking-tighter"
                :style="`font-size: clamp(${Math.max(
                  16,
                  Math.round(50 * 0.35)
                )}px, ${(50 / 20).toFixed(1)}vw, ${50}px);`"
              >
                <span>
                  {{ $t("contact.goToLocation") }}
                </span>
                <span
                  class="font-pixel mb-[5px] lg:mb-[10px] inline-block text-primary"
                  >-></span
                >
              </a>
            </div>
            <!-- Image & Button -->
            <div class="flex flex-col">
              <img
                src="/images/pages/contact/new_map.jpg"
                alt="Location Image"
                class="w-full h-auto object-cover rounded-sm mb-6 lg:mb-0 mt-4 lg:mt-0"
              />
              <!-- Location -->
              <a
                href="https://maps.app.goo.gl/rCWy5uqtztQDgnoe6"
                target="_blank"
                class="flex white-link lg:hidden items-center justify-center gap-1 lg:gap-2 uppercase tracking-tighter"
                :style="`font-size: clamp(${Math.max(
                  16,
                  Math.round(50 * 0.35)
                )}px, ${(50 / 20).toFixed(1)}vw, ${50}px);`"
              >
                <span>
                  {{ $t("contact.goToLocation") }}
                </span>
                <span
                  class="font-pixel mb-[5px] lg:mb-[10px] inline-block text-primary"
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
      class="content-item h-[4rem] md:h-[5rem] lg:h-[6rem] 2xl:h-[7rem]"
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
    mobileMarginTop?: number;
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
    mobileMarginTop: 4,
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
<style scoped>
.page-content {
  margin-top: var(--mt, 4rem);
}
.hand-image {
  width: 170px;
  height: auto;
  object-fit: cover;
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
  .hand-image {
    width: 120px;
  }
}
</style>