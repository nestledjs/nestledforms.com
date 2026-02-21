---
title: Native forms overview
---

Build forms for React Native with the same API, field types, and validation system as the web — adapted for native mobile components. {% .lead %}

---

## Package: @nestledjs/forms-native

`@nestledjs/forms-native` provides React Native implementations of all 24+ field types from the Nestled Forms library. It shares the same `FormFieldClass` factory, the same field options, and the same validation engine via `@nestledjs/forms-core`.

### Install

```shell
npm install @nestledjs/forms-native
```

### Basic usage

```tsx
import { NativeForm, FormFieldClass } from '@nestledjs/forms-native'

const fields = [
  FormFieldClass.text('name', { label: 'Full Name', required: true }),
  FormFieldClass.email('email', { label: 'Email', required: true }),
  FormFieldClass.phone('phone', { label: 'Phone Number' }),
]

export function ContactForm() {
  return (
    <NativeForm
      id="contact"
      fields={fields}
      submit={(values) => console.log(values)}
    />
  )
}
```

---

## Key differences from web

### Component: NativeForm

On native, use `NativeForm` instead of `Form`:

```tsx
// Web
import { Form } from '@nestledjs/forms'

// Native
import { NativeForm } from '@nestledjs/forms-native'
```

### Theme: NativeTheme

Native uses its own default theme (`NativeTheme`) instead of `tailwindTheme`:

```tsx
import { NativeTheme } from '@nestledjs/forms-native'
```

The native theme uses React Native `StyleSheet` objects instead of Tailwind CSS class strings.

### Same FormFieldClass

The `FormFieldClass` factory is identical across web and native. Field definitions are portable — you can define fields once and use them on both platforms:

```tsx
// shared/form-fields.ts
import { FormFieldClass } from '@nestledjs/forms-core'

export const signupFields = [
  FormFieldClass.text('name', { label: 'Name', required: true }),
  FormFieldClass.email('email', { label: 'Email', required: true }),
  FormFieldClass.password('password', { label: 'Password', required: true }),
]
```

```tsx
// Web
import { Form } from '@nestledjs/forms'
import { signupFields } from '../shared/form-fields'
;<Form id="signup" fields={signupFields} submit={handleSubmit}>
  <button type="submit">Sign Up</button>
</Form>
```

```tsx
// Native
import { NativeForm } from '@nestledjs/forms-native'
import { signupFields } from '../shared/form-fields'
;<NativeForm id="signup" fields={signupFields} submit={handleSubmit} />
```

---

## Optional dependencies

Install these packages based on which field types you use:

| Dependency                               | Required for                                | Install                                              |
| ---------------------------------------- | ------------------------------------------- | ---------------------------------------------------- |
| `expo-checkbox`                          | Checkbox, CustomCheckbox, CheckboxGroup     | `npx expo install expo-checkbox`                     |
| `react-native-element-dropdown`          | Select, MultiSelect, SearchSelect           | `npm install react-native-element-dropdown`          |
| `@react-native-community/datetimepicker` | DatePicker, DateTimePicker, TimePicker      | `npm install @react-native-community/datetimepicker` |
| `react-native-phone-number-input`        | Phone                                       | `npm install react-native-phone-number-input`        |
| `react-native-markdown-display`          | MarkdownEditor (display mode)               | `npm install react-native-markdown-display`          |
| `@apollo/client`                         | SearchSelectApollo, SearchSelectMultiApollo | `npm install @apollo/client graphql`                 |

{% callout title="Only install what you need" %}
All native dependencies are optional peer dependencies. Only install the ones for field types you actually use. The library will warn you at runtime if a required dependency is missing.
{% /callout %}

---

## Supported field types

All 24+ field types from the web library are available on native:

| Category           | Fields                                      | Native dependency                                        |
| ------------------ | ------------------------------------------- | -------------------------------------------------------- |
| **Text**           | text, textArea, email, password, url, phone | None (phone needs `react-native-phone-number-input`)     |
| **Numeric**        | number, currency                            | None                                                     |
| **Selection**      | select, multiSelect, enumSelect             | `react-native-element-dropdown`                          |
| **Radio/Checkbox** | radio, checkboxGroup                        | `expo-checkbox`                                          |
| **Search**         | searchSelect, searchSelectMulti             | `react-native-element-dropdown`                          |
| **Search Apollo**  | searchSelectApollo, searchSelectMultiApollo | `react-native-element-dropdown` + `@apollo/client`       |
| **Boolean**        | checkbox, switch, customCheckbox            | `expo-checkbox` (checkbox/customCheckbox), None (switch) |
| **Date/Time**      | datePicker, dateTimePicker, timePicker      | `@react-native-community/datetimepicker`                 |
| **Rich**           | markdownEditor, content, custom, button     | `react-native-markdown-display` (markdown)               |

---

## Hooks and context

The same hooks work on native:

```tsx
import {
  useFormContext,
  useFormConfig,
  useFormTheme,
} from '@nestledjs/forms-native'
```

---

## Validation

The entire validation system is shared via `forms-core`. Validation functions, Zod schemas, cross-field validation, validation groups, and async validation all work identically on native.

```tsx
FormFieldClass.email('email', {
  label: 'Email',
  required: true,
  validate: async (value) => {
    const exists = await checkEmail(value)
    return exists ? 'Email taken' : true
  },
})
```

This field definition works on both web and native without modification.

---

## Conditional logic

All conditional properties work on native:

```tsx
FormFieldClass.text('companyName', {
  label: 'Company',
  showWhen: (v) => v.accountType === 'business',
  requiredWhen: (v) => v.accountType === 'business',
  disabledWhen: (v) => v.isLocked,
})
```
