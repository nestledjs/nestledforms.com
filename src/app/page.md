---
title: Getting started
---

Build type-safe, validated forms in React and React Native with 24+ field types, conditional logic, theming, and Apollo GraphQL integration — declaratively or imperatively. {% .lead %}

{% quick-links %}

{% quick-link title="Installation" icon="installation" href="/docs/installation" description="Install @nestledjs/forms for web or @nestledjs/forms-native for React Native and start building forms in minutes." /%}

{% quick-link title="Core concepts" icon="presets" href="/docs/core-concepts" description="Understand declarative vs imperative usage, FormFieldClass, and how the form system works under the hood." /%}

{% quick-link title="Web form fields" icon="plugins" href="/docs/web/text-fields" description="Explore all 24+ field types available for web forms — text, select, search, date, markdown, and more." /%}

{% quick-link title="Native form fields" icon="theming" href="/docs/native/overview" description="Build forms for React Native with the same API and field types, adapted for mobile." /%}

{% /quick-links %}

Nestled Forms is a form library for React (web) and React Native that gives you complete control over form fields, validation, conditional logic, and theming. It ships as three packages — `@nestledjs/forms` for web, `@nestledjs/forms-native` for React Native, and `@nestledjs/forms-core` as the shared foundation.

---

## Quick start

Get a working form running in under a minute.

### Install the package

```shell
npm install @nestledjs/forms
# or
pnpm add @nestledjs/forms
```

### Create a form declaratively

```tsx
import { Form, FormFieldClass } from '@nestledjs/forms'

const fields = [
  FormFieldClass.text('name', { label: 'Full Name', required: true }),
  FormFieldClass.email('email', { label: 'Email', required: true }),
  FormFieldClass.select('role', {
    label: 'Role',
    options: [
      { value: 'admin', label: 'Admin' },
      { value: 'editor', label: 'Editor' },
      { value: 'viewer', label: 'Viewer' },
    ],
  }),
]

export function SignupForm() {
  return (
    <Form
      id="signup"
      fields={fields}
      submit={(values) => console.log(values)}
    >
      <button type="submit">Create Account</button>
    </Form>
  )
}
```

### Or use the imperative API

```tsx
import { Form, RenderFormField, FormFieldClass } from '@nestledjs/forms'

export function SignupForm() {
  return (
    <Form id="signup" submit={(values) => console.log(values)}>
      <RenderFormField field={FormFieldClass.text('name', { label: 'Full Name', required: true })} />
      <RenderFormField field={FormFieldClass.email('email', { label: 'Email', required: true })} />
      <button type="submit">Create Account</button>
    </Form>
  )
}
```

{% callout title="Declarative or imperative?" %}
Use the **declarative** API when you want to define all fields upfront in an array — it's concise and great for standard forms. Use the **imperative** API when you need fine-grained control over layout or want to mix form fields with custom components. You can even combine both approaches in a single form. [Learn more →](/docs/core-concepts)
{% /callout %}

---

## What you get

Nestled Forms is designed to handle every form scenario you'll encounter in a real application, from simple contact forms to complex multi-step workflows.

### 24+ field types

Text, email, password, URL, phone, number, currency, checkbox, switch, radio, select, multi-select, enum select, search select (with Apollo variants), date picker, time picker, datetime picker, markdown editor, content display, custom fields, and buttons.

### Two platforms, one API

`@nestledjs/forms` for React web applications and `@nestledjs/forms-native` for React Native — both share the same `FormFieldClass` factory, the same field options, and the same validation system via `@nestledjs/forms-core`.

### Conditional logic on every field

Every field supports `showWhen`, `requiredWhen`, `disabledWhen`, and `validateWhen` — functions that receive the current form values and return a boolean. Show a field only when a checkbox is checked, make a field required based on a dropdown selection, or disable fields based on complex conditions.

### Built-in validation

Validate with simple functions, Zod schemas, or cross-field validation. Support for async validation (like checking if an email exists), validation groups for multi-step forms, and custom error messages.

### Full theming system

Ships with a Tailwind CSS theme by default. Create custom themes that control every visual detail — input styles, labels, errors, help text, dropdowns, and more. Themes can be applied globally or per-form.

### Apollo GraphQL integration

Search select fields that query your GraphQL API with debounced search, loading states, and custom data mapping. Both single and multi-select variants available.

---

## The three packages

### @nestledjs/forms

The web forms library. Provides React components for all 24+ field types with Tailwind CSS theming, Apollo GraphQL search selects, markdown editor integration, and full keyboard accessibility.

### @nestledjs/forms-native

The React Native forms library. Same field types and API adapted for native mobile components. Uses React Native primitives, `expo-checkbox`, `react-native-element-dropdown`, and other native libraries.

### @nestledjs/forms-core

The shared foundation. Contains `FormFieldClass`, all TypeScript types, form context providers, validation utilities, currency helpers, and date/time formatting. Used internally by both the web and native packages.

---

## Getting help

### Submit an issue

Found a bug or have a feature request? Visit our [GitHub repository](https://github.com/nestledjs/nestled-forms) to report bugs, request features, or submit pull requests.

### Join the community

Connect with other developers through GitHub Discussions, browse real-world examples, and stay up to date with the latest releases.
