---
title: API reference
nextjs:
  metadata:
    description: Complete reference for all exports from @nestledjs/forms, @nestledjs/forms-native, and @nestledjs/forms-core.
---

Complete reference for all exports from `@nestledjs/forms`, `@nestledjs/forms-native`, and `@nestledjs/forms-core`. {% .lead %}

---

## Components

### Form (web)

```tsx
import { Form } from '@nestledjs/forms'
```

| Prop               | Type                  | Required | Description                             |
| ------------------ | --------------------- | -------- | --------------------------------------- |
| `id`               | `string`              | Yes      | Unique form identifier                  |
| `fields`           | `FormField[]`         | No       | Declarative field definitions           |
| `submit`           | `(values: T) => void` | Yes      | Submit handler                          |
| `initialValues`    | `Partial<T>`          | No       | Pre-fill form values                    |
| `readOnly`         | `boolean`             | No       | Make all fields read-only               |
| `theme`            | `FormTheme`           | No       | Custom theme object                     |
| `validateOnBlur`   | `boolean`             | No       | Validate on field blur                  |
| `validateOnChange` | `boolean`             | No       | Validate on field change                |
| `children`         | `ReactNode`           | No       | Submit buttons, imperative fields, etc. |

### NativeForm (React Native)

```tsx
import { NativeForm } from '@nestledjs/forms-native'
```

Same props as `Form` but rendered with React Native components.

### RenderFormField

```tsx
import { RenderFormField } from '@nestledjs/forms'
```

| Prop    | Type        | Required | Description                            |
| ------- | ----------- | -------- | -------------------------------------- |
| `field` | `FormField` | Yes      | Field definition from `FormFieldClass` |

### ApolloSearchProvider

```tsx
import { ApolloSearchProvider } from '@nestledjs/forms/apollo'
// or '@nestledjs/forms-native/apollo' / '@nestledjs/forms-core/apollo'
```

Enables `searchSelectApollo` and `searchSelectMultiApollo` fields. Place inside your existing `<ApolloProvider>`. Works with `@apollo/client` v3 and v4. The `/apollo` subpath is the only entry point that imports `@apollo/client`.

| Prop       | Type        | Required | Description           |
| ---------- | ----------- | -------- | --------------------- |
| `children` | `ReactNode` | Yes      | Your app or form tree |

### SearchQueryProvider

```tsx
import { SearchQueryProvider } from '@nestledjs/forms-core'
```

Backs Apollo search select fields with a custom data layer (urql, TanStack Query, fetch) instead of Apollo Client.

| Prop             | Type             | Required | Description                             |
| ---------------- | ---------------- | -------- | --------------------------------------- |
| `useSearchQuery` | `UseSearchQuery` | Yes      | Hook that executes the field's document |
| `children`       | `ReactNode`      | Yes      | Your app or form tree                   |

### PhoneField

```tsx
import { PhoneField } from '@nestledjs/forms/phone'
```

Direct import of the phone field component. It lives on its own subpath (no longer exported from `@nestledjs/forms`) to keep libphonenumber's ~150 KB metadata out of the main bundle; declarative usage via `FormFieldClass.phone()` lazy-loads it automatically.

---

## FormFieldClass factory methods

```tsx
import { FormFieldClass } from '@nestledjs/forms'
```

All methods follow the signature: `FormFieldClass.method(key: string, options?: Options)`

### Text input fields

| Method                                   | Description                    |
| ---------------------------------------- | ------------------------------ |
| `FormFieldClass.text(key, options?)`     | Single-line text input         |
| `FormFieldClass.textArea(key, options?)` | Multi-line text input          |
| `FormFieldClass.email(key, options?)`    | Email input with validation    |
| `FormFieldClass.password(key, options?)` | Masked password input          |
| `FormFieldClass.url(key, options?)`      | URL input with validation      |
| `FormFieldClass.phone(key, options?)`    | Phone number with country code |

### Numeric fields

| Method                                   | Description                     |
| ---------------------------------------- | ------------------------------- |
| `FormFieldClass.number(key, options?)`   | Numeric input with min/max/step |
| `FormFieldClass.currency(key, options?)` | Currency input with formatting  |

### Selection fields

