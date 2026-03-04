<script setup lang="ts">
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HomeHero2 from "~/components/blocks/home/HomeHero2.vue";
import HomeAbout from "~/components/blocks/home/HomeAbout.vue";
import HomeContact from "~/components/blocks/home/HomeContact.vue";
import HomeTeam from "~/components/blocks/home/HomeTeam.vue";
const { locale } = useI18n();
const scrollContainer = ref<HTMLElement | null>(null);
let scroll: any = null;

useHead({
  title: "Makzn7",
  meta: [
    {
      name: "description",
      content: "Makzn7 – production design & prop house.",
    },
  ],
});

onMounted(async () => {
  gsap.registerPlugin(ScrollTrigger);

  const { $LocomotiveScroll } = useNuxtApp();

  if (scrollContainer.value) {
    scroll = new $LocomotiveScroll({
      el: scrollContainer.value,
      smooth: true,
      lerp: 0.08,
      multiplier: 1,
      smartphone: {
        smooth: true,
      },
      tablet: {
        smooth: true,
      },
    });

    // LS v5 is built on Lenis — sync ScrollTrigger via the lenisInstance
    const lenis = scroll.lenisInstance;
    if (lenis) {
      lenis.on("scroll", ScrollTrigger.update);
      ScrollTrigger.addEventListener("refresh", () => lenis.resize?.());
    }
    ScrollTrigger.refresh();
  }

  // In RTL, swap horizontal animation directions
  const isRTL = locale.value === "ar";

  // Animate fade-in elements when they enter the viewport
  gsap.utils.toArray<HTMLElement>("#content-section .fade-in").forEach((el) => {
    gsap.from(el, {
      opacity: 0,
      y: 50,
      duration: 1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: el,
        start: "top 85%",
        toggleActions: "play none none reverse",
      },
    });
  });

  gsap.utils
    .toArray<HTMLElement>("#content-section .fade-in-left")
    .forEach((el) => {
      gsap.from(el, {
        opacity: 0,
        x: isRTL ? 60 : -60,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      });
    });

  gsap.utils
    .toArray<HTMLElement>("#content-section .fade-in-right")
    .forEach((el) => {
      gsap.from(el, {
        opacity: 0,
        x: isRTL ? -60 : 60,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      });
    });
});

onBeforeUnmount(() => {
  if (scroll) scroll.destroy();
  ScrollTrigger.getAll().forEach((t) => t.kill());
});

function lockPageScroll() {
  if (!scroll) return;
  scroll.stop();
}

function unlockPageScroll() {
  if (!scroll) return;
  scroll.start();
}
</script>

<template>
  <div
    ref="scrollContainer"
    class="bg-brand-bg"
    data-scroll-container
  >
    <section class="sticky top-0 z-[1]" id="hero-section">
      <HomeHero2
        @lock-page-scroll="lockPageScroll"
        @unlock-page-scroll="unlockPageScroll"
      />
    </section>
    <section class="relative z-[2]" id="content-section" data-scroll-section>
      <HomeAbout />
      <HomeContact />
    </section>
    <!-- <HomeTeam /> -->
  </div>
</template>
