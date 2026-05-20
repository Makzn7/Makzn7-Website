<!-- PageContentLoader -->
<!--
  Shown inside a Hero's center-part while the page data is still being
  fetched from the server. Once the data arrives the Hero swaps this out
  for <PageContent>, which then plays its heroCenterReveal entrance.
  Design: brand logo + animated progress bar. The logo adapts to the
  colour mode (dark:invert); the bar track follows the page theme.
-->
<template>
  <div class="page-content-loader" role="status" aria-label="Loading">
    <div class="page-content-loader__box">
      <img
        src="/logos/svg/logo_black.svg"
        alt=""
        class="page-content-loader__logo dark:invert"
      />
      <span class="page-content-loader__bar">
        <span class="page-content-loader__bar-fill" />
      </span>
    </div>
  </div>
</template>

<style scoped>
.page-content-loader {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 70vh;
}
.page-content-loader__box {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 18px;
}
.page-content-loader__logo {
  width: 116px;
  height: auto;
  animation: pageContentLoaderPulse 1.5s ease-in-out infinite;
}
.page-content-loader__bar {
  position: relative;
  width: 116px;
  height: 2px;
  overflow: hidden;
  background-color: var(--color-border, rgba(128, 128, 128, 0.25));
}
.page-content-loader__bar-fill {
  position: absolute;
  inset: 0 auto 0 0;
  width: 40%;
  background-color: #54ea62;
  animation: pageContentLoaderBar 1.1s ease-in-out infinite;
}
@keyframes pageContentLoaderPulse {
  0%,
  100% {
    opacity: 0.5;
  }
  50% {
    opacity: 1;
  }
}
@keyframes pageContentLoaderBar {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(250%);
  }
}
@media (prefers-reduced-motion: reduce) {
  .page-content-loader__logo,
  .page-content-loader__bar-fill {
    animation: none;
  }
}
</style>
