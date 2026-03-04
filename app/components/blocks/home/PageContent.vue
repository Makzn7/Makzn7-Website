<!-- PageContent.vue -->
<!-- نفس محتوى center-part بالضبط — يُستخدم في السقف والجدار والأرض -->
<template>
  <!-- لا padding أعلى عشان المحتوى يبدأ من y=0 مباشرة
       هذا ضروري للـ sync — السقف والأرض يعرضان امتداد هذا المحتوى -->
  <div
    class="page-content flex flex-col gap-12"
    :style="`margin-top: ${marginTop}rem;`"
  >
    <!-- HeroGrid -->
    <div class="relative content-item" :style="`padding: 0 ${px}rem`">
      <div class="flex items-center justify-between gap-4 my-16">
        <!-- dark:invert flips black logo to white in dark mode -->
        <img src="/logos/svg/logo_black.svg" alt="" width="200" class="dark:invert" />
        <p
          :class="`font-light leading-[44px] tracking-[-0.59px] rtl:tracking-normal rtl:leading-[1.8]`"
          :style="`font-size: ${descSize}px;`"
        >
          {{ $t("home.heroDescription") }}
        </p>
      </div>
      <HeroGrid aspectRatio="none" class="h-[700px]" />
      <div
        class="absolute top-0 start-0 w-full h-full flex items-center justify-center pointer-events-none"
      >
        <!-- <h2
          class="text-[6rem] font-bold uppercase max-w-[800px] text-start leading-[1]"
        >
          {{ $t("messages.headerMessageLine1") }}<br />
          {{ $t("messages.headerMessageLine2") }}
        </h2> -->
      </div>
    </div>

    <!-- Selected Projects -->
    <div class="mt-4">
      <div
        class="flex gap-2 justify-start items-center border-t-[0.3px] border-b-[0.3px] border-brand-text"
      >
        <h2
          class="py-8 font-medium text-[44px] leading-[52px] uppercase whitespace-nowrap"
          :style="`padding-right: ${projectPX}rem; padding-left: ${projectPX}rem;`"
        >
          {{ $t("titles.selectedProjects") }}
        </h2>
      </div>

      <div>
        <div
          v-for="project in projects"
          :key="project.id"
          class="content-item py-16 hover:underline transition-all duration-500 ease-in-out"
          :style="`padding-right: ${projectPX}rem; padding-left: ${projectPX}rem;`"
          :class="{ 'hover-item cursor-pointer': showHover }"
          :data-image-url="project.hoverMedia?.src || project.heroMedia?.src"
          @mouseenter="showHover && onEnter($event)"
          @mouseleave="showHover && $emit('hover-leave')"
        >
          <h3
            class="leading-[130px] italic font-semibold"
            :style="`font-size: ${projectSize}px`"
          >
            {{ project.name }}
          </h3>
        </div>
      </div>
    </div>

    <!-- spacer أسفل عشان الأرض ما تبقى فارغة في النهاية -->
    <div class="content-item ltr:h-[8rem] rtl:h-[8rem]"></div>
  </div>
</template>

<script setup>
import HeroGrid from "~/components/graphics/HeroGrid.vue";

const props = defineProps({
  projects: { type: Array, required: true },
  showHover: { type: Boolean, default: false },
  marginTop: { type: Number, default: 4 },
  px: { type: Number, default: 1 },
  descSize: { type: Number, default: 37 },
  projectPX: { type: Number, default: 4 },
  projectSize: { type: Number, default: 123 },
});

const emit = defineEmits(["hover-enter", "hover-leave"]);

function onEnter(e) {
  const url = e.currentTarget.getAttribute("data-image-url");
  if (!url) return;

  const parent = e.currentTarget.closest(".center-part");
  if (!parent) return;

  const pr = parent.getBoundingClientRect();
  emit("hover-enter", {
    url,
    x: Math.max(0, Math.random() * (pr.width - 200)),
    y: Math.max(0, Math.random() * (pr.height - 200)),
  });
}
</script>