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

<style scoped>
.nav-hover {
  transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94),
    letter-spacing 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  transform-origin: center center;
}
.nav-hover:hover {
  transform: scale(1.15);
  letter-spacing: 2px;
}
</style>
