---
title: Selection fields
---

Dropdown and choice fields for selecting from predefined options — single select, multi-select, radio groups, and checkbox groups. {% .lead %}

---

## Select

A standard dropdown for selecting a single option.

```tsx
FormFieldClass.select('country', {
  label: 'Country',
  required: true,
  placeholder: 'Select a country',
  options: [
    { value: 'us', label: 'United States' },
    { value: 'ca', label: 'Canada' },
    { value: 'uk', label: 'United Kingdom' },
    { value: 'au', label: 'Australia' },
  ],
})
```

### Select-specific options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `options` | `SelectOption[]` | `[]` | Array of `{ value, label }` objects |
| `placeholder` | `string` | `'Select...'` | Placeholder text when no option is selected |

### SelectOption type

```tsx
interface SelectOption {
  value: string | number
  label: string
}
```

---

## MultiSelect

A dropdown that allows selecting multiple options.

```tsx
FormFieldClass.multiSelect('skills', {
  label: 'Skills',
  options: [
    { value: 'react', label: 'React' },
    { value: 'typescript', label: 'TypeScript' },
    { value: 'nodejs', label: 'Node.js' },
    { value: 'graphql', label: 'GraphQL' },
    { value: 'python', label: 'Python' },
  ],
  helpText: 'Select all that apply',
})
```

### MultiSelect-specific options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `options` | `SelectOption[]` | `[]` | Array of `{ value, label }` objects |
| `placeholder` | `string` | `'Select...'` | Placeholder text |

The value returned on submit is an array of selected values: `['react', 'typescript']`.

---

## EnumSelect

A select field that automatically generates options from a TypeScript enum or plain object.

```tsx
enum UserRole {
  Admin = 'ADMIN',
  Editor = 'EDITOR',
  Viewer = 'VIEWER',
}

FormFieldClass.enumSelect('role', {
  label: 'Role',
  required: true,
  enumObject: UserRole,
})
```

### EnumSelect-specific options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `enumObject` | `object` | — | TypeScript enum or `{ key: value }` object |
| `placeholder` | `string` | `'Select...'` | Placeholder text |

The enum keys become the labels and the enum values become the option values. For more control over labels, use a regular `select` with manually defined options.

---

## Radio

A radio button group for single selection with visible options.

```tsx
FormFieldClass.radio('plan', {
  label: 'Subscription Plan',
  required: true,
  radioOptions: [
    { value: 'free', label: 'Free' },
    { value: 'pro', label: 'Pro - $19/mo' },
    { value: 'enterprise', label: 'Enterprise - $99/mo' },
  ],
})
```

### Radio-specific options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `radioOptions` | `RadioOption[]` | `[]` | Array of `{ value, label }` objects |
| `layout` | `'horizontal' \| 'vertical'` | `'vertical'` | Direction of radio options |

### RadioOption type

```tsx
interface RadioOption {
  value: string | number
  label: string
}
```

**When to use Radio vs Select:** Use radio buttons when you have 2-5 options and want them all visible at once. Use a select dropdown for longer lists.

---

## CheckboxGroup

A group of checkboxes for selecting multiple options, displayed as a visible list.

```tsx
FormFieldClass.checkboxGroup('notifications', {
  label: 'Notification Preferences',
  checkboxOptions: [
    { value: 'email', label: 'Email notifications' },
    { value: 'sms', label: 'SMS notifications' },
    { value: 'push', label: 'Push notifications' },
    { value: 'slack', label: 'Slack notifications' },
  ],
})
```

### CheckboxGroup-specific options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `checkboxOptions` | `CheckboxOption[]` | `[]` | Array of `{ value, label }` objects |
| `layout` | `'horizontal' \| 'vertical'` | `'vertical'` | Direction of checkbox options |

The value returned on submit is an array: `['email', 'push']`.

**When to use CheckboxGroup vs MultiSelect:** Use checkbox groups when you have a small number of options (2-8) and want them all visible. Use multi-select for longer lists.

---

## Common patterns

### Cascading selects

Use `showWhen` and dynamic options for dependent dropdowns:

```tsx
const fields = [
  FormFieldClass.select('country', {
    label: 'Country',
    options: [
      { value: 'us', label: 'United States' },
      { value: 'ca', label: 'Canada' },
    ],
  }),
  FormFieldClass.select('state', {
    label: 'State/Province',
    showWhen: (values) => values.country === 'us',
    options: [
      { value: 'ca', label: 'California' },
      { value: 'ny', label: 'New York' },
      { value: 'tx', label: 'Texas' },
    ],
  }),
  FormFieldClass.select('province', {
    label: 'Province',
    showWhen: (values) => values.country === 'ca',
    options: [
      { value: 'on', label: 'Ontario' },
      { value: 'bc', label: 'British Columbia' },
      { value: 'qc', label: 'Quebec' },
    ],
  }),
]
```

### Required selection based on another field

```tsx
FormFieldClass.select('assignee', {
  label: 'Assignee',
  options: teamMembers,
  requiredWhen: (values) => values.priority === 'urgent',
  showWhen: (values) => values.priority === 'urgent',
})
```

### Select with default value

```tsx
FormFieldClass.select('timezone', {
  label: 'Timezone',
  defaultValue: 'America/New_York',
  options: timezoneOptions,
})
```
