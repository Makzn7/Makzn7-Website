<!-- LeftSideContent -->
<template>
  <div class="nav-content nav-rail-content nav-rail-content--left">
    <NuxtLinkLocale
      to="/contact"
      class="home-nav-link nav-hover nav-rail-content__link nav-rail-content__link--left cursor-none"
      >{{ $t("nav.contact") }}</NuxtLinkLocale
    >
    <NuxtLinkLocale
      to="/projects"
      class="home-nav-link nav-hover nav-rail-content__link nav-rail-content__link--left cursor-none"
      >{{ $t("nav.projects") }}</NuxtLinkLocale
    >
    <NuxtLinkLocale
      to="/about"
      class="home-nav-link nav-hover nav-rail-content__link nav-rail-content__link--left cursor-none"
      >{{ $t("nav.about") }}</NuxtLinkLocale
    >
  </div>
</template>