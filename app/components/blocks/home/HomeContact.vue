<!-- HomeContact -->
<template>
  <section class="home-contact bg-black text-white">
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
            {{ $t("home.contactTitle") }}
          </h2>
        </div>

        <!-- Options + Contact Info + Social Media -->
        <div class="grid grid-cols-1 md:grid-cols-6 gap-16 lg:gap-16">
          <!-- Options + Year -->
          <div class="col-span-3 flex flex-col justify-between gap-6">
            <div class="flex flex-col w-full gap-2 justify-start items-start">
              <button>
                <font-awesome-icon
                  icon="fa-solid fa-circle-half-stroke"
                  style="width: 30px; height: 30px"
                />
              </button>
              <button class="flex justify-start items-center gap-2">
                <font-awesome-icon
                  icon="fa-solid fa-globe"
                  style="width: 30px; height: 30px"
                />
                <span class="text-[31px] leading-[37px] mb-[20px]">{{
                  $t("buttons.lang")
                }}</span>
              </button>
            </div>
            <div class="flex flex-col justify-start items-start gap-2">
              <NuxtLink
                to="/privacy-policy"
                class="white-link uppercase text-white text-[42px] leading-[50px]"
                >{{ $t("buttons.privacyPolicy") }}</NuxtLink
              >
              <p class="text-white font-light text-[49px] leading-[58px]">
                {{ new Date().getFullYear() }}
              </p>
            </div>
          </div>
          <!-- Contact Information List -->
          <div class="col-span-2 text-lg flex flex-col justify-between gap-8">
            <!-- Email and Phone -->
            <div class="flex flex-col font-light">
              <a href="mailto:Hello@makzn7.com" class="white-link-sm">
                Hello@makzn7.com
              </a>
              <a href="tel:+966000000000" class="white-link-sm">
                {{ $t("contact.phone") }}
              </a>
            </div>
            <!-- Address -->
            <div class="space-y-1">
              <p class="text-white font-light">{{ $t("contact.address") }}</p>
            </div>
            <!-- VAT -->
            <div>
              <p class="text-white font-light">
                {{ $t("contact.cr") }}: 1010709330
              </p>
              <p class="text-white font-light">
                {{ $t("contact.vat") }}: 310928662200003
              </p>
            </div>
          </div>

          <!-- Social Media Icons (Vertical Stack) -->
          <div
            class="flex flex-row lg:flex-col gap-1 justify-between items-start"
          >
            <!-- Instagram -->
            <a
              href="https://www.instagram.com/makzn.7"
              target="_blank"
              rel="noopener noreferrer"
              class="social-icon group"
              aria-label="Instagram"
            >
              <font-awesome-icon
                icon="fa-brands fa-instagram"
                style="width: 30px; height: 30px"
              />
            </a>

            <!-- Vimeo -->
            <a
              href="https://vimeo.com/makzn7"
              target="_blank"
              rel="noopener noreferrer"
              class="social-icon group"
              aria-label="Vimeo"
            >
              <font-awesome-icon
                icon="fa-brands fa-vimeo-v"
                style="width: 30px; height: 30px"
              />
            </a>

            <!-- LinkedIn -->
            <a
              href="https://www.linkedin.com/company/makzn7"
              target="_blank"
              rel="noopener noreferrer"
              class="social-icon group"
              aria-label="LinkedIn"
            >
              <font-awesome-icon
                icon="fa-brands fa-linkedin-in"
                style="width: 30px; height: 30px"
              />
            </a>

            <!-- X (Twitter) -->
            <a
              href="https://www.x.com/makzn7"
              target="_blank"
              rel="noopener noreferrer"
              class="social-icon group"
              aria-label="X (Twitter)"
            >
              <font-awesome-icon
                icon="fa-brands fa-x-twitter"
                style="width: 30px; height: 30px"
              />
            </a>
          </div>
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