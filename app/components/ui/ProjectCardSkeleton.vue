<!--
  ProjectCardSkeleton
  ───────────────────
  Mirrors the dimensions and box of <ProjectsList>'s `.project-card` cell so
  the grid stays exactly the same shape while data is loading. Shimmer
  matches the soft palette already used in ProjectImage to keep the
  loading vocabulary consistent across the page.
-->
<template>
  <div class="project-card-skeleton" aria-hidden="true">
    <div class="project-card-skeleton__shimmer" />
  </div>
</template>

<style scoped>
.project-card-skeleton {
  position: relative;
  width: 100%;
  height: 250px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.03);
}

.project-card-skeleton__shimmer {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    100deg,
    rgba(255, 255, 255, 0.03) 0%,
    rgba(255, 255, 255, 0.08) 45%,
    rgba(255, 255, 255, 0.03) 90%
  );
  background-size: 200% 100%;
  animation: project-card-skeleton-shimmer 1.6s ease-in-out infinite;
}

@keyframes project-card-skeleton-shimmer {
  0% {
    background-position: 100% 0;
  }
  100% {
    background-position: -100% 0;
  }
}

@media (max-width: 747px) {
  .project-card-skeleton {
    height: 220px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .project-card-skeleton__shimmer {
    animation: none;
  }
}
</style>
