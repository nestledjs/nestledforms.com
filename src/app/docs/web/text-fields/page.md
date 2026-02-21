---
title: Text fields
nextjs:
  metadata:
    description: Nestled Forms text input fields for capturing string data — text, email, password, URL, phone, and textarea variants.
---

Text input fields for capturing string data — from simple text to emails, passwords, URLs, and phone numbers. {% .lead %}

---

## Text

A standard single-line text input.

```tsx
FormFieldClass.text('username', {
  label: 'Username',
  required: true,
  placeholder: 'Enter your username',
  helpText: 'Must be 3-20 characters',
  validate: (value) => {
    if (value.length < 3) return 'Too short'
    if (value.length > 20) return 'Too long'
    return true
  },
})
```

### Text-specific options

| Option        | Type     | Default | Description             |
| ------------- | -------- | ------- | ----------------------- |
| `placeholder` | `string` | —       | Placeholder text        |
| `maxLength`   | `number` | —       | Maximum character count |

---

## TextArea

A multi-line text input for longer content.

```tsx
FormFieldClass.textArea('bio', {
  label: 'Biography',
  placeholder: 'Tell us about yourself...',
  rows: 5,
})
```

### TextArea-specific options

| Option        | Type     | Default | Description                 |
| ------------- | -------- | ------- | --------------------------- |
| `rows`        | `number` | `3`     | Number of visible text rows |
| `placeholder` | `string` | —       | Placeholder text            |
| `maxLength`   | `number` | —       | Maximum character count     |

---

## Email

A text input with built-in email validation. Renders with `type="email"` for proper keyboard on mobile.

```tsx
FormFieldClass.email('email', {
  label: 'Email Address',
  required: true,
  placeholder: 'you@example.com',
  validate: async (value) => {
    const exists = await checkEmailExists(value)
    return exists ? 'Email already registered' : true
  },
})
```

The email field automatically validates email format in addition to any custom `validate` function you provide.

### Email-specific options

| Option        | Type     | Default | Description      |
| ------------- | -------- | ------- | ---------------- |
| `placeholder` | `string` | —       | Placeholder text |

---

## Password

A masked text input for sensitive data. Renders with `type="password"`.

```tsx
FormFieldClass.password('password', {
  label: 'Password',
  required: true,
  placeholder: 'Enter your password',
  validate: (value) => {
    if (value.length < 8) return 'Must be at least 8 characters'
    if (!/[A-Z]/.test(value)) return 'Must contain an uppercase letter'
    if (!/[0-9]/.test(value)) return 'Must contain a number'
    return true
  },
})
```

### Password-specific options

| Option        | Type     | Default | Description      |
| ------------- | -------- | ------- | ---------------- |
| `placeholder` | `string` | —       | Placeholder text |

### Password confirmation pattern

Use cross-field validation to confirm passwords match:

```tsx
FormFieldClass.password('confirmPassword', {
  label: 'Confirm Password',
  required: true,
  validateWithForm: (value, formValues) =>
    value === formValues.password || 'Passwords do not match',
  validationDependencies: ['password'],
})
```

---

## URL

A text input with URL validation. Renders with `type="url"` for proper keyboard on mobile.

```tsx
FormFieldClass.url('website', {
  label: 'Website',
  placeholder: 'https://example.com',
  helpText: 'Include the full URL with https://',
})
```

### URL-specific options

| Option        | Type     | Default | Description      |
| ------------- | -------- | ------- | ---------------- |
| `placeholder` | `string` | —       | Placeholder text |

---

## Phone

A phone number input with international country code support and formatting.

```tsx
FormFieldClass.phone('phone', {
  label: 'Phone Number',
  required: true,
  helpText: 'We will send a verification code to this number',
})
```

The phone field provides a country code selector and automatically formats the number based on the selected country. It uses `react-native-phone-number-input` on native and a built-in phone input component on web.

### Phone-specific options

| Option           | Type     | Default | Description          |
| ---------------- | -------- | ------- | -------------------- |
| `defaultCountry` | `string` | `'US'`  | Default country code |

---

## Common patterns

### Multi-column text layout

Use `wrapperClassName` to arrange text fields in a grid:

```tsx
const fields = [
  FormFieldClass.text('firstName', {
    label: 'First Name',
    wrapperClassName: 'col-span-1',
  }),
  FormFieldClass.text('lastName', {
    label: 'Last Name',
    wrapperClassName: 'col-span-1',
  }),
  FormFieldClass.email('email', {
    label: 'Email',
    wrapperClassName: 'col-span-2',
  }),
]

<Form id="user" fields={fields} submit={save}>
  <button type="submit">Save</button>
</Form>
```

Wrap the form in a container with `grid grid-cols-2 gap-4` to create a two-column layout.

### Conditional text fields

Show a field based on another field's value:

```tsx
const fields = [
  FormFieldClass.checkbox('hasCompany', { label: 'I represent a company' }),
  FormFieldClass.text('companyName', {
    label: 'Company Name',
    required: true,
    showWhen: (values) => values.hasCompany === true,
    requiredWhen: (values) => values.hasCompany === true,
  }),
]
```

### Read-only text display

Display values without allowing editing:

```tsx
FormFieldClass.text('accountId', {
  label: 'Account ID',
  readOnly: true,
  readOnlyStyle: 'value', // Shows as plain text instead of disabled input
})
```
