# CLAUDE.md

هذا الملف يوضح طريقة العمل المفضلة داخل مشروع `makzn7-website` حتى تكون التعديلات القادمة متناسقة، قليلة التكرار، وأوفر في التوكن والسياق.

## ملخص المشروع

- المشروع مبني على `Nuxt 4` مع `Vue 3`.
- الواجهة تعتمد على `TailwindCSS` مع `CSS variables` موجودة في [`app/assets/css/main.css`](/Users/mohdjahaf/dev/M7/Projects/Makzn7/Website/makzn7-website/app/assets/css/main.css).
- الحركة والتمرير تعتمد حاليًا على:
- `locomotive-scroll`
- `gsap`
- `ScrollTrigger`
- يوجد دعم للغتين `ar/en` عبر `@nuxtjs/i18n`.
- يوجد دعم للوضع اللوني عبر `@nuxtjs/color-mode`.
- البيانات الحالية في عدة أماكن تعتمد على `mocks` داخل `app/mocks`.

## ملاحظات على الوضع الحالي

- هناك تكرار واضح بين صفحات:
- [`app/pages/index.vue`](/Users/mohdjahaf/dev/M7/Projects/Makzn7/Website/makzn7-website/app/pages/index.vue)
- [`app/pages/about.vue`](/Users/mohdjahaf/dev/M7/Projects/Makzn7/Website/makzn7-website/app/pages/about.vue)
- [`app/pages/projects/index.vue`](/Users/mohdjahaf/dev/M7/Projects/Makzn7/Website/makzn7-website/app/pages/projects/index.vue)
- التكرار الحالي يشمل:
- تهيئة `LocomotiveScroll`
- ربط `GSAP/ScrollTrigger`
- `lockPageScroll` و `unlockPageScroll`
- تفعيل أنيميشن عناصر `fade-in` و `fade-in-left` و `fade-in-right`
- يوجد اتجاه جيد بالفعل في فصل بعض الأجزاء المشتركة مثل:
- [`app/components/ui/ContactSection.vue`](/Users/mohdjahaf/dev/M7/Projects/Makzn7/Website/makzn7-website/app/components/ui/ContactSection.vue)
- [`app/components/ui/SectionTitle.vue`](/Users/mohdjahaf/dev/M7/Projects/Makzn7/Website/makzn7-website/app/components/ui/SectionTitle.vue)
- [`app/composables/useScrollAnimation.js`](/Users/mohdjahaf/dev/M7/Projects/Makzn7/Website/makzn7-website/app/composables/useScrollAnimation.js)
- لكن لا يزال المشروع يحتاج نهجًا موحدًا أوضح لمنع تضخم الملفات وإعادة كتابة نفس المنطق في كل شاشة.

## مبادئ العمل داخل المشروع

- أي شاشة جديدة يجب أن تتبع نفس هوية المشروع البصرية والحركية، لا يتم إدخال مكتبات حركة جديدة إلا إذا كان هناك سبب قوي جدًا.
- المكتبات الحالية هي المرجع الأساسي:
- `gsap`
- `ScrollTrigger`
- `locomotive-scroll`
- لا يتم خلط المشروع بمكتبات حركة إضافية مثل `framer-motion` أو بدائل أخرى إلا عند ضرورة واضحة ومع تبرير صريح.
- يجب الحفاظ على نفس مفردات الحركة:
- `fade-in`
- `fade-in-left`
- `fade-in-right`
- سرعة الحركة
- easing
- توقيت ظهور العناصر
- الاتجاه في `RTL/LTR`
- أي سلوك متكرر يجب تحويله إلى:
- `component`
- أو `composable`
- أو `utility`
- لا يتم بناء شاشة كاملة داخل ملف واحد إذا كانت تحتوي أجزاء منطقية قابلة للفصل.

## آلية تقسيم الملفات

- الصفحة `page` يجب أن تكون ملف orchestration فقط.
- ملف الصفحة يجمع الأقسام ويربط البيانات والـ scroll العام، ولا يحمل markup ضخم أو منطق داخلي ثقيل.
- كل شاشة تقسم إلى:
- `Hero`
- `Sections`
- `Shared UI`
- `Data layer`

