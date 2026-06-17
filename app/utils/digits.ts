/**
 * Display-only localization of Western (0-9) digits to Arabic-Indic digits.
 *
 * This is a pure, dependency-free helper. It NEVER touches the underlying
 * data/model — it only transforms a string for presentation. Only the numeric
 * characters are mapped; every surrounding character (letters, separators,
 * symbols like `%`, `-`, `,`) is preserved exactly.
 *
 *   toArabicDigits("SAR 1,250")    => "SAR ١,٢٥٠"
 *   toArabicDigits("خصم 30%")      => "خصم ٣٠٪"  (٪ comes from source text)
 *   toArabicDigits("SKU-2026-001") => "SKU-٢٠٢٦-٠٠١"
 *
 * The mapping is idempotent: passing already-converted text through again is a
 * no-op, since only `0`-`9` are remapped and Arabic-Indic digits are left as-is.
 */

// U+0660..U+0669 — Arabic-Indic digits ٠١٢٣٤٥٦٧٨٩
const ARABIC_INDIC = [
  "٠",
  "١",
  "٢",
  "٣",
  "٤",
  "٥",
  "٦",
  "٧",
  "٨",
  "٩",
];

/** Matches a single Western digit. */
const WESTERN_DIGIT = /[0-9]/g;
/** Matches a single Arabic-Indic digit (for the reverse direction). */
const ARABIC_DIGIT = /[٠-٩]/g;

/** Convert every Western digit in `value` to its Arabic-Indic equivalent. */
export function toArabicDigits(value: string): string {
  return value.replace(WESTERN_DIGIT, (d) => ARABIC_INDIC[+d]!);
}

/** Convert every Arabic-Indic digit in `value` back to a Western digit. */
export function toWesternDigits(value: string): string {
  return value.replace(ARABIC_DIGIT, (d) => String(d.charCodeAt(0) - 0x0660));
}

/**
 * Locale-aware entry point. Converts digits to Arabic-Indic only when the
 * active locale is Arabic; for every other locale the string is returned
 * unchanged. Use this directly when you need an explicit, one-off conversion
 * (e.g. inside a computed). For automatic, app-wide conversion the
 * `localize-digits` client plugin handles the DOM for you.
 */
export function localizeDigits(
  value: string | number | null | undefined,
  locale: string,
): string {
  if (value === null || value === undefined) return "";
  const str = String(value);
  return locale === "ar" ? toArabicDigits(str) : str;
}
