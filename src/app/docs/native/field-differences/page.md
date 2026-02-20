---
title: Field differences
---

How native form fields differ from their web counterparts — component mappings, styling, and platform-specific behavior. {% .lead %}

---

## Text inputs

Native text fields use React Native's `TextInput` component instead of HTML `<input>` elements.

| Web | Native |
| --- | --- |
| `<input type="text">` | `<TextInput>` |
| `<input type="email">` | `<TextInput keyboardType="email-address">` |
| `<input type="password">` | `<TextInput secureTextEntry>` |
| `<input type="url">` | `<TextInput keyboardType="url">` |
| `<textarea>` | `<TextInput multiline>` |

### Keyboard types

Native text fields automatically set the appropriate `keyboardType`:

| Field type | Keyboard type |
| --- | --- |
| `text` | `default` |
| `email` | `email-address` |
| `url` | `url` |
| `phone` | `phone-pad` |
| `number` | `numeric` |
| `currency` | `decimal-pad` |

---

## Select and dropdown fields

Web uses native HTML `<select>` elements or custom dropdowns. Native uses `react-native-element-dropdown` for a consistent cross-platform dropdown experience.

### Behavior differences

- **Web**: Opens a native browser dropdown or a custom styled dropdown
- **Native**: Opens a bottom sheet or modal with a scrollable list

### Search selects

On native, search selects use `react-native-element-dropdown`'s built-in search functionality. The search input appears at the top of the dropdown modal.

---

## Checkbox fields

Web uses HTML `<input type="checkbox">`. Native uses `expo-checkbox`.

```shell
npx expo install expo-checkbox
```

The `Switch` field uses React Native's built-in `Switch` component on both platforms — no additional dependency needed.

---

## Date and time pickers

Web renders standard HTML date/time inputs or a custom date picker component. Native uses `@react-native-community/datetimepicker`.

### Platform behavior

| Platform | Behavior |
| --- | --- |
| **iOS** | Inline spinner-style picker |
| **Android** | Modal dialog picker |

```shell
npm install @react-native-community/datetimepicker
```

---

## Phone input

Web renders a custom phone input with country code selector. Native uses `react-native-phone-number-input`.

```shell
npm install react-native-phone-number-input
```

---

## Markdown editor

The markdown editor behaves differently on each platform:

| Platform | Behavior |
| --- | --- |
| **Web** | Full MDX Editor with toolbar, live preview, and image upload |
| **Native** | Text input for markdown with `react-native-markdown-display` for preview |

The web markdown editor is significantly more feature-rich. On native, consider using a `textArea` field for simple rich text needs.

---

## Theming differences

### Web theme

The web theme (`tailwindTheme`) uses Tailwind CSS class strings:

```tsx
const tailwindTheme = {
  input: 'border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-sky-500',
  label: 'block text-sm font-medium text-gray-700 mb-1',
  error: 'text-red-500 text-sm mt-1',
  // ...
}
```

### Native theme

The native theme (`NativeTheme`) uses React Native `StyleSheet` objects:

```tsx
const NativeTheme = {
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 4,
  },
  error: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 4,
  },
  // ...
}
```

### Custom native themes

```tsx
import { NativeForm, createCustomTheme } from '@nestledjs/forms-native'

const myTheme = createCustomTheme({
  input: {
    borderColor: '#6366F1',
    borderRadius: 12,
  },
  label: {
    color: '#1E1B4B',
    fontWeight: '600',
  },
})

<NativeForm id="form" fields={fields} submit={save} theme={myTheme} />
```

---

## Feature parity table

| Feature | Web | Native |
| --- | --- | --- |
| All 24+ field types | Yes | Yes |
| Declarative API | Yes | Yes |
| Imperative API | Yes | Yes |
| Conditional logic | Yes | Yes |
| Validation (sync/async/Zod) | Yes | Yes |
| Cross-field validation | Yes | Yes |
| Validation groups | Yes | Yes |
| Read-only mode | Yes | Yes |
| Custom themes | Yes (CSS classes) | Yes (StyleSheet) |
| Apollo search selects | Yes | Yes |
| Markdown editor (full) | Yes | Limited |
| Custom field components | Yes | Yes |
| Form context hooks | Yes | Yes |
| submitTransform | Yes | Yes |

---

## Sharing field definitions

The recommended pattern for cross-platform apps is to define fields in a shared module:

```tsx
// packages/shared/src/form-fields.ts
import { FormFieldClass } from '@nestledjs/forms-core'

export const profileFields = [
  FormFieldClass.text('displayName', {
    label: 'Display Name',
    required: true,
    validate: (v) => v.length >= 2 || 'Too short',
  }),
  FormFieldClass.email('email', {
    label: 'Email',
    required: true,
  }),
  FormFieldClass.phone('phone', {
    label: 'Phone',
  }),
  FormFieldClass.select('timezone', {
    label: 'Timezone',
    options: timezones,
  }),
]
```

Then import in each platform:

```tsx
// apps/web/src/ProfileForm.tsx
import { Form } from '@nestledjs/forms'
import { profileFields } from '@shared/form-fields'

// apps/mobile/src/ProfileForm.tsx
import { NativeForm } from '@nestledjs/forms-native'
import { profileFields } from '@shared/form-fields'
```

The field definitions are 100% portable. Only the rendering component changes.
