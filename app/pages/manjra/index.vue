<script setup lang="ts">
import ManjraHero from "~/components/blocks/manjra/ManjraHero.vue";
import ContactSection from "~/components/ui/ContactSection.vue";

const { scrollContainer, lockPageScroll, unlockPageScroll } =
  usePageScrollShell();
useGsapReveal();

const { t } = useI18n();
const { data: pageData } = usePage("manjra");

useSeo({
  title: () => pageData.value?.seoTitle || t("seo.manjraTitle"),
  description: () =>
    pageData.value?.seoDescription || t("seo.manjraDescription"),
  image: () => pageData.value?.ogImage,
});
</script>

<template>
  <div
    ref="scrollContainer"
    class="bg-[var(--manjra-bg-color)] text-[var(--manjra-text-color)]"
    style="
      --cursor-color: var(--manjra-text-color);
      --primary-color: var(--manjra-text-color);
      --color-primary: var(--manjra-text-color);
      --color-border: var(--manjra-border-color, rgba(41, 43, 44, 0.7));
      --border-op-color: var(--manjra-border-color, rgba(41, 43, 44, 0.7));
    "
    data-scroll-container
  >
    <section class="sticky top-0 z-[1]" id="hero-section">
      <ManjraHero
        @lock-page-scroll="lockPageScroll"
        @unlock-page-scroll="unlockPageScroll"
      />
    </section>
    <section class="relative z-[2]" id="content-section" data-scroll-section>
      <ContactSection borderClasses="border-white-op50" />
    </section>
  </div>
</template>
