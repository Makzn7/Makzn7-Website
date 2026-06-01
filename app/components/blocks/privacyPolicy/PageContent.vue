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
        class="w-full border-b-[0.3px] border-white-op50 border-brand-text h-[90px]"
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
      <!-- Details -->
      <SectionTitle
        :title="$t('privacyPolicy.title')"
        :marginS="marginS"
        :titleS="titleS"
        class="border-white-op50"
      />
      <div
        :class="clampRight ? 'lg:pe-[var(--railW)]' : 'w-full'"
        class="section-body lg:border-s-[0.3px] border-t-[0.3px] border-white-op50 border-brand-text px-6 lg:px-8 py-8 lg:py-14 flex flex-col gap-8 lg:gap-12"
        :style="`margin-inline-start: ${marginS}px;`"
      >
        <p
          v-if="intro"
          class="font-light max-w-[80ch]"
          :style="`animation-delay: 0.1s; font-size: clamp(${Math.max(
            14,
            Math.round(descSize * 0.4)
          )}px, ${(descSize / 22).toFixed(1)}vw, ${Math.round(
            descSize * 0.9
          )}px);`"
        >
          {{ intro }}
        </p>
        <div
          v-for="(paragraph, pIndex) in paragraphs"
          :key="pIndex"
          class="flex flex-col gap-3 lg:gap-4"
          :style="`animation-delay: ${0.15 * (pIndex + 1)}s;`"
        >
          <h3
            class="font-light leading-[1.2] tracking-[-0.01em]"
            :style="`font-size: clamp(${Math.max(
              20,
              Math.round(descSize * 0.7)
            )}px, ${(descSize / 18).toFixed(1)}vw, ${Math.round(
              descSize * 1.4
            )}px);`"
          >
            {{ paragraph.title }}
          </h3>
          <p
            class="font-light max-w-[80ch] leading-[1.55]"
            :style="`font-size: clamp(${Math.max(
              14,
              Math.round(descSize * 0.4)
            )}px, ${(descSize / 22).toFixed(1)}vw, ${Math.round(
              descSize * 0.9
            )}px);`"
          >
            {{ paragraph.content }}
          </p>
        </div>
        <p
          v-if="lastUpdated"
          class="italic mt-2"
          :style="`animation-delay: ${
            0.15 * ((paragraphs?.length || 0) + 1)
          }s; font-size: clamp(12px, 1vw, 16px);`"
        >
          {{ lastUpdated }}
        </p>
      </div>
    </div>

    <!-- spacer أسفل عشان الأرض ما تبقى فارغة في النهاية -->
    <div
      class="content-item h-[2rem] md:h-[3rem] lg:h-[4rem] 2xl:h-[5rem]"
    ></div>
  </div>
</template>
<script setup lang="ts">
import SectionTitle from "../../ui/SectionTitle.vue";

const { tm, rt, t } = useI18n();

const paragraphs = computed(() => {
  const list = tm("privacyPolicy.sections") as Array<{
    title: string;
    content: string;
  }>;
  return Array.isArray(list)
    ? list.map((p) => ({
        title: rt(p.title),
        content: rt(p.content),
      }))
    : [];
});

const intro = computed(() => {
  const value = t("privacyPolicy.intro");
  return value === "privacyPolicy.intro" ? "" : value;
});

const lastUpdated = computed(() =>
  t("privacyPolicy.lastUpdated", { date: t("privacyPolicy.lastUpdatedDate") })
);
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
    clampRight?: boolean;
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
    clampRight: false,
  }
);
</script>
<style scoped>
.page-content {
  margin-top: var(--mt, 4rem);
}

@media (max-width: 1024px) {
  .page-content {
    margin-top: var(--mt-mobile, var(--mt, 4rem));
  }
  .pc-project-px {
    padding-right: 2rem;
    padding-left: 2rem;
  }
}
</style>