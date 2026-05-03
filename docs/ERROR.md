# Error Page (404 / 500)

## File
`app/error.vue`

Nuxt's global error boundary — rendered automatically for any unhandled route or runtime error.

---

## Design

- Background: always `#000000` (independent of color mode)
- Font: `DotGothic16` (pixel font)
- Layout: full-screen centered column

### Elements

| Element | Description |
|---------|-------------|
| `( 404 )` | Large pixel text with parenthesis brackets |
| Subtitle | "Page not Found" or "Something went wrong" |
| Button | "Go Home" — clears error and redirects to `/` |

### Button states
| State | Style |
|-------|-------|
| Default | Green fill (`#54ea62`), black text |
| Hover | Transparent, white text, white border |

---

## Props

| Prop | Type | Description |
|------|------|-------------|
| `error` | `NuxtError` | Injected by Nuxt automatically |

## Logic

```ts
const statusCode = computed(() => props.error.statusCode ?? 500)
const isNotFound = computed(() => statusCode.value === 404)

function handleError() {
  clearError({ redirect: '/' })
}
```

Subtitle switches between `"Page not Found"` and `"Something went wrong"` based on `statusCode`.