### الصفحات

- توضع في `app/pages`.
- الصفحة يجب أن تحتوي فقط على:
- `useHead`
- استدعاء الـ sections الرئيسية
- ربط الـ composables العامة
- wiring للأحداث العامة مثل `lock-page-scroll`

### أقسام الشاشة

- توضع في `app/components/blocks/<page-name>`.
- كل قسم مستقل في ملفه.
- إذا كانت الشاشة تحتوي:
- Hero
- Content block
- Team block
- Awards block
- Filters block
- Gallery block
- فيجب فصل كل جزء في مكون مستقل.

### المكونات المشتركة

- توضع في `app/components/ui`.
- أي جزء يتكرر بين أكثر من شاشة يجب نقله إلى `ui`.
- أمثلة جيدة للمشترك:
- عناوين الأقسام
- side rails
- frame wrappers
- contact blocks
- shared buttons
- locale/theme toggles
- cards
- empty states

### الرسومات أو الأجزاء البصرية الخاصة

- توضع في `app/components/graphics`.
- أي عنصر بصري معقّد أو decorative graphic أو grid أو 3D visual يجب أن يكون هنا وليس داخل ملف الصفحة.

### المنطق المشترك

- يوضع في `app/composables`.
- أي منطق خاص بـ:
- scroll setup
- animation registration
- direction-aware motion
- theme/locale behavior
- shared fetching
- يجب نقله إلى composable بدل تكراره داخل الصفحات.

### الأنواع

- توضع في `app/types`.
- لا يتم استخدام `any` إذا كان بالإمكان تعريف النوع.
- أي mock أو API response يجب أن يربط بنوع واضح.

### البيانات المؤقتة

- توضع في `app/mocks`.
- إذا أصبح مصدر البيانات حقيقيًا من API، يبقى الـ shape نفسه متوافقًا مع `types`.

## الهيكلة المقترحة للشاشات القادمة

- `page`
- مثال: `app/pages/about.vue`
- مسؤوليتها: التركيب العام فقط.

- `hero block`
- مثال: `app/components/blocks/about/AboutHero.vue`
- مسؤوليتها: تجربة القسم الأول، بما فيها internal scroll إذا لزم.

- `content blocks`
- مثال:
- `AboutIntro.vue`
- `AboutTeam.vue`
- `AboutAwards.vue`
- `ProjectsFilters.vue`
- `ProjectsGrid.vue`

- `shared ui`
- مثال:
- `FrameLayout.vue`
- `SideRailNav.vue`
- `SectionHeader.vue`
- `PageShell.vue`

## نهج موحد للحركة

- لا يتم تعريف animation logic بشكل حر داخل كل شاشة إلا للضرورات الخاصة جدًا.
- الأصل أن تكون الحركة على مستويين:

- مستوى عام:
- composable أو helper لتسجيل `GSAP` و `ScrollTrigger`
- composable موحد لإعداد `LocomotiveScroll`
- helper يحدد اتجاه الحركة بناء على `locale`

- مستوى محلي:
- animation خاصة بقسم معين إذا كانت مرتبطة بتصميمه فقط

- يجب توحيد:
- `duration`
- `ease`
- `start thresholds`
- `opacity/y/x defaults`

- أي حركة ظهور عادية يجب أن تستخدم classes الحالية أو helper موحد، وليس نسخة جديدة من نفس الفكرة.

## قواعد تمنع تضخم الملفات

- إذا تجاوز ملف Vue حدودًا تقريبية مثل:
- `200-250` سطر مع أكثر من مسؤولية
- أو جمع template كبير + business logic + animation logic + data mapping
- فيجب التفكير مباشرة في تقسيمه.

- إذا تكرر نفس markup مرتين أو أكثر:
- حوّله إلى مكون مشترك.

- إذا تكرر نفس setup للـ scroll أو animation في صفحتين أو أكثر:
- حوّله إلى composable.

