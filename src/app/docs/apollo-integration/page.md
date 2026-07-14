---
title: Apollo integration
nextjs:
  metadata:
    description: Connect Nestled Forms fields to your GraphQL API with Apollo-powered search selects — debounced queries, loading states, and server-side filtering built in.
---

Connect form fields directly to your GraphQL API with Apollo-powered search selects — debounced queries, loading states, and server-side filtering built in. {% .lead %}

{% callout type="warning" title="Breaking change: Apollo is now an opt-in adapter" %}
The main `@nestledjs/forms` bundle no longer contains or imports `@apollo/client`. To use `searchSelectApollo` or `searchSelectMultiApollo`, wrap your app with `<ApolloSearchProvider>` from `@nestledjs/forms/apollo`, placed inside your existing `<ApolloProvider>`. Without it, Apollo search fields throw an error at render time with these setup instructions. Apps that don't use Apollo fields no longer need `@apollo/client` installed at all.
{% /callout %}

---

## Setup

Install Apollo Client and GraphQL:

```shell
npm install @apollo/client graphql
```

Both Apollo Client v3 and v4 are supported.

Wrap your app with `<ApolloSearchProvider>` from `@nestledjs/forms/apollo`, placed inside your existing `<ApolloProvider>`:

```tsx
import { ApolloClient, InMemoryCache } from '@apollo/client'
import { ApolloProvider } from '@apollo/client/react'
import { ApolloSearchProvider } from '@nestledjs/forms/apollo'

const client = new ApolloClient({
  uri: 'https://your-api.com/graphql',
  cache: new InMemoryCache(),
})

function App() {
  return (
    <ApolloProvider client={client}>
      <ApolloSearchProvider>
        <MyForm />
      </ApolloSearchProvider>
    </ApolloProvider>
  )
}
```

On React Native, import the same component from `@nestledjs/forms-native/apollo`:

```tsx
import { ApolloSearchProvider } from '@nestledjs/forms-native/apollo'
```

Native Apollo search fields are now fully functional, including server-side search — earlier releases shipped non-working stubs.

The `@nestledjs/forms/apollo` subpath is the only entry point that imports `@apollo/client` — the main `@nestledjs/forms` import stays Apollo-free, so `@apollo/client` remains an optional dependency.

---

## SearchSelectApollo

A single-select dropdown that searches your GraphQL API as the user types.

```tsx
import { gql } from '@apollo/client'

const SEARCH_USERS = gql`
  query SearchUsers($search: String!) {
    users(where: { name: { contains: $search, mode: insensitive } }) {
      id
      name
      email
      avatar
    }
  }
`

FormFieldClass.searchSelectApollo('userId', {
  label: 'Assign To',
  required: true,
  placeholder: 'Search users...',
  document: SEARCH_USERS,
  dataType: 'users',
  searchFields: ['name', 'email'],
  selectOptionsFunction: (users) =>
    users.map((user) => ({
      value: user.id,
      label: `${user.name} (${user.email})`,
    })),
})
```

### Configuration options

| Option                  | Type                       | Description                                              |
| ----------------------- | -------------------------- | -------------------------------------------------------- |
| `document`              | `DocumentNode`             | The GraphQL query to execute                             |
| `dataType`              | `string`                   | The key in the query result that contains the data array |
| `searchFields`          | `string[]`                 | Fields to include in the search filter                   |
| `selectOptionsFunction` | `(data) => SelectOption[]` | Maps query results to `{ value, label }` options         |
| `placeholder`           | `string`                   | Placeholder text for the search input                    |

---

## SearchSelectMultiApollo

A multi-select variant that allows selecting multiple results from a GraphQL search.

```tsx
const SEARCH_TAGS = gql`
  query SearchTags($search: String!) {
    tags(where: { name: { contains: $search } }, take: 20) {
      id
      name
      color
    }
  }
`

FormFieldClass.searchSelectMultiApollo('tagIds', {
  label: 'Tags',
  placeholder: 'Search tags...',
  document: SEARCH_TAGS,
  dataType: 'tags',
  searchFields: ['name'],
  selectOptionsFunction: (tags) =>
    tags.map((tag) => ({
      value: tag.id,
      label: tag.name,
    })),
})
```

The value returned on submit is an array of selected values.

---

## How search works

### Query lifecycle

1. **User types** in the search input
2. **Debounce** waits 500ms after the user stops typing
3. **GraphQL query** is sent with the search string
4. **Results** are mapped through `selectOptionsFunction`
5. **Dropdown** shows the mapped options
6. **Selection** stores the chosen value(s)

### Search variables

The query receives a `$search` variable containing the user's input. Your query should use this to filter results:

```graphql
query SearchProducts($search: String!) {
  products(
    where: {
      OR: [
        { name: { contains: $search, mode: insensitive } }
        { sku: { contains: $search } }
      ]
    }
    take: 20
  ) {
    id
    name
    sku
    price
  }
}
```

