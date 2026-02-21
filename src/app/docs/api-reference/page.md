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
