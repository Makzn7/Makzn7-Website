<!-- HomeContact -->
<template>
  <section
    class="home-contact bg-black text-white border-b-[0.3px] border-white"
  >
    <div class="flex">
      <div
        class="border-e-[0.3px] border-white"
        style="width: var(--railW)"
      ></div>
      <div class="w-full mx-auto grid grid-cols-1 gap-12 py-16 px-28">
        <!-- Title -->
        <div class="flex flex-col justify-between items-start space-y-12">
          <!-- Title -->
          <h2 class="text-[103px] font-medium uppercase leading-none">
            {{ $t("home.aboutTitle") }}
          </h2>
        </div>

        <!-- Content -->
        <div class="ms-40 me-8 flex flex-col gap-16">
          <p class="font-light text-[37px] leading-[44px] tracking-[-0.59px]">
            {{ $t("home.aboutDescription") }}
          </p>
          <NuxtLink
            to="/about"
            class="white-link flex items-center gap-6 uppercase text-white text-[57px] leading-[67px] ml-auto"
          >
            <span>
              {{ $t("buttons.discoverMore") }}
            </span>
            <span class="font-pixel mb-[20px]">-></span>
          </NuxtLink>
        </div>
      </div>
    </div>
  </section>
</template>


<style scoped>
.social-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  cursor: pointer;
  color: #ffffff;
}

.hand-icon-large svg,
.hand-icon-small svg {
  stroke-linecap: round;
  stroke-linejoin: round;
}
</style>