| Method                                        | Description                 |
| --------------------------------------------- | --------------------------- |
| `FormFieldClass.select(key, options?)`        | Single-select dropdown      |
| `FormFieldClass.multiSelect(key, options?)`   | Multi-select dropdown       |
| `FormFieldClass.enumSelect(key, options?)`    | Select from TypeScript enum |
| `FormFieldClass.radio(key, options?)`         | Radio button group          |
| `FormFieldClass.checkboxGroup(key, options?)` | Checkbox group              |

### Search select fields

| Method                                                  | Description                  |
| ------------------------------------------------------- | ---------------------------- |
| `FormFieldClass.searchSelect(key, options?)`            | Searchable single-select     |
| `FormFieldClass.searchSelectApollo(key, options?)`      | Apollo GraphQL single-select |
| `FormFieldClass.searchSelectMulti(key, options?)`       | Searchable multi-select      |
| `FormFieldClass.searchSelectMultiApollo(key, options?)` | Apollo GraphQL multi-select  |

### Boolean fields

| Method                                         | Description            |
| ---------------------------------------------- | ---------------------- |
| `FormFieldClass.checkbox(key, options?)`       | Standard checkbox      |
| `FormFieldClass.switch(key, options?)`         | Toggle switch          |
| `FormFieldClass.customCheckbox(key, options?)` | Custom-styled checkbox |

### Date & time fields

| Method                                         | Description          |
| ---------------------------------------------- | -------------------- |
| `FormFieldClass.datePicker(key, options?)`     | Date picker          |
| `FormFieldClass.dateTimePicker(key, options?)` | Date and time picker |
| `FormFieldClass.timePicker(key, options?)`     | Time picker          |

### Utility fields

| Method                                         | Description               |
| ---------------------------------------------- | ------------------------- |
| `FormFieldClass.markdownEditor(key, options?)` | Rich text markdown editor |
| `FormFieldClass.content(key, options?)`        | Display-only content      |
| `FormFieldClass.custom(key, options?)`         | Custom component field    |
| `FormFieldClass.button(key, options?)`         | Action button             |

---

## Shared field options

All field types accept these options:

```tsx
interface BaseFieldOptions {
  // Display
  label?: string
  placeholder?: string
  helpText?: string
  hidden?: boolean

  // State
  required?: boolean
  disabled?: boolean
  readOnly?: boolean
  readOnlyStyle?: 'value' | 'disabled'
  defaultValue?: any

  // Conditional logic
  showWhen?: (formValues: Record<string, any>) => boolean
  requiredWhen?: (formValues: Record<string, any>) => boolean
  disabledWhen?: (formValues: Record<string, any>) => boolean
  validateWhen?: (formValues: Record<string, any>) => boolean

  // Validation
  validate?: (value: any) => true | string | Promise<true | string>
  schema?: ZodTypeAny
  validateWithForm?: (
    value: any,
    formValues: Record<string, any>,
  ) => true | string
  validationDependencies?: string[]
  validationGroup?: string
  errorMessages?: { required?: string; [key: string]: string | undefined }

  // Layout
  wrapperClassName?: string
  layout?: 'horizontal' | 'vertical'
  customWrapper?: (children: React.ReactNode) => React.ReactElement

  // Transform
  submitTransform?: (value: any) => unknown
}
```

---

## Hooks

### useFormContext

```tsx
import { useFormContext } from '@nestledjs/forms'

const {
  formValues, // Record<string, any> — current form values
  errors, // Record<string, string> — validation errors
  isSubmitting, // boolean — whether form is submitting
  setValue, // (key: string, value: any) => void
  setError, // (key: string, error: string) => void
  reset, // () => void — reset to initial values
  validateGroup, // (group: string) => Promise<boolean>
} = useFormContext()
```

### useFormConfig

```tsx
import { useFormConfig } from '@nestledjs/forms'

const {
  readOnly, // boolean
  validateOnBlur, // boolean
  validateOnChange, // boolean
} = useFormConfig()
```

### useFormTheme

```tsx
import { useFormTheme } from '@nestledjs/forms'

const theme = useFormTheme()
// theme.input, theme.label, theme.error, etc.
```

### useNativeFormSubmit

