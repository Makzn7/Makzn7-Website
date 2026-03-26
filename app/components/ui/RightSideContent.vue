<!-- RightSideContent -->
<template>
  <div
    class="flex flex-col flex-wrap justify-between ltr:items-start rtl:items-end h-full py-20 px-2"
  >
    <a href="#" class="home-nav-link nav-hover [writing-mode:vertical-rl]">{{
      $t("nav.mansj")
    }}</a>
    <a href="#" class="home-nav-link nav-hover [writing-mode:vertical-rl]">{{
      $t("nav.manjra")
    }}</a>
    <a
      href="https://m7prophouse.com"
      target="_blank"
      class="home-nav-link nav-hover [writing-mode:vertical-rl]"
      >{{ $t("nav.prophouse") }}</a
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
