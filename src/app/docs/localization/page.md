---
title: Localization
nextjs:
  metadata:
    description: Translate every user-facing string Nestled Forms renders — loading states, "No results", the default required error, and aria-labels — per form via the strings prop.
---

Translate every user-facing string the library renders — loading indicators, "No results found", the default required error, and aria-labels — on a per-form basis via the `strings` prop. {% .lead %}

{% callout title="Added in 0.8.0" %}
The `strings` prop and the `FormStrings` type are available from version 0.8.0 onward, on both `Form` (web) and `NativeForm` (React Native).
{% /callout %}

---

## The strings prop

Pass a partial `strings` object to any form. Any key you provide overrides that string; every key you leave out keeps its English default — so you only translate what you need.

```tsx
import { Form } from '@nestledjs/forms'
;<Form
  id="fr-form"
  strings={{
    requiredError: 'Ce champ est requis',
    loading: 'Chargement...',
    noResults: 'Aucun résultat',
    selectPlaceholder: 'Sélectionnez une option...',
    removeItem: (label) => `Supprimer ${label}`,
  }}
  fields={fields}
  submit={handleSubmit}
/>
```

The same prop works identically on `NativeForm`:

```tsx
import { NativeForm } from '@nestledjs/forms-native'
;<NativeForm
  id="fr-form"
  strings={{ requiredError: 'Ce champ est requis' }}
  fields={fields}
  submit={handleSubmit}
/>
```

---

## Available keys

Every key on the `FormStrings` type, with its English default:

| Key                 | Default                  | Used for                                                                          |
| ------------------- | ------------------------ | --------------------------------------------------------------------------------- |
| `requiredError`     | `This field is required` | Fallback error for required fields                                                |
| `loading`           | `Loading...`             | Search select: options are loading                                                |
| `noResults`         | `No results found`       | Search select: nothing matches the search                                         |
| `noOptions`         | `No options available`   | Search select: the options list is empty                                          |
| `selectPlaceholder` | `Select an option...`    | Select: default placeholder option                                                |
| `searchPlaceholder` | `Search...`              | Search inputs: default placeholder                                                |
| `readOnlyYes`       | `Yes`                    | Read-only checkbox/switch: checked                                                |
| `readOnlyNo`        | `No`                     | Read-only checkbox/switch: unchecked                                              |
| `noneSelected`      | `No options selected`    | Read-only multi selections: nothing selected                                      |
| `clearSelection`    | `Clear selection`        | aria-label for the clear button                                                   |
| `toggleDropdown`    | `Toggle dropdown`        | aria-label for the dropdown toggle                                                |
| `removeItem`        | `` `Remove ${label}` ``  | aria-label for a multi-select chip's remove button (a function of the item label) |

`removeItem` is a function so the label can be interpolated into the translated string:

```tsx
strings={{ removeItem: (label) => `Supprimer ${label}` }}
```

The `FormStrings` type is exported from `@nestledjs/forms-core` if you want to type a shared translation object:

```tsx
import type { FormStrings } from '@nestledjs/forms-core'

const fr: Partial<FormStrings> = {
  requiredError: 'Ce champ est requis',
  loading: 'Chargement...',
}
```

---

## Precedence

A per-field `errorMessages.required` always wins over `strings.requiredError`. Use `strings` for the app-wide default and `errorMessages.required` for a specific field's message:

```tsx
// strings.requiredError is the default for every field...
<Form
  strings={{ requiredError: 'Ce champ est requis' }}
  fields={[
    // ...but this field overrides it
    FormFieldClass.text('email', {
      label: 'E-mail',
      required: true,
      errorMessages: { required: 'Veuillez saisir votre e-mail' },
    }),
  ]}
/>
```
