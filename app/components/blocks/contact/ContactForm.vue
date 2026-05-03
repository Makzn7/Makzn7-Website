<template>
  <form
    class="flex flex-col justify-between h-full gap-8"
    @submit.prevent="handleSubmit"
  >
    <div class="flex flex-col">
      <div
        v-for="field in fields"
        :key="field.key"
        class="border-b transition-colors duration-300"
        :style="{
          borderColor:
            focused === field.key
              ? 'var(--main-color)'
              : 'rgba(255,255,255,0.4)',
        }"
      >
        <component
          :is="field.tag"
          v-model="form[field.key]"
          :type="field.type"
          :placeholder="$t(`contact.${field.key}`)"
          :rows="field.rows"
          :required="true"
          class="w-full bg-transparent border-none outline-none text-white font-light placeholder:text-white/45 py-3 resize-none text-[clamp(14px,1.4vw,20px)]"
          @focus="focused = field.key"
          @blur="focused = null"
        />
      </div>
    </div>

    <div class="flex justify-end items-center gap-4">
      <p v-if="successMsg" class="text-[13px] text-[--main-color]">
        {{ successMsg }}
      </p>
      <p v-if="errorMsg" class="text-[13px] text-red-400">{{ errorMsg }}</p>
      <button
        type="submit"
        :disabled="submitting"
        class="px-10 py-3 bg-[--main-color] border border-[--main-color] text-black transition-all duration-300 hover:bg-transparent hover:text-white hover:border-white disabled:opacity-60 disabled:cursor-not-allowed"
        :style="`font-size: clamp(${Math.max(14, Math.round(23 * 0.35))}px, ${(
          23 / 20
        ).toFixed(1)}vw, ${23}px);`"
      >
        {{ submitting ? "..." : $t("contact.submit") }}
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
const { t } = useI18n();

const form = reactive({ name: "", email: "", message: "" });
const focused = ref<string | null>(null);
const submitting = ref(false);
const successMsg = ref("");
const errorMsg = ref("");

const fields = [
  { key: "name", tag: "input", type: "text", rows: undefined },
  { key: "email", tag: "input", type: "email", rows: undefined },
  { key: "message", tag: "textarea", type: undefined, rows: 7 },
];

async function handleSubmit() {
  submitting.value = true;
  successMsg.value = "";
  errorMsg.value = "";
  try {
    await new Promise((r) => setTimeout(r, 800));
    successMsg.value = t("contact.success");
    form.name = "";
    form.email = "";
    form.message = "";
  } catch {
    errorMsg.value = t("contact.error");
  } finally {
    submitting.value = false;
  }
}
</script>
