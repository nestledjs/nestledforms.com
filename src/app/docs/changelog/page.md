---
title: Changelog
nextjs:
  metadata:
    description: Release notes for the @nestledjs form packages — breaking changes, new features, and fixes, versioned together across forms-core, forms, and forms-native.
---

Release notes for the `@nestledjs` form packages. The three packages — `@nestledjs/forms-core`, `@nestledjs/forms`, and `@nestledjs/forms-native` — are versioned together. {% .lead %}

---

## 0.8.0

First release since 0.7.8 (April 2026). This is a **breaking** release — the headline change is that Apollo/GraphQL is no longer bundled, and a couple of field imports moved to subpaths. Most apps upgrade with a few small changes; see [Migration](#migration-from-0-7-x) below.

### Breaking changes

{% callout type="warning" title="Apollo is no longer bundled" %}
The main `@nestledjs/forms` bundle no longer imports `@apollo/client`. Search selects now fetch options through a pluggable adapter, so apps without GraphQL pay nothing for it (bundle dropped from ~414 KB to ~114 KB). To keep the Apollo-powered fields, wrap your app in `<ApolloSearchProvider>` from `@nestledjs/forms/apollo`, inside your existing `<ApolloProvider>`. See [Apollo integration](/docs/apollo-integration).
{% /callout %}

- **Apollo is opt-in via an adapter.** Use `<ApolloSearchProvider>` from `@nestledjs/forms/apollo`, or provide your own client (urql, TanStack Query, plain `fetch`) via `<SearchQueryProvider>` from `@nestledjs/forms-core`.
- **Phone field moved to a subpath** — import it from `@nestledjs/forms/phone`.
- **Required-only fields now enforce validation.** A field marked `required` with no other rules now blocks submit until filled.
- **Themed validation errors on native / `noValidate` forms** — error display routes through the theme, so custom themes control the error UI.
- **Native submit pipeline change** — `@nestledjs/forms-native` drives submit through a dedicated submit context.

### New features

- **Localization** via the `strings` prop on `Form` / `NativeForm`. Override any user-facing string per form; untouched keys keep their English defaults. See [Localization](/docs/localization).
- **`FormFieldClass.multiSelect(...)`** factory for multi-select fields.
- **`loadOptions` async search selects** — load options from REST, tRPC, or `fetch`, no GraphQL required. See [Async search selects](/docs/web/async-select).

### Fixes & hardening

- Markdown rendering hardened against XSS.
- Timezone bugs fixed in the date/time helpers.
- Eliminated a double initial fetch in the search-select base.
- Accessibility fixes across field error states.
- `submitTransform` default handling and resolver required-enforcement fixes.

### Migration from 0.7.x

1. If you use Apollo search selects, add `<ApolloSearchProvider>` (from `@nestledjs/forms/apollo`) inside your `<ApolloProvider>`. For a non-Apollo GraphQL/REST client, wire `<SearchQueryProvider>` instead.
2. Update phone-field imports to `@nestledjs/forms/phone`.
3. Re-test any forms that use required-only fields — they now validate.
4. Re-check custom error styling on native / `noValidate` forms.
