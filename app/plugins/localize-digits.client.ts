/**
 * App-wide Arabic numeral localization (display only).
 *
 * When the active locale is Arabic, every Western digit (0-9) rendered
 * anywhere in the DOM is automatically replaced with its Arabic-Indic
 * equivalent (٠-٩). Nothing is changed for English — and the underlying data,
 * component state and API responses are never touched: this operates purely on
 * the rendered text nodes.
 *
 * How it stays correct and cheap:
 *   - A single MutationObserver on <body> reacts to the text Vue renders, so
 *     there is zero manual wiring per component or page.
 *   - Conversion is driven off each text node's *source* (the value Vue wrote),
 *     cached in a WeakMap. This makes the pass idempotent and, crucially,
 *     reversible: switching back to English restores the original digits even
 *     for nodes Vue did not re-render.
 *   - Editable/`<script>`/`<style>` nodes and nodes without any digit are
 *     skipped, so the work per mutation is negligible.
 *
 * SSR-safe: the observer is client-only (`.client.ts`); the first conversion
 * runs synchronously right after hydration in `app:mounted`.
 */
export default defineNuxtPlugin((nuxtApp) => {
  const i18n = nuxtApp.$i18n as { locale: { value: string } };

  // Per text-node memory: `src` is the Western source Vue last produced, `out`
  // is what we last wrote. Comparing the live value against `out` tells us
  // whether Vue has re-rendered the node since our last pass.
  const cache = new WeakMap<Text, { src: string; out: string }>();

  const SKIP_TAGS = new Set(["SCRIPT", "STYLE", "TEXTAREA", "NOSCRIPT"]);
  // Has at least one Western or Arabic-Indic digit — anything else is inert.
  const HAS_DIGIT = /[0-9٠-٩]/;
  // Opt-out: any element (or descendant of one) carrying this attribute keeps
  // its Western digits even in Arabic. Usage: <span data-keep-digits>...</span>
  const OPT_OUT = "[data-keep-digits]";

  const shouldSkip = (node: Text): boolean => {
    const parent = node.parentElement;
    if (!parent) return true;
    if (SKIP_TAGS.has(parent.tagName)) return true;
    if (parent.isContentEditable) return true;
    return false;
  };

  const processTextNode = (node: Text, locale: string): void => {
    const current = node.nodeValue ?? "";
    const entry = cache.get(node);

    // If the live value matches what we wrote, Vue hasn't touched it — fall
    // back to the cached source. Otherwise the live value IS the fresh source.
    const src = entry && current === entry.out ? entry.src : current;

    if (!HAS_DIGIT.test(src)) {
      if (entry) cache.delete(node);
      return;
    }

    // Treat opted-out subtrees like English so they keep (and restore to)
    // Western digits. `closest` only runs for the few nodes that have digits.
    const optOut = node.parentElement?.closest(OPT_OUT) != null;
    const out = locale === "ar" && !optOut ? toArabicDigits(src) : src;
    if (current !== out) node.nodeValue = out;
    cache.set(node, { src, out });
  };

  const walk = (root: Node, locale: string): void => {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let node = walker.nextNode() as Text | null;
    while (node) {
      if (!shouldSkip(node)) processTextNode(node, locale);
      node = walker.nextNode() as Text | null;
    }
  };

  let observer: MutationObserver | null = null;

  const run = (): void => {
    const locale = i18n.locale.value;
    // Pause the observer while we mutate so our own writes don't feed back in.
    observer?.disconnect();
    walk(document.body, locale);
    observer?.observe(document.body, {
      childList: true,
      characterData: true,
      subtree: true,
    });
  };

  nuxtApp.hook("app:mounted", () => {
    observer = new MutationObserver((mutations) => {
      const locale = i18n.locale.value;
      observer?.disconnect();
      for (const m of mutations) {
        if (m.type === "characterData") {
          const t = m.target as Text;
          if (t.nodeType === Node.TEXT_NODE && !shouldSkip(t)) {
            processTextNode(t, locale);
          }
        } else {
          m.addedNodes.forEach((n) => {
            if (n.nodeType === Node.TEXT_NODE) {
              if (!shouldSkip(n as Text)) processTextNode(n as Text, locale);
            } else if (n.nodeType === Node.ELEMENT_NODE) {
              walk(n, locale);
            }
          });
        }
      }
      observer?.observe(document.body, {
        childList: true,
        characterData: true,
        subtree: true,
      });
    });

    run();
  });

  // Re-run the whole pass whenever the language changes so digits flip
  // immediately in both directions, even for text Vue didn't re-render.
  watch(i18n.locale, () => {
    if (observer) run();
  });
});
