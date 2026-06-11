<script setup lang="ts">
import ContactSection from "~/components/ui/ContactSection.vue";
import MansjHero from "~/components/blocks/mansj/MansjHero.vue";

const { scrollContainer, lockPageScroll, unlockPageScroll } =
  usePageScrollShell();
useGsapReveal();

const { t } = useI18n();
const { data: pageData, error } = usePage("mansj");

usePageSeo({
  page: () => pageData.value,
  title: () => t("seo.mansjTitle"),
  description: () => t("seo.mansjDescription"),
});
</script>

<template>
  <div
    ref="scrollContainer"
    class="bg-[#0F2943]"
    style="--cursor-color: #ffffff"
    data-scroll-container
  >
    <section class="relative z-[1]" id="hero-section">
      <MansjHero
        @lock-page-scroll="lockPageScroll"
        @unlock-page-scroll="unlockPageScroll"
        :data="pageData"
        :error="error"
      />
    </section>
    <section class="relative z-[2]" id="content-section" data-scroll-section>
      <ContactSection borderClasses="border-white-op50" />
    </section>
  </div>
</template>
