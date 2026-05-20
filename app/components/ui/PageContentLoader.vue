<!-- PageContentLoader -->
<!--
  Shown inside a Hero's center-part while the page data is still being
  fetched from the server. Once the data arrives the Hero swaps this out
  for <PageContent>, which then plays its heroCenterReveal entrance.
  The accent colour follows the page theme via --color-primary.
-->
<template>
  <div class="page-content-loader" role="status" aria-label="Loading">
    <span class="page-content-loader__spinner" />
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
.page-content-loader__spinner {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 2px solid var(--color-border, rgba(128, 128, 128, 0.25));
  border-top-color: var(--color-primary, #54ea62);
  animation: pageContentLoaderSpin 0.7s linear infinite;
}
@keyframes pageContentLoaderSpin {
  to {
    transform: rotate(360deg);
  }
}
@media (prefers-reduced-motion: reduce) {
  .page-content-loader__spinner {
    animation: none;
  }
}
</style>
