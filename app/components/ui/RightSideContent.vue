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
    <!-- <a
      href="https://m7prophouse.com"
      target="_blank"
      class="home-nav-link nav-hover [writing-mode:vertical-rl] cursor-none"
      >{{ $t("nav.prophouse") }}</a
    > -->
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
