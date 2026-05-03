# Contact Page

## Route
`/contact`

---

## Component Tree

```
pages/contact/index.vue
  ├── ContactHero.vue          ← full-screen layout: heading + form
  │     ├── ContactForm.vue    ← Name / Email / Message fields + Submit
  │     ├── LeftSideContent.vue
  │     ├── RightSideContent.vue
  │     └── CustomCursor.vue
  └── ContactSection.vue       ← footer block: contact info + social links
```

---

## ContactHero

**File:** `app/components/blocks/contact/ContactHero.vue`

Full-screen hero using the shared `.app-container` / `.top-section` / rail layout. Center content splits into two columns:

| Column | Content |
|--------|---------|
| Left   | "Let's / Work / Together!" heading + pixel character (`/icons/svg/green/12.svg`) |
| Right  | `ContactForm` component |

**i18n keys used:**
- `contact.leftText1` — "Let's"
- `contact.leftText2` — "Work"
- `contact.leftText3` — "Together" (empty in Arabic, handled separately)

---

## ContactForm

**File:** `app/components/blocks/contact/ContactForm.vue`

Built entirely with Tailwind CSS. No scoped styles.

### Fields

| Key       | Tag        | Type    |
|-----------|------------|---------|
| `name`    | `input`    | text    |
| `email`   | `input`    | email   |
| `message` | `textarea` | —       |

### Focus behavior
- Each field wrapper has `border-b` with `transition-colors duration-300`
- On focus: `borderColor` → `var(--main-color)` (`#54ea62`)
- On blur: `borderColor` → `rgba(255,255,255,0.4)`

### Submit button
- Default: `bg-[--main-color]` green fill, black text
- Hover: transparent background, white text and border
- Disabled: `opacity-60`, `cursor-not-allowed`

### State
| Ref | Type | Description |
|-----|------|-------------|
| `form` | `{ name, email, message }` | Field values |
| `focused` | `string \| null` | Currently focused field key |
| `submitting` | `boolean` | Loading state during submit |
| `successMsg` | `string` | Shown on success in `--main-color` |
| `errorMsg` | `string` | Shown on failure in red |

### i18n keys used
- `contact.name` — placeholder Name
- `contact.email` — placeholder Email
- `contact.message` — placeholder Message
- `contact.submit` — button label
- `contact.success` — success message
- `contact.error` — error message

---

## ContactSection

**File:** `app/components/ui/ContactSection.vue`

Shared footer block reused across pages. Displays:
- Email + phone
- Address
- CR / VAT numbers
- Social links (Instagram, Vimeo, LinkedIn, X)
- Language toggle + theme toggle + Privacy Policy link

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `bgColor` | `string` | `#000000` | Background color |
| `showTheme` | `boolean` | `true` | Show theme toggle button |
| `borderClasses` | `string` | `border-white` | Left rail border class |

Data comes from `useSettings()`.