```tsx
import { useNativeFormSubmit } from '@nestledjs/forms-native'

const submitForm = useNativeFormSubmit()
// (() => Promise<void>) | null — null outside a NativeForm

<Pressable onPress={() => submitForm?.()} />
```

Returns `NativeForm`'s submit trigger for custom submit buttons: runs validation, applies each field's `submitTransform`, then calls the form's `submit` prop.

### useApolloSearchQuery

```tsx
import { useApolloSearchQuery } from '@nestledjs/forms/apollo'
```

The Apollo implementation of `UseSearchQuery` used by `ApolloSearchProvider`. Useful as a reference when writing a custom adapter.

---

## Theme utilities

### tailwindTheme

```tsx
import { tailwindTheme } from '@nestledjs/forms'
```

The default Tailwind CSS theme. Applied automatically unless you provide a custom theme.

### createCustomTheme

```tsx
import { createCustomTheme } from '@nestledjs/forms'

const theme = createCustomTheme({
  input: 'custom-input-classes',
  label: 'custom-label-classes',
})
// Merges with tailwindTheme — only override what you need
```

### createFinalTheme

```tsx
import { createFinalTheme } from '@nestledjs/forms'

const theme = createFinalTheme(baseTheme, overrides)
// Merges overrides into baseTheme at runtime
```

### themeReference

```tsx
import { themeReference } from '@nestledjs/forms'
// Object listing all theme property names and descriptions
```

### generateThemeTemplate

```tsx
import { generateThemeTemplate } from '@nestledjs/forms'
// Returns a theme object with all properties set to empty strings
```

---

## Types

### FormField

```tsx
import type { FormField } from '@nestledjs/forms'
// Union type of all possible field definitions
```

### FormFieldType

```tsx
import { FormFieldType } from '@nestledjs/forms'
// Enum of all field type identifiers
```

### FormTheme

```tsx
import type { FormTheme } from '@nestledjs/forms'
// Interface for the complete theme object
```

### FormProps

```tsx
import type { FormProps } from '@nestledjs/forms'
// Props interface for the Form component
```

### UseSearchQuery

```tsx
import type { UseSearchQuery } from '@nestledjs/forms-core'

type UseSearchQuery = <TData = any>(
  document: DocumentNode | TypedDocumentNode<TData>,
  options?: { variables?: Record<string, unknown> },
) => {
  data: TData | undefined
  loading: boolean
  refetch: (variables?: Record<string, unknown>) => Promise<{ data?: TData }>
}
```

The hook contract for custom search query adapters passed to `SearchQueryProvider`. The returned `data` must be referentially stable between renders unless the result changed.

---

## Validation utilities

```tsx
import {
  createFieldValidation, // Create a validation function for a field
  createFormResolver, // Create a form-level resolver
  validateGroup, // Validate a specific validation group
} from '@nestledjs/forms'
```

---

## Submit transform utilities

```tsx
import {
  singleSelectSubmitTransform, // Option object → ID string
  multiSelectSubmitTransform, // Option objects → ID string array
  resolveSubmitTransform, // Field's explicit transform, or its per-type default
} from '@nestledjs/forms-core'
```

Applied automatically at submit time for `searchSelectApollo`, `searchSelectMultiApollo`, `multiSelect`, and `searchSelectMulti` fields. An explicit `submitTransform` on the field always wins. Still re-exported from their previous locations.

---

## Currency utilities

```tsx
import {
  currencies, // Array of all supported currency configurations
  formatCurrency, // Format a number as currency string
  getCurrencySymbol, // Get the symbol for a currency code
} from '@nestledjs/forms'
```

---

## Date/time utilities

```tsx
import {
  formatDate, // Format a date value
  formatDateTime, // Format a datetime value
  formatTime, // Format a time value
} from '@nestledjs/forms'
```

Timezone-safe helpers for converting between `Date` objects and local date strings (used internally by the date pickers to avoid cross-timezone date corruption):

```tsx
import {
  parseLocalDate, // 'YYYY-MM-DD' string → Date in local time
  formatLocalDate, // Date → 'YYYY-MM-DD' string in local time
  parseLocalDateTime, // 'YYYY-MM-DDTHH:mm' string → Date in local time
  formatLocalDateTime, // Date → 'YYYY-MM-DDTHH:mm' string in local time
} from '@nestledjs/forms-core'
```
