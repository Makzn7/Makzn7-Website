<template>
  <section
    class="home-contact bg-black text-white py-16 px-6 border-t border-white/10"
  >
    <div class="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20">
      <!-- Title + Icon + Year -->
      <div class="flex flex-col justify-between items-start space-y-12">
        <!-- Title -->
        <h2 class="text-4xl lg:text-6xl font-medium uppercase leading-none">
          {{ $t("contact.title") }}
        </h2>

        <!-- Year with small icon -->
        <div class="flex flex-col items-start">
          <img src="/icons/svg/white/8.svg" width="50" alt="" />
          <span class="text-4xl font-pixel">2026</span>
        </div>
      </div>

      <!-- Contact Info + Social Media -->
      <div class="flex flex-col lg:flex-row gap-12 lg:gap-16">
        <!-- Contact Information List -->
        <div class="flex-1 space-y-6 text-lg">
          <!-- Email and Phone -->
          <div class="flex flex-col font-light">
            <a
              href="mailto:Hello@makzn7.com"
              class="text-white hover:text-brand-primary transition-colors duration-300"
            >
              Hello@makzn7.com
            </a>
            <a
              href="tel:+966000000000"
              class="text-white hover:text-brand-primary transition-colors duration-300"
            >
              {{ $t("contact.phone") }}
            </a>
          </div>
          <!-- VAT -->
          <div>
            <p class="text-white font-light">{{ $t("contact.vat") }}</p>
          </div>
          <!-- Address -->
          <div class="space-y-1">
            <p class="text-white font-light">{{ $t("contact.address") }}</p>
            <p class="text-white font-light">
              {{ $t("contact.addressLine2") }}
            </p>
          </div>
        </div>

        <!-- Social Media Icons (Vertical Stack) -->
        <div
          class="flex flex-row lg:flex-col gap-1 lg:justify-start items-start"
        >
          <!-- Instagram -->
          <a
            href="https://www.instagram.com/makzn.7"
            target="_blank"
            rel="noopener noreferrer"
            class="social-icon group"
            aria-label="Instagram"
          >
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
              class="group-hover:stroke-brand-primary transition-colors duration-300"
            >
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
            </svg>
          </a>

          <!-- Vimeo -->
          <a
            href="https://vimeo.com/makzn7"
            target="_blank"
            rel="noopener noreferrer"
            class="social-icon group"
            aria-label="Vimeo"
          >
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="currentColor"
              class="group-hover:fill-brand-primary transition-colors duration-300"
            >
              <path
                d="M23.977 6.416c-.105 2.338-1.739 5.543-4.894 9.609-3.268 4.247-6.026 6.37-8.29 6.37-1.409 0-2.578-1.294-3.553-3.881L5.322 11.4C4.603 8.816 3.834 7.522 3.01 7.522c-.179 0-.806.378-1.881 1.132L0 7.197a315.065 315.065 0 0 0 3.501-3.128C5.08 2.701 6.266 1.984 7.055 1.91c1.867-.18 3.016 1.1 3.447 3.838.465 2.953.789 4.789.971 5.507.539 2.45 1.131 3.674 1.776 3.674.502 0 1.256-.796 2.265-2.385 1.004-1.589 1.54-2.797 1.612-3.628.144-1.371-.395-2.061-1.614-2.061-.574 0-1.167.121-1.777.391 1.186-3.868 3.434-5.757 6.762-5.637 2.473.06 3.628 1.664 3.493 4.797l-.013.01z"
              />
            </svg>
          </a>

          <!-- LinkedIn -->
          <a
            href="https://www.linkedin.com/company/makzn7"
            target="_blank"
            rel="noopener noreferrer"
            class="social-icon group"
            aria-label="LinkedIn"
          >
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
              class="group-hover:stroke-brand-primary transition-colors duration-300"
            >
              <path
                d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"
              />
              <rect x="2" y="9" width="4" height="12" />
              <circle cx="4" cy="4" r="2" />
            </svg>
          </a>

          <!-- X (Twitter) -->
          <a
            href="https://www.x.com/makzn7"
            target="_blank"
            rel="noopener noreferrer"
            class="social-icon group"
            aria-label="X (Twitter)"
          >
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="currentColor"
              class="group-hover:fill-brand-primary transition-colors duration-300"
            >
              <path
                d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
              />
            </svg>
          </a>
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