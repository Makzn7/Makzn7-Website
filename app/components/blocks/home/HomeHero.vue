<!-- Page -->
<template>
  <div class="app-container">
    <div class="top-section w-full h-full cursor-none">
      <div class="left-box">
        <LeftSideContent />
      </div>
      <div class="center-box">
        <div class="top-part"></div>
        <div
          class="center-part flex flex-col gap-4 overflow-scroll p-6 pb-[80px] text-brand-primary"
        >
          <!-- <div
            class="first-element-center flex items-center justify-center w-full gap-4"
          >
            <h1 class="primary-text font-bold text-[4rem] w-1/3 custom-font">
              Makzn7
            </h1>
            <p class="primary-text w-2/3 text-3xl">
              Practice for Architecture, Research and Theory is an architectural
              practice for experimental, digital and technological innovation
              research and implementation.
            </p>
          </div> -->
          <div class="mt-4">
            <HeroGrid></HeroGrid>
          </div>
          <div class="mt-4">
            <h2 class="border-b py-4 text-sm">Projects</h2>
            <div
              class="my-4 hover-item"
              data-image-url="assets/images/per1.png"
            >
              <h3 class="text-[3rem]">Sattar</h3>
              <p class="text-xl">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </p>
            </div>
            <div
              class="my-4 hover-item"
              data-image-url="assets/images/per1.png"
            >
              <h3 class="text-[3rem]">AL MAHARAH</h3>
              <p class="text-xl">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </p>
            </div>
            <div
              class="my-4 hover-item"
              data-image-url="assets/images/per1.png"
            >
              <h3 class="text-[3rem]">Sattar</h3>
              <p class="text-xl">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </p>
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

      // Random position inside .center-part
      const centerRect = centerPartEl.getBoundingClientRect();
      const maxX = centerRect.width - previewImgEl.offsetWidth;
      const maxY = centerRect.height - previewImgEl.offsetHeight;

      const randomX = Math.random() * maxX;
      const randomY = Math.random() * maxY;

      previewImgEl.style.left = `${randomX}px`;
      previewImgEl.style.top = `${randomY}px`;

      // Show image
      if (url.startsWith("~")) {
        import(/* @vite-ignore */ url.replace("~", "/src")).then((img) => {
          previewImgEl.src = img.default;
        });
      } else {
        previewImgEl.src = url;
      }

      previewImgEl.style.opacity = "1";
    });

    item.addEventListener("mouseleave", () => {
      previewImgEl.style.opacity = "0";
      previewImgEl.src = "";
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
  background-color: var(--primary-color);
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
  background-color: var(--primary-color);
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
  background-color: var(--primary-color);
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
  background-color: var(--primary-color);
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
  border-bottom: 1px solid var(--primary-color);
}

.center-box .center-part {
  scrollbar-width: none;
  -ms-overflow-style: none;
  height: 100%;
  border-right: 1px solid var(--primary-color);
  border-left: 1px solid var(--primary-color);
}

.center-box .bottom-part {
  height: var(--railH);
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  border: 1px solid var(--bg-color);
  border-top: 1px solid var(--primary-color);
}
.first-element-center {
  padding-top: calc(var(--railH) + 20px);
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