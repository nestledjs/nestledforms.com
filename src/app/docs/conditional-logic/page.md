---
title: Conditional logic
---

Show, hide, require, and disable fields dynamically based on the values of other fields in the form. {% .lead %}

---

## Overview

Every field type in Nestled Forms supports four conditional properties:

| Property       | Description                         |
| -------------- | ----------------------------------- |
| `showWhen`     | Show or hide the field              |
| `requiredWhen` | Make the field required or optional |
| `disabledWhen` | Enable or disable the field         |
| `validateWhen` | Enable or skip validation           |

Each takes a function that receives the current form values and returns a `boolean`.

```tsx
;(formValues: Record<string, any>) => boolean
```

---

## showWhen

Conditionally show or hide a field. When the function returns `false`, the field is completely hidden from the form.

```tsx
FormFieldClass.text('companyName', {
  label: 'Company Name',
  showWhen: (values) => values.accountType === 'business',
})
```

### Multiple conditions

```tsx
FormFieldClass.text('managerName', {
  label: 'Manager Name',
  showWhen: (values) =>
    values.accountType === 'business' && values.teamSize > 10,
})
```

### Select-dependent fields

```tsx
const fields = [
  FormFieldClass.select('contactMethod', {
    label: 'Preferred Contact Method',
    options: [
      { value: 'email', label: 'Email' },
      { value: 'phone', label: 'Phone' },
      { value: 'mail', label: 'Postal Mail' },
    ],
  }),
  FormFieldClass.email('contactEmail', {
    label: 'Email Address',
    required: true,
    showWhen: (values) => values.contactMethod === 'email',
  }),
  FormFieldClass.phone('contactPhone', {
    label: 'Phone Number',
    required: true,
    showWhen: (values) => values.contactMethod === 'phone',
  }),
  FormFieldClass.text('mailingAddress', {
    label: 'Mailing Address',
    required: true,
    showWhen: (values) => values.contactMethod === 'mail',
  }),
]
```

### Hidden field values

When a field is hidden via `showWhen`, its value is still preserved in the form state. On submission, hidden field values are included unless you handle this in your `submit` handler.

---

## requiredWhen

Dynamically make a field required based on other field values.

```tsx
FormFieldClass.text('taxId', {
  label: 'Tax ID',
  requiredWhen: (values) => values.accountType === 'business',
})
```

### Combined with showWhen

A common pattern is to show and require a field simultaneously:

```tsx
FormFieldClass.text('companyName', {
  label: 'Company Name',
  showWhen: (values) => values.isCompany,
  requiredWhen: (values) => values.isCompany,
})
```

This ensures the field is both visible and required when the condition is met, and hidden and optional when it's not.

---

## disabledWhen

Dynamically disable a field. Disabled fields are visible but not editable.

```tsx
FormFieldClass.text('promoCode', {
  label: 'Promo Code',
  disabledWhen: (values) => values.plan === 'free',
  helpText: 'Promo codes only apply to paid plans',
})
```

### Disable based on checkbox

```tsx
FormFieldClass.switch('useCustomAddress', {
  label: 'Use custom shipping address',
}),
FormFieldClass.text('shippingAddress', {
  label: 'Shipping Address',
  disabledWhen: (values) => !values.useCustomAddress,
}),
```

---

## validateWhen

Only validate a field when a condition is met. When the condition is `false`, the field skips all validation — even `required` checks.

```tsx
FormFieldClass.text('vatNumber', {
  label: 'VAT Number',
  required: true,
  validate: (value) => /^[A-Z]{2}\d{9}$/.test(value) || 'Invalid VAT format',
  validateWhen: (values) => values.country !== 'US',
})
```

This is different from `requiredWhen` — `validateWhen` controls all validation (including custom `validate` functions), while `requiredWhen` only controls the required check.

---

## Real-world examples

### Registration form with role-based fields

```tsx
const registrationFields = [
  FormFieldClass.text('name', { label: 'Full Name', required: true }),
  FormFieldClass.email('email', { label: 'Email', required: true }),
  FormFieldClass.password('password', { label: 'Password', required: true }),

  FormFieldClass.radio('role', {
    label: 'Account Type',
    radioOptions: [
      { value: 'individual', label: 'Individual' },
      { value: 'business', label: 'Business' },
      { value: 'nonprofit', label: 'Nonprofit' },
    ],
    defaultValue: 'individual',
  }),

  // Business-only fields
  FormFieldClass.text('companyName', {
    label: 'Company Name',
    showWhen: (v) => v.role === 'business' || v.role === 'nonprofit',
    requiredWhen: (v) => v.role === 'business' || v.role === 'nonprofit',
  }),
  FormFieldClass.text('taxId', {
    label: 'Tax ID / EIN',
    showWhen: (v) => v.role === 'business',
    requiredWhen: (v) => v.role === 'business',
  }),
  FormFieldClass.text('nonprofitId', {
    label: '501(c)(3) Number',
    showWhen: (v) => v.role === 'nonprofit',
  }),
  FormFieldClass.number('employees', {
    label: 'Number of Employees',
    showWhen: (v) => v.role === 'business',
    min: 1,
  }),
]
```

### Shipping form with address toggle

```tsx
const shippingFields = [
  FormFieldClass.checkbox('sameAsBilling', {
    label: 'Shipping address same as billing',
    defaultValue: true,
  }),

  FormFieldClass.text('shippingStreet', {
    label: 'Street Address',
    showWhen: (v) => !v.sameAsBilling,
    requiredWhen: (v) => !v.sameAsBilling,
  }),
  FormFieldClass.text('shippingCity', {
    label: 'City',
    showWhen: (v) => !v.sameAsBilling,
    requiredWhen: (v) => !v.sameAsBilling,
    wrapperClassName: 'col-span-1',
  }),
  FormFieldClass.text('shippingState', {
    label: 'State',
    showWhen: (v) => !v.sameAsBilling,
    requiredWhen: (v) => !v.sameAsBilling,
    wrapperClassName: 'col-span-1',
  }),
  FormFieldClass.text('shippingZip', {
    label: 'ZIP Code',
    showWhen: (v) => !v.sameAsBilling,
    requiredWhen: (v) => !v.sameAsBilling,
    wrapperClassName: 'col-span-1',
  }),
]
```

### Progressive disclosure

```tsx
const surveyFields = [
  FormFieldClass.radio('satisfaction', {
    label: 'How satisfied are you?',
    radioOptions: [
      { value: '5', label: 'Very satisfied' },
      { value: '4', label: 'Satisfied' },
      { value: '3', label: 'Neutral' },
      { value: '2', label: 'Dissatisfied' },
      { value: '1', label: 'Very dissatisfied' },
    ],
  }),
  FormFieldClass.textArea('feedback', {
    label: 'What could we improve?',
    showWhen: (v) => v.satisfaction && parseInt(v.satisfaction) <= 3,
    requiredWhen: (v) => v.satisfaction && parseInt(v.satisfaction) <= 2,
    placeholder: 'Please tell us how we can do better...',
    rows: 4,
  }),
  FormFieldClass.checkbox('contactMe', {
    label: 'I would like to be contacted about my feedback',
    showWhen: (v) => v.satisfaction && parseInt(v.satisfaction) <= 3,
  }),
  FormFieldClass.phone('callbackNumber', {
    label: 'Callback Number',
    showWhen: (v) => v.contactMe === true,
    requiredWhen: (v) => v.contactMe === true,
  }),
]
```