### Initial load

When the dropdown first opens (before the user types), an empty search is sent. Your query should handle this gracefully — return recent/popular items or an empty list.

---

## Clearing selections

Apollo search selects support multiple ways to clear:

- **Clear button (X)**: Appears when a value is selected; click to clear
- **Delete text**: Manually delete the text in the search input
- **Backspace**: Press backspace on an empty search input

When cleared, the component refetches data with an empty search string.

---

## Loading states

Apollo search selects show a loading indicator while the query is in flight. The dropdown displays a spinner or "Loading..." text until results arrive.

---

## Error handling

If the GraphQL query fails, the search select gracefully handles the error — the dropdown remains empty and the user can retry by typing again.

---

## Advanced patterns

### Multi-field search

Search across multiple fields by designing your query accordingly:

```tsx
const SEARCH_CONTACTS = gql`
  query SearchContacts($search: String!) {
    contacts(
      where: {
        OR: [
          { firstName: { contains: $search, mode: insensitive } }
          { lastName: { contains: $search, mode: insensitive } }
          { email: { contains: $search, mode: insensitive } }
          { company: { contains: $search, mode: insensitive } }
        ]
      }
      take: 15
    ) {
      id
      firstName
      lastName
      email
      company
    }
  }
`

FormFieldClass.searchSelectApollo('contactId', {
  label: 'Contact',
  document: SEARCH_CONTACTS,
  dataType: 'contacts',
  searchFields: ['firstName', 'lastName', 'email', 'company'],
  selectOptionsFunction: (contacts) =>
    contacts.map((c) => ({
      value: c.id,
      label: `${c.firstName} ${c.lastName} — ${c.company}`,
    })),
})
```

### Rich option labels

```tsx
selectOptionsFunction: (products) =>
  products.map((p) => ({
    value: p.id,
    label: `${p.name} (${p.sku}) — $${p.price}`,
  })),
```

### Conditional Apollo search

```tsx
FormFieldClass.searchSelectApollo('teamId', {
  label: 'Team',
  document: SEARCH_TEAMS,
  dataType: 'teams',
  searchFields: ['name'],
  selectOptionsFunction: (teams) =>
    teams.map((t) => ({ value: t.id, label: t.name })),
  showWhen: (values) => values.role === 'member',
  requiredWhen: (values) => values.role === 'member',
})
```

### Multiple related Apollo selects

```tsx
const fields = [
  FormFieldClass.searchSelectApollo('organizationId', {
    label: 'Organization',
    document: SEARCH_ORGS,
    dataType: 'organizations',
    searchFields: ['name'],
    selectOptionsFunction: (orgs) =>
      orgs.map((o) => ({ value: o.id, label: o.name })),
  }),
  FormFieldClass.searchSelectApollo('departmentId', {
    label: 'Department',
    document: SEARCH_DEPARTMENTS,
    dataType: 'departments',
    searchFields: ['name'],
    selectOptionsFunction: (depts) =>
      depts.map((d) => ({ value: d.id, label: d.name })),
    showWhen: (values) => !!values.organizationId,
  }),
]
```

---

## Custom adapters

Apollo is just the built-in adapter. You can back the same search select fields with any data layer — urql, TanStack Query, or plain `fetch` — by implementing the `UseSearchQuery` hook type from `@nestledjs/forms-core` and passing it to `<SearchQueryProvider>`. With a custom adapter, `@apollo/client` never needs to be installed.

The adapter is a React hook with this signature:

```tsx
import type { UseSearchQuery } from '@nestledjs/forms-core'

type UseSearchQuery = (
  document, // the GraphQL document from the field definition
  options?: { variables?: Record<string, unknown> },
) => {
  data: TData | undefined
  loading: boolean
  refetch: (variables?) => Promise<{ data?: TData }>
}
```

Define the hook at module level (not inline) and make sure the returned `data` is referentially stable between renders unless the result actually changed — GraphQL clients guarantee this, and hand-rolled adapters must too, or consuming fields will re-render in a loop.

Then provide it to your app:

```tsx
import { SearchQueryProvider } from '@nestledjs/forms-core'
import { useMySearchQuery } from './my-search-adapter'

function App() {
  return (
    <SearchQueryProvider useSearchQuery={useMySearchQuery}>
      <MyForm />
    </SearchQueryProvider>
  )
}
```

`searchSelectApollo` and `searchSelectMultiApollo` fields will now fetch their options through your hook instead of Apollo Client.

---

## Without Apollo

If you don't need server-side search at all, use the standard `searchSelect` and `searchSelectMulti` fields with static options:

```tsx
FormFieldClass.searchSelect('country', {
  label: 'Country',
  options: countries.map((c) => ({ value: c.code, label: c.name })),
})
```

For server-side search backed by a client other than Apollo, see [Custom adapters](#custom-adapters) above.
