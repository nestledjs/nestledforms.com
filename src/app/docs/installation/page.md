---
title: Installation
nextjs:
  metadata:
    description: Install @nestledjs/forms for React web or @nestledjs/forms-native for React Native and start building type-safe forms in minutes.
---

Get Nestled Forms installed and running in your React or React Native project. {% .lead %}

---

## Web forms (@nestledjs/forms)

### Prerequisites

- React 18+ or React 19
- Node.js 18+
- A package manager (npm, pnpm, or yarn)

### Install

```shell
npm install @nestledjs/forms
# or
pnpm add @nestledjs/forms
# or
yarn add @nestledjs/forms
```

### Peer dependencies

The following packages are required peer dependencies:

```shell
npm install react react-hook-form zod @hookform/resolvers
```

With pnpm or npm v7+, peer dependencies are installed automatically when you add `@nestledjs/forms`. On npm v6 or Yarn v1, install them explicitly with the command above.

If you're using features like the markdown editor or Apollo search selects, install their optional dependencies as needed.

### Basic setup

No additional configuration is required. Import and use the form components directly:

```tsx
import { Form, FormFieldClass } from '@nestledjs/forms'

export function MyForm() {
  return (
    <Form
      id="my-form"
      fields={[FormFieldClass.text('name', { label: 'Name', required: true })]}
      submit={(values) => console.log(values)}
    >
      <button type="submit">Submit</button>
    </Form>
  )
}
```

### Subpath exports

Optional features live behind subpath exports so the main bundle stays small (~114 KB, down from 414 KB):

| Subpath                     | Exports                                        | Purpose                                    |
| --------------------------- | ---------------------------------------------- | ------------------------------------------ |
| `@nestledjs/forms/apollo`   | `ApolloSearchProvider`, `useApolloSearchQuery` | Apollo adapter for GraphQL search selects  |
| `@nestledjs/forms/phone`    | `PhoneField`                                   | Direct import of the phone field component |
| `@nestledjs/forms/markdown` | Markdown editor component                      | Direct import of the markdown editor       |

{% callout type="warning" title="Breaking change: PhoneField import moved" %}
`PhoneField` is no longer exported from `@nestledjs/forms` — import it from `@nestledjs/forms/phone` instead. Declarative usage via the `fields` array is unaffected: `PhoneField` is lazy-loaded automatically, keeping ~150 KB of libphonenumber metadata out of the main bundle.
{% /callout %}

### Optional: Markdown editor

If you plan to use the `markdownEditor` field type, install the MDX editor:

```shell
npm install @mdxeditor/editor
```

Then import its CSS in your application's entry point:

```tsx
import '@mdxeditor/editor/style.css'
```

### Optional: Apollo GraphQL search selects

If you plan to use `searchSelectApollo` or `searchSelectMultiApollo`, install Apollo Client (v3 or v4 — both are supported):

```shell
npm install @apollo/client graphql
```

Then wrap your app with `<ApolloSearchProvider>` from `@nestledjs/forms/apollo`, placed inside your existing `<ApolloProvider>`:

```tsx
import { ApolloProvider } from '@apollo/client/react'
import { ApolloSearchProvider } from '@nestledjs/forms/apollo'

;<ApolloProvider client={client}>
  <ApolloSearchProvider>
    <App />
  </ApolloSearchProvider>
</ApolloProvider>
```

The main `@nestledjs/forms` bundle never imports `@apollo/client` — only the `/apollo` subpath does. You can also back search selects with a different data layer entirely; see [Apollo integration → Custom adapters](/docs/apollo-integration#custom-adapters).

---

## React Native forms (@nestledjs/forms-native)

### Prerequisites

- React Native 0.72+
- React 18+
- Expo (recommended) or bare React Native

### Install

```shell
npm install @nestledjs/forms-native
# or
pnpm add @nestledjs/forms-native
```

### Peer dependencies

The following packages are required peer dependencies:

```shell
npm install react react-native react-hook-form zod @hookform/resolvers
```

With pnpm or npm v7+, peer dependencies are installed automatically when you add `@nestledjs/forms-native`. On npm v6 or Yarn v1, install them explicitly with the command above.

### Optional native dependencies

Install these based on which field types you need:

```shell
# For checkbox fields
npx expo install expo-checkbox

# For dropdown/select fields
npm install react-native-element-dropdown

# For date/time pickers
npm install @react-native-community/datetimepicker

# For phone number input
npm install react-native-phone-number-input

# For markdown display
npm install react-native-markdown-display

# For Apollo GraphQL search selects
npm install @apollo/client graphql
```

For Apollo search selects, also wrap your app with `<ApolloSearchProvider>` from `@nestledjs/forms-native/apollo` (inside your `<ApolloProvider>`), the same as on web.

### Basic setup

```tsx
import { NativeForm, FormFieldClass } from '@nestledjs/forms-native'

export function MyForm() {
  return (
    <NativeForm
      id="my-form"
      fields={[FormFieldClass.text('name', { label: 'Name', required: true })]}
      submit={(values) => console.log(values)}
    />
  )
}
```

---

## Package architecture

Nestled Forms is structured as three packages:

| Package                   | Purpose                                               | Depends on   |
| ------------------------- | ----------------------------------------------------- | ------------ |
| `@nestledjs/forms-core`   | Shared types, `FormFieldClass`, validation, utilities | —            |
| `@nestledjs/forms`        | Web React components, Tailwind theme                  | `forms-core` |
| `@nestledjs/forms-native` | React Native components, native theme                 | `forms-core` |

You never need to install `@nestledjs/forms-core` directly — it's included as a dependency of both `@nestledjs/forms` and `@nestledjs/forms-native`. All exports from `forms-core` (like `FormFieldClass`, types, hooks) are re-exported from both platform packages.

All three packages expose the Apollo adapter under an `/apollo` subpath (`@nestledjs/forms/apollo`, `@nestledjs/forms-native/apollo`, `@nestledjs/forms-core/apollo`), so `@apollo/client` is only pulled in where you explicitly import it.

---

## TypeScript

Nestled Forms is written in TypeScript and ships with full type definitions. No additional `@types` packages are needed.

The `Form` component accepts a generic type parameter for type-safe form values:

```tsx
interface SignupValues {
  name: string
  email: string
  role: string
}

;<Form<SignupValues>
  id="signup"
  fields={fields}
  submit={(values) => {
    // values is typed as SignupValues
    console.log(values.name, values.email, values.role)
  }}
>
  <button type="submit">Submit</button>
</Form>
```

---

## Verify installation

Create a simple form to verify everything is working:

```tsx
import { Form, FormFieldClass } from '@nestledjs/forms'

const fields = [
  FormFieldClass.text('greeting', {
    label: 'Say hello',
    placeholder: 'Type something...',
    required: true,
  }),
]

export function TestForm() {
  return (
    <Form
      id="test"
      fields={fields}
      submit={(values) => alert(`Hello, ${values.greeting}!`)}
    >
      <button type="submit">Submit</button>
    </Form>
  )
}
```

If the form renders with a labeled text input and submits correctly, you're ready to go.
