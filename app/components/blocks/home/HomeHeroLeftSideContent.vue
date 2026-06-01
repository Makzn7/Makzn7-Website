<!-- LeftSideContent -->
<template>
  <div
    class="nav-content flex flex-col flex-wrap justify-between ltr:items-end rtl:items-start h-full py-20 px-2"
  >
    <NuxtLink
      to="/contact"
      class="home-nav-link nav-hover [writing-mode:sideways-lr] cursor-none"
      >{{ $t("nav.contact") }}</NuxtLink
    >
    <NuxtLink
      to="/projects"
      class="home-nav-link nav-hover [writing-mode:sideways-lr] cursor-none"
      >{{ $t("nav.projects") }}</NuxtLink
    >
    <NuxtLink
      to="/about"
      class="home-nav-link nav-hover [writing-mode:sideways-lr] cursor-none"
      >{{ $t("nav.about") }}</NuxtLink
    >
  </div>
</template>