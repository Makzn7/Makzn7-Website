<template>
  <form
    ref="formRef"
    class="flex flex-col justify-between h-full gap-8"
    novalidate
    @submit.prevent="handleSubmit"
  >
    <div class="flex flex-col">
      <div
        v-for="field in fields"
        :key="field.key"
        class="transition-colors duration-300 border-b"
        :style="{
          borderColor: fieldErrors[field.key]
            ? '#f87171'
            : focused === field.key
            ? 'var(--main-color)'
            : 'rgba(255,255,255,0.4)',
        }"
      >
        <component
          :is="field.tag"
          :value="form[field.key]"
          :type="field.type"
          :inputmode="field.inputmode"
          :pattern="field.pattern"
          :minlength="field.minlength"
          :maxlength="field.maxlength"
          :placeholder="$t(`contact.${field.key}`)"
          :rows="field.rows"
          :aria-invalid="!!fieldErrors[field.key]"
          :aria-describedby="
            fieldErrors[field.key] ? `err-${field.key}` : undefined
          "
          class="w-full bg-transparent border-none outline-none text-white font-light placeholder:text-white/45 py-3 resize-none text-[clamp(14px,1.4vw,20px)] rtl:placeholder:text-right ltr:placeholder:text-left"
          :class="{
            'font-en': field.key === 'phone' || field.key === 'email',
          }"
          :dir="
            field.key === 'phone' || field.key === 'email' ? 'ltr' : undefined
          "
          @input="onInput(field.key, $event)"
          @focus="focused = field.key"
          @blur="focused = null"
        />
        <p
          v-if="fieldErrors[field.key]"
          :id="`err-${field.key}`"
          class="text-[12px] text-red-400 pb-2"
        >
          {{ fieldErrors[field.key] }}
        </p>
      </div>
    </div>

    <div class="flex justify-end items-center gap-4">
      <p
        v-if="successMsg"
        role="status"
        aria-live="polite"
        class="text-[13px] text-[--main-color]"
      >
        {{ successMsg }}
      </p>
      <p
        v-if="errorMsg && !hasFieldErrors"
        role="alert"
        aria-live="assertive"
        class="text-[13px] text-red-400"
      >
        {{ errorMsg }}
      </p>
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
type FieldKey = "name" | "email" | "phone" | "message";

type FieldDef = {
  key: FieldKey;
  tag: "input" | "textarea";
  type?: string;
  inputmode?: "email" | "tel";
  pattern?: string;
  rows?: number;
  minlength?: number;
  maxlength?: number;
};

type ContactPayload = {
  name: string;
  email: string;
  phone: string;
  message: string;
  locale: "ar" | "en";
  source: string;
};

type ValidationErrorBody = {
  message?: string;
  errors?: Partial<Record<FieldKey, string[]>>;
};

const PHONE_PATTERN = "[\\+\\d\\s\\-\\(\\)]+";

const fields: FieldDef[] = [
  { key: "name", tag: "input", type: "text", minlength: 2, maxlength: 120 },
  {
    key: "email",
    tag: "input",
    type: "email",
    inputmode: "email",
    maxlength: 180,
  },
  {
    key: "phone",
    tag: "input",
    type: "tel",
    inputmode: "tel",
    pattern: PHONE_PATTERN,
    minlength: 6,
    maxlength: 32,
  },
  { key: "message", tag: "textarea", rows: 7, minlength: 10, maxlength: 5000 },
];

const { t, locale } = useI18n();
const { raw } = useApi();

const formRef = ref<HTMLFormElement | null>(null);
const form = reactive<Record<FieldKey, string>>({
  name: "",
  email: "",
  phone: "",
  message: "",
});
const focused = ref<FieldKey | null>(null);
const submitting = ref(false);
const successMsg = ref("");
const errorMsg = ref("");
const fieldErrors = reactive<Record<FieldKey, string>>({
  name: "",
  email: "",
  phone: "",
  message: "",
});

const hasFieldErrors = computed(() =>
  (Object.keys(fieldErrors) as FieldKey[]).some((k) => !!fieldErrors[k])
);

function onInput(key: FieldKey, event: Event) {
  form[key] = (event.target as HTMLInputElement | HTMLTextAreaElement).value;
  if (fieldErrors[key]) fieldErrors[key] = "";
}

function clearMessages() {
  successMsg.value = "";
  errorMsg.value = "";
  (Object.keys(fieldErrors) as FieldKey[]).forEach((k) => {
    fieldErrors[k] = "";
  });
}

function resetForm() {
  form.name = "";
  form.email = "";
  form.phone = "";
  form.message = "";
}

function validateClient(): boolean {
  let firstInvalid: FieldKey | null = null;

  for (const field of fields) {
    const value = form[field.key].trim();
    let error = "";

    if (!value) {
      error = t(`contact.errors.${field.key}.required`);
    } else if (field.minlength && value.length < field.minlength) {
      error = t(`contact.errors.${field.key}.min`, { min: field.minlength });
    } else if (field.maxlength && value.length > field.maxlength) {
      error = t(`contact.errors.${field.key}.max`, { max: field.maxlength });
    } else if (field.key === "email" && !/^\S+@\S+\.\S+$/.test(value)) {
      error = t("contact.errors.email.invalid");
    } else if (
      field.key === "phone" &&
      !new RegExp(`^${PHONE_PATTERN}$`).test(value)
    ) {
      error = t("contact.errors.phone.invalid");
    }

    fieldErrors[field.key] = error;
    if (error && !firstInvalid) firstInvalid = field.key;
  }

  if (firstInvalid) {
    const el = formRef.value?.querySelector<HTMLElement>(
      `[placeholder="${t(`contact.${firstInvalid}`)}"]`
    );
    el?.focus();
  }

  return !firstInvalid;
}

function applyServerErrors(errors: ValidationErrorBody["errors"]) {
  if (!errors) return;
  (Object.keys(errors) as FieldKey[]).forEach((key) => {
    const messages = errors[key];
    if (key in fieldErrors && messages?.length) {
      fieldErrors[key] = messages[0]!;
    }
  });
}

function buildPayload(): ContactPayload {
  return {
    name: form.name.trim(),
    email: form.email.trim(),
    phone: form.phone.trim(),
    message: form.message.trim(),
    locale: locale.value === "ar" ? "ar" : "en",
    source: "website",
  };
}

async function handleSubmit() {
  if (submitting.value) return;
  clearMessages();
  if (!validateClient()) return;

  submitting.value = true;
  let status = 0;

  try {
    await raw("/contact", {
      method: "POST",
      body: buildPayload(),
      headers: { Accept: "application/json" },
      onResponse({ response }) {
        status = response.status;
      },
    });

    successMsg.value =
      status === 202 ? t("contact.duplicate") : t("contact.success");
    if (status !== 202) resetForm();
  } catch (err: any) {
    if (err?.status === 422) {
      const body = err.raw as ValidationErrorBody | undefined;
      applyServerErrors(body?.errors);
      errorMsg.value = body?.message || t("contact.validationError");
    } else if (err?.status === 429) {
      errorMsg.value = t("contact.rateLimited");
    } else if (err?.status >= 500) {
      errorMsg.value = t("contact.serverError");
    } else {
      errorMsg.value = err?.message || t("contact.error");
    }
  } finally {
    submitting.value = false;
  }
}
</script>
