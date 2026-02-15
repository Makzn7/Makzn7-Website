<!-- Page -->
<template>
  <div class="app-container bg-white">
    <div class="top-section w-full h-full cursor-none">
      <div class="left-box">
        <LeftSideContent />
      </div>
      <div class="center-box">
        <div class="top-part bg-white z-50">
          <div class="flex justify-center items-center">
            <img
              src="/logos/svg/logo_black.svg"
              width="100"
              height="100"
              alt=""
            />
          </div>
        </div>
        <div
          class="center-part flex flex-col gap-4 overflow-scroll p-6 pb-[80px]"
        >
          <div class="mt-12 relative">
            <HeroGrid aspectRatio="none" class="h-[700px]"></HeroGrid>
            <div
              class="absolute top-0 left-0 w-full h-full flex items-center justify-center pointer-events-none"
            >
              <h2
                class="text-[6rem] font-extrabold uppercase max-w-[800px] text-start leading-[1]"
              >
                {{ $t("messages.headerMessageLine1") }}<br />{{
                  $t("messages.headerMessageLine2")
                }}
              </h2>
            </div>
          </div>
          <div class="mt-4">
            <div class="flex gap-2 justify-center items-center">
              <h2 class="py-4 font-medium text-lg uppercase whitespace-nowrap">
                {{ $t("titles.selectedProjects") }}
              </h2>
              <div class="h-[1px] bg-black w-full"></div>
            </div>
            <div
              v-for="project in featuredProjects"
              :key="project.id"
              class="my-8 hover-item"
              :data-image-url="
                project.hoverMedia?.src || project.heroMedia?.src
              "
            >
              <h3 class="text-6xl font-extrabold">{{ project.name }}</h3>
            </div>
          </div>
          <img class="h-[200px] w-[200px] object-cover preview-image" />
        </div>
        <div class="bottom-part"></div>
      </div>
      <div class="right-box">
        <RightSideContent />
      </div>
    </div>
  </div>
  <CustomCursor />
</template>
<script setup>
import { onMounted } from "vue";
import LeftSideContent from "~/components/blocks/home/HomeHeroLeftSideContent.vue";
import HeroGrid from "~/components/graphics/HeroGrid.vue";
import RightSideContent from "~/components/blocks/home/HomeHeroRightSideContent.vue";
import CustomCursor from "~/components/ui/CustomCursor.vue";
import { projects } from "~/mocks/projects";

const featuredProjects = projects.filter((p) => p.isFeatured).slice(0, 5);

onMounted(() => {
  const hoverItems = document.querySelectorAll(".hover-item");
  const previewImgEl = document.querySelector(".preview-image");
  const centerPartEl = document.querySelector(".center-part");

  if (!hoverItems.length || !previewImgEl || !centerPartEl) return;

  // Make sure preview image can be absolutely positioned
  previewImgEl.style.position = "absolute";

  hoverItems.forEach((item) => {
    item.addEventListener("mouseenter", () => {
      const url = item.getAttribute("data-image-url");
      console.log(url);

      if (!url) return;

      // Random position inside .center-part
      const centerRect = centerPartEl.getBoundingClientRect();
      const maxX = centerRect.width - previewImgEl.offsetWidth;
      const maxY = centerRect.height - previewImgEl.offsetHeight;

      const randomX = Math.max(0, Math.random() * maxX);
      const randomY = Math.max(0, Math.random() * maxY);

      previewImgEl.style.left = `${randomX}px`;
      previewImgEl.style.top = `${randomY}px`;

      // Show image
      previewImgEl.src = url;
      previewImgEl.style.opacity = "1";
    });

    item.addEventListener("mouseleave", () => {
      previewImgEl.style.opacity = "0";
      // Clear src after transition
      setTimeout(() => {
        previewImgEl.src = "";
      }, 500);
    });
  });
});
</script>
<style>
body {
  background-color: var(--bg-color);
}
.app-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.top-section {
  display: flex;
}

.left-box {
  width: var(--railW);
  /* border-right: 1px solid #000; */
  position: relative;
}

.left-box::before {
  content: "";
  position: absolute;
  top: calc(var(--railH) - 2px);
  left: var(--railW);
  height: 1px;
  width: 114px;
  background-color: #000;
  transform-origin: left bottom;
  transform: rotate(-134deg);
}

.left-box::after {
  content: "";
  position: absolute;
  bottom: calc(var(--railH) - 2px);
  left: var(--railW);
  height: 1px;
  width: 114px;
  background-color: #000;
  transform-origin: left top;
  transform: rotate(134deg);
}

.right-box {
  width: var(--railW);
  /* border-left: 1px solid #000; */
}

.right-box::before {
  content: "";
  position: absolute;
  top: calc(var(--railH) - 2px);
  right: var(--railW);
  height: 1px;
  width: 114px;
  background-color: #000;
  transform-origin: right bottom;
  transform: rotate(134deg);
}

.right-box::after {
  content: "";
  position: absolute;
  bottom: calc(var(--railH) - 2px);
  right: var(--railW);
  height: 1px;
  width: 114px;
  background-color: #000;
  transform-origin: right top;
  transform: rotate(-134deg);
}

.center-box {
  width: calc(100% - 2 * var(--railW));
  height: 100%;
  display: block;
  position: relative;
}

.center-box .top-part {
  height: var(--railH);
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  border: 1px solid var(--bg-color);
  border-bottom: 1px solid #000;
}

.center-box .center-part {
  scrollbar-width: none;
  -ms-overflow-style: none;
  height: 100%;
  border-right: 1px solid #000;
  border-left: 1px solid #000;
}

.center-box .bottom-part {
  height: var(--railH);
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  border: 1px solid var(--bg-color);
  border-top: 1px solid #000;
}

.preview-image {
  position: absolute;
  pointer-events: none; /* so it doesn't block hover */
  opacity: 0;
  transition: opacity 0.5s ease-in-out;
}

.preview-image[src] {
  opacity: 1;
}
</style>