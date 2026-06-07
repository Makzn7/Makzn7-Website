<!-- RightSideContent -->
<template>
  <div class="nav-content nav-rail-content nav-rail-content--right">
    <NuxtLinkLocale
      to="/mansj"
      class="home-nav-link nav-hover nav-rail-content__link nav-rail-content__link--right cursor-none"
      >{{ $t("nav.mansj") }}</NuxtLinkLocale
    >
    <NuxtLinkLocale
      to="/manjra"
      class="home-nav-link nav-hover nav-rail-content__link nav-rail-content__link--right cursor-none"
      >{{ $t("nav.manjra") }}</NuxtLinkLocale
    >
    <NuxtLinkLocale
      to="/prophouse"
      class="home-nav-link nav-hover nav-rail-content__link nav-rail-content__link--right cursor-none"
      >{{ $t("nav.prophouse") }}</NuxtLinkLocale
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
