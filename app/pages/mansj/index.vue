<script setup lang="ts">
import ContactSection from "~/components/ui/ContactSection.vue";
import MansjHero from "~/components/blocks/mansj/MansjHero.vue";

const { scrollContainer, lockPageScroll, unlockPageScroll } =
  usePageScrollShell();
useGsapReveal();

const { t } = useI18n();
const { data: pageData } = usePage("mansj");

useSeo({
  title: () => pageData.value?.seoTitle || t("seo.mansjTitle"),
  description: () =>
    pageData.value?.seoDescription || t("seo.mansjDescription"),
  image: () => pageData.value?.ogImage,
});
</script>

<template>
  <div
    ref="scrollContainer"
    class="bg-[#0F2943]"
    style="--cursor-color: #ffffff"
    data-scroll-container
  >
    <section class="sticky top-0 z-[1]" id="hero-section">
      <MansjHero
        @lock-page-scroll="lockPageScroll"
        @unlock-page-scroll="unlockPageScroll"
      />
    </section>
    <section class="relative z-[2]" id="content-section" data-scroll-section>
      <ContactSection borderClasses="border-white-op50" />
    </section>
  </div>
</template>
