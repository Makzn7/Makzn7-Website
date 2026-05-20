<!-- RightSideContent -->
<template>
  <div
    class="flex flex-col flex-wrap justify-between ltr:items-start rtl:items-end h-full py-20 px-2"
  >
    <NuxtLink
      to="/mansj"
      class="home-nav-link nav-hover [writing-mode:vertical-rl] cursor-none"
      >{{ $t("nav.mansj") }}</NuxtLink
    >
    <NuxtLink
      to="/manjra"
      class="home-nav-link nav-hover [writing-mode:vertical-rl] cursor-none"
      >{{ $t("nav.manjra") }}</NuxtLink
    >
    <NuxtLink
      to="/prophouse"
      class="home-nav-link nav-hover [writing-mode:vertical-rl] cursor-none"
      >{{ $t("nav.prophouse") }}</NuxtLink
    >
  </div>
</template>