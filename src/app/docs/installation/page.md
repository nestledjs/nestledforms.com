---
title: Installation
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

The web forms package requires React as a peer dependency. If you're using features like the markdown editor or Apollo search selects, install their optional dependencies as needed.

### Basic setup

No additional configuration is required. Import and use the form components directly:

```tsx
import { Form, FormFieldClass } from '@nestledjs/forms'

export function MyForm() {
  return (
    <Form
      id="my-form"
      fields={[
        FormFieldClass.text('name', { label: 'Name', required: true }),
      ]}
      submit={(values) => console.log(values)}
    >
      <button type="submit">Submit</button>
    </Form>
  )
}
```

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

If you plan to use `searchSelectApollo` or `searchSelectMultiApollo`, install Apollo Client:

```shell
npm install @apollo/client graphql
```

Your application must be wrapped in an `ApolloProvider` for these fields to work.

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

### Basic setup

```tsx
import { NativeForm, FormFieldClass } from '@nestledjs/forms-native'

export function MyForm() {
  return (
    <NativeForm
      id="my-form"
      fields={[
        FormFieldClass.text('name', { label: 'Name', required: true }),
      ]}
      submit={(values) => console.log(values)}
    />
  )
}
```

---

## Package architecture

Nestled Forms is structured as three packages:

| Package | Purpose | Depends on |
| --- | --- | --- |
| `@nestledjs/forms-core` | Shared types, `FormFieldClass`, validation, utilities | — |
| `@nestledjs/forms` | Web React components, Tailwind theme | `forms-core` |
| `@nestledjs/forms-native` | React Native components, native theme | `forms-core` |

You never need to install `@nestledjs/forms-core` directly — it's included as a dependency of both `@nestledjs/forms` and `@nestledjs/forms-native`. All exports from `forms-core` (like `FormFieldClass`, types, hooks) are re-exported from both platform packages.

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

<Form<SignupValues>
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
