---
title: Boolean fields
nextjs:
  metadata:
    description: Nestled Forms toggle and checkbox fields for capturing boolean values and on/off states.
---

Toggle and checkbox fields for capturing boolean values and on/off states. {% .lead %}

---

## Checkbox

A standard checkbox input that stores a boolean value.

```tsx
FormFieldClass.checkbox('agreeToTerms', {
  label: 'I agree to the terms and conditions',
  required: true,
})
```

### Checkbox-specific options

| Option         | Type      | Default | Description           |
| -------------- | --------- | ------- | --------------------- |
| `defaultValue` | `boolean` | `false` | Initial checked state |

### Validation

```tsx
FormFieldClass.checkbox('agreeToTerms', {
  label: 'I agree to the terms and conditions',
  validate: (value) => value === true || 'You must agree to continue',
})
```

---

## Switch

A toggle switch for boolean values. Visually different from a checkbox — commonly used for settings and preferences.

```tsx
FormFieldClass.switch('emailNotifications', {
  label: 'Email Notifications',
  defaultValue: true,
  helpText: 'Receive email alerts when someone mentions you',
})
```

### Switch-specific options

| Option         | Type      | Default | Description          |
| -------------- | --------- | ------- | -------------------- |
| `defaultValue` | `boolean` | `false` | Initial toggle state |

**When to use Switch vs Checkbox:** Use a switch for settings that take effect immediately or represent an on/off state. Use a checkbox for consent, agreement, or when the state change happens on form submission.

---

## CustomCheckbox

A checkbox with fully customizable styling. Useful when the default checkbox doesn't match your design system.

```tsx
FormFieldClass.customCheckbox('featured', {
  label: 'Featured Item',
  helpText: 'Featured items appear on the homepage',
})
```

### CustomCheckbox-specific options

| Option         | Type      | Default | Description           |
| -------------- | --------- | ------- | --------------------- |
| `defaultValue` | `boolean` | `false` | Initial checked state |

The custom checkbox renders with theme-controlled classes, giving you full control over its appearance through the theming system.

---

## Common patterns

### Terms and conditions with link

```tsx
FormFieldClass.checkbox('acceptTerms', {
  label: 'I accept the Terms of Service and Privacy Policy',
  required: true,
  validate: (value) => value === true || 'You must accept the terms',
})
```

### Settings form with switches

```tsx
const fields = [
  FormFieldClass.switch('darkMode', {
    label: 'Dark Mode',
    defaultValue: false,
  }),
  FormFieldClass.switch('emailNotifications', {
    label: 'Email Notifications',
    defaultValue: true,
    helpText: 'Receive updates via email',
  }),
  FormFieldClass.switch('smsNotifications', {
    label: 'SMS Notifications',
    defaultValue: false,
    helpText: 'Receive updates via text message',
  }),
  FormFieldClass.switch('twoFactor', {
    label: 'Two-Factor Authentication',
    defaultValue: false,
    helpText: 'Add an extra layer of security to your account',
  }),
]
```

### Conditional fields based on checkbox

```tsx
const fields = [
  FormFieldClass.checkbox('isCompany', {
    label: 'This is a business account',
  }),
  FormFieldClass.text('companyName', {
    label: 'Company Name',
    required: true,
    showWhen: (values) => values.isCompany === true,
    requiredWhen: (values) => values.isCompany === true,
  }),
  FormFieldClass.text('taxId', {
    label: 'Tax ID',
    showWhen: (values) => values.isCompany === true,
  }),
]
```

### Feature flags form

```tsx
const featureFlags = [
  FormFieldClass.switch('enableBetaFeatures', {
    label: 'Beta Features',
    helpText: 'Enable experimental features that are still in testing',
  }),
  FormFieldClass.switch('enableAnalytics', {
    label: 'Usage Analytics',
    defaultValue: true,
    helpText: 'Help us improve by sending anonymous usage data',
  }),
  FormFieldClass.switch('enableAutoSave', {
    label: 'Auto-Save',
    defaultValue: true,
    helpText: 'Automatically save changes as you work',
  }),
]
```
