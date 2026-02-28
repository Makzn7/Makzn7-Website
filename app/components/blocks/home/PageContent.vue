<!-- PageContent.vue -->
<!-- نفس محتوى center-part بالضبط — يُستخدم في السقف والجدار والأرض -->
<template>
  <!-- لا padding أعلى عشان المحتوى يبدأ من y=0 مباشرة
       هذا ضروري للـ sync — السقف والأرض يعرضان امتداد هذا المحتوى -->
  <div
    class="page-content flex flex-col gap-12"
    :style="`margin-top: ${marginTop}rem; padding: 0 ${px}rem`"
  >
    <!-- HeroGrid -->
    <div class="relative content-item">
      <HeroGrid aspectRatio="none" class="h-[700px]" />
      <div
        class="absolute top-0 left-0 w-full h-full flex items-center justify-center pointer-events-none"
      >
        <h2
          class="text-[6rem] font-bold uppercase max-w-[800px] text-start leading-[1]"
        >
          {{ $t("messages.headerMessageLine1") }}<br />
          {{ $t("messages.headerMessageLine2") }}
        </h2>
      </div>
    </div>

    <!-- Selected Projects -->
    <div class="mt-4">
      <div class="flex gap-2 justify-center items-center">
        <h2 class="py-4 font-medium text-lg uppercase whitespace-nowrap">
          {{ $t("titles.selectedProjects") }}
        </h2>
        <div class="h-[1px] bg-black w-full"></div>
      </div>

      <div
        v-for="project in projects"
        :key="project.id"
        class="content-item py-8 px-6"
        :class="{ 'hover-item cursor-pointer': showHover }"
        :data-image-url="project.hoverMedia?.src || project.heroMedia?.src"
        @mouseenter="showHover && onEnter($event)"
        @mouseleave="showHover && $emit('hover-leave')"
      >
        <h3 class="text-6xl font-extrabold">{{ project.name }}</h3>
      </div>
    </div>

    <!-- spacer أسفل عشان الأرض ما تبقى فارغة في النهاية -->
    <div class="content-item" style="height: 6rem"></div>
  </div>
</template>

<script setup>
import HeroGrid from "~/components/graphics/HeroGrid.vue";

const props = defineProps({
  projects: { type: Array, required: true },
  showHover: { type: Boolean, default: false },
  marginTop: { type: Number, default: 4 },
  px: { type: Number, default: 1 },
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