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
      to="#"
      class="home-nav-link nav-hover [writing-mode:vertical-rl] cursor-none"
      >{{ $t("nav.manjra") }}</NuxtLink
    >
    <a
      href="https://m7prophouse.com"
      target="_blank"
      class="home-nav-link nav-hover [writing-mode:vertical-rl] cursor-none"
      >{{ $t("nav.prophouse") }}</a
    >
  </div>
</template>