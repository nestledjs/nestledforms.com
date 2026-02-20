---
title: Theming
---

Customize the appearance of every form element — inputs, labels, errors, dropdowns, and more — through the theming system. {% .lead %}

---

## Default theme

The web library ships with a Tailwind CSS theme (`tailwindTheme`) that's applied automatically. No configuration needed.

```tsx
import { Form, FormFieldClass } from '@nestledjs/forms'

// Uses tailwindTheme by default
<Form id="my-form" fields={fields} submit={save}>
  <button type="submit">Submit</button>
</Form>
```

---

## Custom themes

Create a custom theme by providing a theme object to the `Form` component.

```tsx
import { Form, createCustomTheme } from '@nestledjs/forms'

const myTheme = createCustomTheme({
  input: 'border-2 border-indigo-300 rounded-lg px-4 py-3 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200',
  label: 'text-sm font-bold text-indigo-900 mb-2',
  error: 'text-red-600 text-xs mt-1 font-medium',
  helpText: 'text-indigo-400 text-xs mt-1',
})

<Form id="styled-form" fields={fields} submit={save} theme={myTheme}>
  <button type="submit">Submit</button>
</Form>
```

### createCustomTheme

`createCustomTheme` merges your overrides with the default `tailwindTheme`. You only need to specify the properties you want to change.

```tsx
const theme = createCustomTheme({
  input: 'custom-input-class',    // Overrides input styles
  label: 'custom-label-class',    // Overrides label styles
  // All other properties inherit from tailwindTheme
})
```

---

## Theme properties

The theme object controls styling for every part of every field type.

### Global properties

| Property | Description |
| --- | --- |
| `input` | Text input, email, password, URL, number fields |
| `textarea` | TextArea field |
| `label` | Field labels |
| `error` | Validation error messages |
| `helpText` | Help text below fields |
| `fieldWrapper` | Wrapper around each field (label + input + error) |
| `required` | Required indicator styling |
| `placeholder` | Placeholder text styling |

### Select properties

| Property | Description |
| --- | --- |
| `select` | Standard select dropdown |
| `selectMulti` | Multi-select dropdown |
| `selectOption` | Individual option in dropdown |
| `selectOptionSelected` | Selected option styling |

### Search select properties

| Property | Description |
| --- | --- |
| `searchInput` | Search input inside dropdown |
| `searchDropdown` | Dropdown container |
| `searchOption` | Individual search result option |
| `searchOptionHighlighted` | Highlighted/hovered search option |
| `inputWithClear` | Input wrapper when clear button is shown |
| `clearButton` | Clear/X button |
| `clearIcon` | Icon inside clear button |

### Checkbox and switch properties

| Property | Description |
| --- | --- |
| `checkbox` | Checkbox input |
| `checkboxLabel` | Label next to checkbox |
| `switch` | Switch/toggle input |
| `switchLabel` | Label next to switch |
| `customCheckbox` | Custom checkbox styling |
| `radioOption` | Individual radio button |
| `radioLabel` | Label next to radio button |
| `checkboxGroupOption` | Individual checkbox in a group |
| `checkboxGroupLabel` | Label in checkbox group |

### Date/time properties

| Property | Description |
| --- | --- |
| `datePicker` | Date picker input |
| `dateTimePicker` | DateTime picker input |
| `timePicker` | Time picker input |

### Other properties

| Property | Description |
| --- | --- |
| `button` | Button field styling |
| `content` | Content field wrapper |
| `markdownEditor` | Markdown editor container |
| `customField` | Custom field wrapper |

---

## Full theme override

To replace the default theme entirely instead of merging:

```tsx
import { Form } from '@nestledjs/forms'

const fullTheme = {
  input: 'my-input',
  textarea: 'my-textarea',
  label: 'my-label',
  error: 'my-error',
  helpText: 'my-help',
  fieldWrapper: 'my-wrapper',
  select: 'my-select',
  checkbox: 'my-checkbox',
  // ... provide all properties
}

<Form id="form" fields={fields} submit={save} theme={fullTheme}>
  <button type="submit">Submit</button>
</Form>
```

### Theme reference

Use `themeReference` to see all available theme properties and their default values:

```tsx
import { themeReference } from '@nestledjs/forms'

console.log(themeReference)
// Logs all theme property names and descriptions
```

### Generate a theme template

Use `generateThemeTemplate` to get a starter theme object:

```tsx
import { generateThemeTemplate } from '@nestledjs/forms'

const template = generateThemeTemplate()
// Returns an object with all theme properties set to empty strings
// Fill in with your custom classes
```

---

## Dynamic themes

Use `createFinalTheme` for runtime theme resolution:

```tsx
import { createFinalTheme, tailwindTheme } from '@nestledjs/forms'

function MyForm({ isDarkMode }) {
  const theme = createFinalTheme(
    tailwindTheme,
    isDarkMode ? darkOverrides : lightOverrides
  )

  return (
    <Form id="form" fields={fields} submit={save} theme={theme}>
      <button type="submit">Submit</button>
    </Form>
  )
}
```

---

## Per-field styling

In addition to themes, individual fields can be styled with `wrapperClassName` and `customWrapper`:

### wrapperClassName

```tsx
FormFieldClass.text('name', {
  label: 'Name',
  wrapperClassName: 'col-span-2 bg-gray-50 p-4 rounded-lg',
})
```

### customWrapper

```tsx
FormFieldClass.text('highlighted', {
  label: 'Important Field',
  customWrapper: (children) => (
    <div className="border-2 border-yellow-400 p-4 rounded-lg bg-yellow-50">
      <span className="text-yellow-800 text-xs font-bold">Priority</span>
      {children}
    </div>
  ),
})
```

---

## Accessing the theme

Inside custom components, use the `useFormTheme` hook:

```tsx
import { useFormTheme } from '@nestledjs/forms'

function CustomField({ value, onChange }) {
  const theme = useFormTheme()

  return (
    <div className={theme.fieldWrapper}>
      <label className={theme.label}>Custom Field</label>
      <input
        className={theme.input}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  )
}
```

---

## Native theming

For React Native, themes use `StyleSheet` objects instead of class strings. See [Field differences](/docs/native/field-differences) for details on native theme format.
