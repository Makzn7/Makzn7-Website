<!-- LeftSideContent -->
<template>
  <div class="nav-content nav-rail-content nav-rail-content--left">
    <NuxtLink
      to="/contact"
      class="home-nav-link nav-hover nav-rail-content__link nav-rail-content__link--left cursor-none"
      >{{ $t("nav.contact") }}</NuxtLink
    >
    <NuxtLink
      to="/projects"
      class="home-nav-link nav-hover nav-rail-content__link nav-rail-content__link--left cursor-none"
      >{{ $t("nav.projects") }}</NuxtLink
    >
    <NuxtLink
      to="/about"
      class="home-nav-link nav-hover nav-rail-content__link nav-rail-content__link--left cursor-none"
      >{{ $t("nav.about") }}</NuxtLink
    >
  </div>
</template>