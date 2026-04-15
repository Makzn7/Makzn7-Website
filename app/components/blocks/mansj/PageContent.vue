<template>
  <div class="relative" :style="`margin-top: ${marginTop}rem;`">
    <!-- content -->
    <div class="flex flex-col w-full min-h-screen text-white">
      <!--  -->
      <div class="w-full border-b-[0.3px] border-brand-text h-[120px]">
        <div
          class="border-e-[0.3px] h-full"
          :style="`width: ${marginS}px;`"
        ></div>
      </div>
      <!--  -->
      <div
        class="w-full border-s-[0.3px] border-brand-text h-[100px]"
        :style="`margin-inline-start: ${marginS}px;`"
      >
        <!-- <div>
          <img src="/icons/svg/green/2.svg" width="100" alt="Makzn7" />
        </div> -->
      </div>
      <!-- About -->
      <section>
        <SectionTitle
          :title="$t('mansj.aboutTitle')"
          :marginS="marginS"
          :titleS="titleS"
        />
        <div
          class="w-full border-s-[0.3px] border-t-[0.3px] border-brand-text px-12 py-16"
          :style="`margin-inline-start: ${marginS}px;`"
        >
          <div
            class="font-light leading-[1.45] tracking-[0px] pe-28"
            :style="`font-size: clamp(${Math.max(
              16,
              Math.round(descSize * 0.35)
            )}px, ${(descSize / 20).toFixed(1)}vw, ${descSize}px);`"
            v-html="$t('mansj.aboutDescription')"
          ></div>
        </div>
      </section>
      <!-- Services -->
      <section>
        <SectionTitle
          :title="$t('mansj.servicesTitle')"
          :marginS="marginS"
          :titleS="titleS"
        ></SectionTitle>
        <div
          class="w-full border-s-[0.3px] border-t-[0.3px] border-brand-text px-12 py-16"
          :style="`margin-inline-start: ${marginS}px;`"
        >
          <div
            class="font-light leading-[1.45] tracking-[0px] pe-28"
            :style="`font-size: clamp(${Math.max(
              16,
              Math.round(descSize * 0.35)
            )}px, ${(descSize / 20).toFixed(1)}vw, ${descSize}px);`"
            v-html="$t('mansj.servicesDescription')"
          ></div>
        </div>
      </section>
      <!-- Team -->
      <MansjTeam
        :marginS="marginS"
        :descSize="descSize"
        :titleS="titleS"
        :teams="teams"
        :py="py"
        :marginB="marginB"
      />
      <section>
        <div
          class="border-t-[0.3px] min-h-[300px] border-brand-text flex items-center justify-center"
        >
          <NuxtLink
            to="/projects?department=mansj"
            class="primary-link italic font-bold hover:underline decoration-4 underline-offset-4"
            :style="`font-size: clamp(${Math.max(
              16,
              Math.round(99 * 0.35)
            )}px, ${(99 / 20).toFixed(1)}vw, ${99}px);`"
          >
            {{ $t("mansj.showProject") }}
          </NuxtLink>
        </div>
      </section>
    </div>

    <!-- spacer أسفل عشان الأرض ما تبقى فارغة في النهاية -->
    <div
      class="content-item h-[2rem] md:h-[3rem] lg:h-[4rem] 2xl:h-[5rem]"
    ></div>
  </div>
</template>
<script setup lang="ts">
import MansjTeam from "./MansjTeam.vue";
import SectionTitle from "../../ui/SectionTitle.vue";
import type { Person } from "~/types/person";
import type { Award } from "~/types/award";

const props = withDefaults(
  defineProps<{
    marginTop?: number;
    marginS?: number;
    px?: number;
    imageW?: number;
    titleS?: number;
    descSize?: number;
    teams?: Person[];
    awards?: Award[];
    py?: number;
    marginB?: number;
  }>(),
  {
    marginTop: 4,
    marginS: 140,
    px: 1,
    imageW: 100,
    titleS: 130,
    descSize: 37,
    teams: () => [],
    awards: () => [],
    py: 4,
    marginB: 2,
  }
);
</script>
