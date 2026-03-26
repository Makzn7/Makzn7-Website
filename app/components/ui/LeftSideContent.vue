<!-- LeftSideContent -->
<template>
  <div
    class="flex flex-col flex-wrap justify-between ltr:items-end rtl:items-start h-full py-20 px-2"
  >
    <NuxtLink
      to="/#"
      class="home-nav-link nav-hover [writing-mode:sideways-lr]"
      >{{ $t("nav.contact") }}</NuxtLink
    >
    <NuxtLink
      to="/projects"
      class="home-nav-link nav-hover [writing-mode:sideways-lr]"
      >{{ $t("nav.projects") }}</NuxtLink
    >
    <NuxtLink
      to="/about"
      class="home-nav-link nav-hover [writing-mode:sideways-lr]"
      >{{ $t("nav.about") }}</NuxtLink
    >
  </div>
</template>

