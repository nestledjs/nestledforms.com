---
title: Search select fields
---

Searchable dropdown fields with typeahead filtering — including variants that query a GraphQL API via Apollo Client. {% .lead %}

---

## SearchSelect

A searchable single-select dropdown. Users can type to filter through options.

```tsx
FormFieldClass.searchSelect('assignee', {
  label: 'Assign To',
  required: true,
  placeholder: 'Search team members...',
  options: [
    { value: 'user-1', label: 'Alice Johnson' },
    { value: 'user-2', label: 'Bob Smith' },
    { value: 'user-3', label: 'Carol Williams' },
    // ...potentially hundreds of options
  ],
})
```

### SearchSelect-specific options

| Option        | Type             | Default       | Description                         |
| ------------- | ---------------- | ------------- | ----------------------------------- |
| `options`     | `SelectOption[]` | `[]`          | Array of `{ value, label }` objects |
| `placeholder` | `string`         | `'Search...'` | Placeholder text                    |

### Clearing a selection

Search selects support multiple ways to clear the current value:

- Click the **X** (clear) button that appears when a value is selected
- Manually delete the text in the search input
- Press **Backspace** on an empty search input

**When to use SearchSelect vs Select:** Use search select when you have more than 8-10 options or when users will benefit from typing to filter. For short lists, a standard `select` is simpler.

---

## SearchSelectApollo

A searchable single-select that queries your GraphQL API via Apollo Client. Ideal for searching large datasets server-side.

```tsx
import { gql } from '@apollo/client'

const SEARCH_USERS = gql`
  query SearchUsers($search: String!) {
    users(where: { name: { contains: $search } }) {
      id
      name
      email
    }
  }
`

FormFieldClass.searchSelectApollo('userId', {
  label: 'Select User',
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

### SearchSelectApollo-specific options

| Option                  | Type                       | Default       | Description                                       |
| ----------------------- | -------------------------- | ------------- | ------------------------------------------------- |
| `document`              | `DocumentNode`             | —             | GraphQL query document                            |
| `dataType`              | `string`                   | —             | Key in the query result containing the data array |
| `searchFields`          | `string[]`                 | —             | Fields to include in the search query             |
| `selectOptionsFunction` | `(data) => SelectOption[]` | —             | Maps query results to select options              |
| `placeholder`           | `string`                   | `'Search...'` | Placeholder text                                  |

### How it works

1. User types in the search input
2. After a 500ms debounce, a GraphQL query is sent with the search string
3. Results are mapped through `selectOptionsFunction` to create dropdown options
4. When the user selects an option, the value is stored
5. Clearing the selection triggers a data refetch

{% callout title="Apollo Provider required" %}
Your application must be wrapped in an `ApolloProvider` for Apollo search selects to work. The field will not render correctly without a configured Apollo Client.
{% /callout %}

---

## SearchSelectMulti

A searchable multi-select dropdown. Users can type to filter and select multiple options.

```tsx
FormFieldClass.searchSelectMulti('tags', {
  label: 'Tags',
  placeholder: 'Search tags...',
  options: [
    { value: 'frontend', label: 'Frontend' },
    { value: 'backend', label: 'Backend' },
    { value: 'design', label: 'Design' },
    { value: 'devops', label: 'DevOps' },
    { value: 'mobile', label: 'Mobile' },
    { value: 'security', label: 'Security' },
  ],
})
```

### SearchSelectMulti-specific options

| Option        | Type             | Default       | Description                         |
| ------------- | ---------------- | ------------- | ----------------------------------- |
| `options`     | `SelectOption[]` | `[]`          | Array of `{ value, label }` objects |
| `placeholder` | `string`         | `'Search...'` | Placeholder text                    |

The value returned on submit is an array of selected values: `['frontend', 'backend']`.

---

## SearchSelectMultiApollo

A searchable multi-select that queries your GraphQL API via Apollo Client.

```tsx
const SEARCH_CATEGORIES = gql`
  query SearchCategories($search: String!) {
    categories(where: { name: { contains: $search } }) {
      id
      name
    }
  }
`

FormFieldClass.searchSelectMultiApollo('categoryIds', {
  label: 'Categories',
  placeholder: 'Search categories...',
  document: SEARCH_CATEGORIES,
  dataType: 'categories',
  searchFields: ['name'],
  selectOptionsFunction: (categories) =>
    categories.map((cat) => ({
      value: cat.id,
      label: cat.name,
    })),
})
```

### SearchSelectMultiApollo-specific options

Same as `SearchSelectApollo` — `document`, `dataType`, `searchFields`, `selectOptionsFunction`, and `placeholder`.

---

## Common patterns

### User picker with avatar-style labels

```tsx
FormFieldClass.searchSelectApollo('reviewerId', {
  label: 'Reviewer',
  document: SEARCH_TEAM_MEMBERS,
  dataType: 'teamMembers',
  searchFields: ['name', 'email'],
  selectOptionsFunction: (members) =>
    members.map((m) => ({
      value: m.id,
      label: `${m.name} — ${m.role}`,
    })),
})
```

### Conditional search field

```tsx
FormFieldClass.searchSelectApollo('managerId', {
  label: 'Manager',
  document: SEARCH_MANAGERS,
  dataType: 'users',
  searchFields: ['name'],
  selectOptionsFunction: (users) =>
    users.map((u) => ({ value: u.id, label: u.name })),
  showWhen: (values) => values.role !== 'admin',
  requiredWhen: (values) => values.role === 'employee',
})
```

### Pre-populated search

Use `defaultValue` with the value string to pre-select an option:

```tsx
FormFieldClass.searchSelect('category', {
  label: 'Category',
  defaultValue: 'tech',
  options: categoryOptions,
})
```

For Apollo variants, set `defaultValue` to the ID and the field will display the matching option when the query loads.
