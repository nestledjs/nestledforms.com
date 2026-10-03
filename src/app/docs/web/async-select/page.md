---
title: Async search selects
nextjs:
  metadata:
    description: Load search-select options from any async backend — REST, tRPC, or plain fetch — with the loadOptions callback. No GraphQL required.
---

Load search-select options from any async backend — REST, tRPC, or plain `fetch` — with a single `loadOptions` callback. No GraphQL required. {% .lead %}

{% callout title="Added in 0.8.0" %}
`loadOptions` works on `searchSelect` and `searchSelectMulti`. For Apollo/GraphQL-backed selects, see [Apollo integration](/docs/apollo-integration) instead.
{% /callout %}

---

## Basic usage

Pass a `loadOptions` function to `searchSelect`. It receives the current search term and returns a promise of options. It's called once with an empty string (`''`) on mount to populate the initial list, then again with each debounced search term the user types.

```tsx
import { FormFieldClass } from '@nestledjs/forms'

FormFieldClass.searchSelect('user', {
  label: 'User',
  options: [],
  loadOptions: async (search) =>
    (
      await fetch(`/api/users?q=${encodeURIComponent(search)}`).then((r) =>
        r.json(),
      )
    ).map((u) => ({ value: u.id, label: u.name })),
})
```

Provide `options: []` as the starting point — `loadOptions` takes over from there.

---

## How it works

- **Initial load** — `loadOptions('')` runs on mount, so the dropdown has options before the user types.
- **Debounced search** — as the user types, the term is debounced and passed to `loadOptions`, so you filter server-side.
- **Stale responses are ignored** — if a slower request resolves after a newer one, its results are discarded, so the dropdown always reflects the latest search.
- **Loading state** — the field shows the `loading` string (see [Localization](/docs/localization)) while a request is in flight.

---

## With tRPC

Any async source works — return `{ value, label }[]` from wherever your data lives:

```tsx
FormFieldClass.searchSelect('customer', {
  label: 'Customer',
  options: [],
  loadOptions: async (search) => {
    const customers = await trpc.customers.search.query({ q: search })
    return customers.map((c) => ({ value: c.id, label: c.displayName }))
  },
})
```

---

## Multi-select

`searchSelectMulti` takes the same `loadOptions` callback and lets the user pick several options:

```tsx
FormFieldClass.searchSelectMulti('tags', {
  label: 'Tags',
  options: [],
  loadOptions: async (search) => {
    const tags = await fetch(`/api/tags?q=${encodeURIComponent(search)}`).then(
      (r) => r.json(),
    )
    return tags.map((t) => ({ value: t.id, label: t.name }))
  },
})
```

---

## Choosing an approach

| Field                             | Source                | Use when                                                                       |
| --------------------------------- | --------------------- | ------------------------------------------------------------------------------ |
| `searchSelect` with `options`     | Static array          | You have all options up front                                                  |
| `searchSelect` with `loadOptions` | REST / tRPC / `fetch` | Options come from an async, searchable backend                                 |
| `searchSelectApollo`              | GraphQL via Apollo    | Your data layer is Apollo — see [Apollo integration](/docs/apollo-integration) |