- إذا احتاج المكون props كثيرة جدًا فقط لأنه يحاول تغطية أكثر من دور:
- غالبًا المكون مدموج أكثر من اللازم ويحتاج تفكيك.

## ما الذي يجب استخراجه مستقبلًا من الوضع الحالي

- استخراج composable موحد مثل:
- `usePageScrollShell`
- مسؤول عن:
- إنشاء `LocomotiveScroll`
- ربطه مع `ScrollTrigger`
- `stop/start`
- cleanup

- استخراج composable موحد مثل:
- `useGsapReveal`
- مسؤول عن:
- تفعيل `fade-in`
- `fade-in-left`
- `fade-in-right`
- مراعاة `RTL/LTR`

- استخراج layout أو shell مشترك للصفحات ذات البنية:
- `sticky hero`
- ثم `content-section`

- تقليل تكرار منطق:
- `lockPageScroll`
- `unlockPageScroll`
- `gsap.registerPlugin(ScrollTrigger)`

## قواعد تقلل التوكن والسياق

- عند تعديل شاشة، اقرأ فقط:
- الصفحة نفسها
- الـ block المرتبط
- المكونات المشتركة المستخدمة فعليًا
- composables المرتبطة
- لا تفتح ملفات كثيرة غير مرتبطة بالمهمة.

- قبل كتابة مكون جديد:
- ابحث أولًا داخل:
- `app/components/ui`
- `app/components/blocks`
- `app/components/graphics`
- قد يكون هناك مكون موجود أصلًا يمكن إعادة استخدامه أو تطويره بدل إنشاء واحد جديد.

- لا تكرر نفس CSS إذا كان يمكن تحويله إلى:
- utility class
- CSS variable
- shared component

- لا تنقل منطقًا بصريًا عامًا إلى كل شاشة.
- الأفضل إنشاء primitive واحدة يعاد استخدامها.

- أي نص أو بيانات ثابتة طويلة:
- تبقى في `i18n` أو `mocks` أو constants
- لا توضع مباشرة داخل عدة مكونات مختلفة.

## قواعد التسمية

- أسماء المكونات تكون واضحة ومباشرة.
- مكونات الصفحة تأخذ اسم الصفحة + اسم القسم:
- `HomeHero`
- `AboutHero`
- `ProjectsHero`
- `AboutAward`

- المكونات المشتركة تأخذ اسمًا generic:
- `SectionTitle`
- `ContactSection`
- `LeftSideContent`
- `RightSideContent`

- composables تبدأ دائمًا بـ `use`.

## طريقة اتخاذ القرار قبل أي تعديل

- اسأل أولًا:
- هل هذا الجزء خاص بهذه الشاشة فعلًا؟
- هل يتكرر أو سيتكرر قريبًا؟
- هل ينبغي أن يكون `ui` أو `block` أو `composable`؟
- هل نحن نضيف مكتبة جديدة بدون داعٍ بينما الموجود يكفي؟
- هل نستطيع تقليل الكود عبر توحيد السلوك بدل نسخه؟

## ما يجب تجنبه

- ملفات صفحة ضخمة تحتوي كل شيء.
- تكرار scroll setup بين الصفحات.
- تكرار animation setup بين الصفحات.
- استخدام مكتبات متعددة للحركة داخل نفس المشروع.
- إنشاء shared component قبل التأكد من وجود احتياج حقيقي له.
- ترك مكونات مشتركة داخل مجلد شاشة واحدة بينما تستخدمها أكثر من شاشة.
- خلط البيانات، العرض، والحركة داخل ملف واحد بدون فصل منطقي.

## المعيار المتوقع من أي مساهمة جديدة

- تحافظ على الهوية الحالية للمشروع.
- تتبع نفس نظام الحركة.
- تقلل التكرار بدل زيادته.
- تقسّم الشاشة إلى مكونات قدر الإمكان بدون مبالغة.
- تستخرج المشترك عندما يثبت أنه مشترك.
- تبقي الصفحة خفيفة وواضحة.
- تجعل قراءة الملفات أسرع وأسهل للنماذج والمطورين.
