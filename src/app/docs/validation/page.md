---
title: Validation
nextjs:
  metadata:
    description: Validate Nestled Forms fields with simple functions, Zod schemas, cross-field validation, and async checks.
---

Every form needs validation. Nestled Forms provides multiple approaches — from simple functions to Zod schemas to cross-field validation and async checks. {% .lead %}

---

## Simple validation

The `validate` function receives the field value and returns `true` for valid or a string error message for invalid.

```tsx
FormFieldClass.text('username', {
  label: 'Username',
  required: true,
  validate: (value) => {
    if (value.length < 3) return 'Must be at least 3 characters'
    if (value.length > 20) return 'Must be 20 characters or less'
    if (!/^[a-zA-Z0-9_]+$/.test(value))
      return 'Only letters, numbers, and underscores'
    return true
  },
})
```

---

## Required fields

Set `required: true` to enforce that the field has a value. Empty strings, `null`, and `undefined` are treated as empty.

```tsx
FormFieldClass.email('email', {
  label: 'Email',
  required: true, // Shows "Required" error if empty
})
```

`required` works reliably in every configuration, including mixed forms where other fields use Zod schemas. Two edge cases worth knowing:

- `0` counts as a filled value for required number fields
- `false` fails a required checkbox — required checkboxes have must-be-checked semantics

### Custom required message

```tsx
FormFieldClass.email('email', {
  label: 'Email',
  required: true,
  errorMessages: {
    required: 'Please provide your email address',
  },
})
```

The `errorMessages.required` override is honored for every field type and validation configuration.

### Conditional required

```tsx
FormFieldClass.text('companyName', {
  label: 'Company Name',
  requiredWhen: (formValues) => formValues.accountType === 'business',
})
```

---

## Zod schema validation

Use Zod schemas for type-safe validation with rich error messages.

```tsx
import { z } from 'zod'

FormFieldClass.text('email', {
  label: 'Email',
  schema: z.string().email('Invalid email format').min(5, 'Too short'),
})
```

```tsx
FormFieldClass.number('age', {
  label: 'Age',
  schema: z.number().int().min(18, 'Must be 18+').max(120, 'Invalid age'),
})
```

Zod validation runs automatically when the field value changes or on blur, depending on your form configuration.

---

## Cross-field validation

Use `validateWithForm` when a field's validity depends on other fields in the form.

```tsx
FormFieldClass.password('confirmPassword', {
  label: 'Confirm Password',
  required: true,
  validateWithForm: (value, formValues) => {
    if (value !== formValues.password) {
      return 'Passwords do not match'
    }
    return true
  },
  validationDependencies: ['password'],
})
```

### validationDependencies

When you use `validateWithForm`, specify `validationDependencies` to tell the form which other fields should trigger re-validation of this field.

```tsx
FormFieldClass.datePicker('endDate', {
  label: 'End Date',
  validateWithForm: (value, formValues) => {
    if (
      formValues.startDate &&
      new Date(value) <= new Date(formValues.startDate)
    ) {
      return 'End date must be after start date'
    }
    return true
  },
  validationDependencies: ['startDate'], // Re-validate when startDate changes
})
```

Without `validationDependencies`, the field only validates when its own value changes. Adding dependencies ensures validation runs when related fields change too.

---

## Async validation

The `validate` function can return a `Promise` for server-side checks.

```tsx
FormFieldClass.text('username', {
  label: 'Username',
  required: true,
  validate: async (value) => {
    const response = await fetch(`/api/check-username?q=${value}`)
    const { available } = await response.json()
    return available || 'Username is already taken'
  },
})
```

```tsx
FormFieldClass.email('email', {
  label: 'Email',
  required: true,
  validate: async (value) => {
    const exists = await checkEmailExists(value)
    return exists ? 'An account with this email already exists' : true
  },
})
```

Async validation is debounced to avoid excessive API calls.

---

## Validation groups

Validation groups allow you to validate subsets of fields — useful for multi-step forms or wizard-style UIs.

```tsx
const fields = [
  // Step 1 fields
  FormFieldClass.text('name', {
    label: 'Name',
    required: true,
    validationGroup: 'step1',
  }),
  FormFieldClass.email('email', {
    label: 'Email',
    required: true,
    validationGroup: 'step1',
  }),

  // Step 2 fields
  FormFieldClass.text('address', {
    label: 'Address',
    required: true,
    validationGroup: 'step2',
  }),
  FormFieldClass.text('city', {
    label: 'City',
    required: true,
    validationGroup: 'step2',
  }),

  // Step 3 fields
  FormFieldClass.checkbox('agreeToTerms', {
    label: 'I agree to the terms',
    validationGroup: 'step3',
    validate: (v) => v === true || 'Required',
  }),
]
```

Use `validateGroup` from the form context to validate a specific step:

```tsx
import { useFormContext } from '@nestledjs/forms'

function StepNavigation({ currentStep, onNext }) {
  const { validateGroup } = useFormContext()

  const handleNext = async () => {
    const isValid = await validateGroup(`step${currentStep}`)
    if (isValid) onNext()
  }

  return <button onClick={handleNext}>Next</button>
}
```

### Scoping the form to the active group

Pass `validationGroup` to the `Form` itself to scope validation to the current step — only fields in the active group are validated, so fields on other steps can't block submission:

```tsx
<Form
  id="multi-step-form"
  validationGroups={['step1', 'step2', 'step3']}
  validationGroup={`step${currentStep}`}
  fields={fields}
  submit={handleSubmit}
>
  <button type="submit">Next</button>
</Form>
```

---

## Conditional validation

Use `validateWhen` to only run validation when a condition is met.

```tsx
FormFieldClass.text('taxId', {
  label: 'Tax ID',
  validate: (value) =>
    /^\d{2}-\d{7}$/.test(value) || 'Invalid format (XX-XXXXXXX)',
  validateWhen: (formValues) => formValues.accountType === 'business',
})
```

When the condition is `false`, the field skips validation entirely — even if `required` is set.

---

## Validation timing

Control when validation runs:

```tsx
<Form
  id="my-form"
  fields={fields}
  submit={handleSubmit}
  validateOnBlur // Validate when field loses focus
  validateOnChange // Validate as user types
>
  <button type="submit">Submit</button>
</Form>
```

| Setting            | Behavior                                 |
| ------------------ | ---------------------------------------- |
| `validateOnBlur`   | Validates when the user leaves the field |
| `validateOnChange` | Validates on every keystroke/change      |
| Neither            | Validates only on form submission        |
| Both               | Validates on change and on blur          |

---

## Combining validation methods

You can use multiple validation approaches on the same field. They run in this order:

1. `required` check
2. `schema` (Zod) validation
3. `validate` function
4. `validateWithForm` cross-field validation

If any step fails, subsequent steps are skipped and the error is displayed immediately.

```tsx
FormFieldClass.text('username', {
  label: 'Username',
  required: true,
  schema: z.string().min(3).max(20),
  validate: async (value) => {
    const available = await checkAvailability(value)
    return available || 'Username taken'
  },
  validateWithForm: (value, formValues) => {
    if (value === formValues.email) return 'Username cannot match email'
    return true
  },
})
```

---

## Custom error messages

Override default error messages:

```tsx
FormFieldClass.email('email', {
  label: 'Email',
  required: true,
  errorMessages: {
    required: 'We need your email to create your account',
  },
})
```

---

## Error display and accessibility

Web forms render with `noValidate`, so the library's themed error messages always show instead of the browser's native validation bubbles. Errors are announced to screen readers via `role="alert"`, and invalid inputs receive `aria-invalid` and `aria-describedby` pointing at their error message.

---

## Default submit transforms

Selection fields that store option objects are automatically converted to ID strings at submit time. Default `submitTransform`s are applied for `searchSelectApollo`, `searchSelectMultiApollo`, `multiSelect`, and `searchSelectMulti` — an explicit `submitTransform` on the field still wins.

The helpers backing this behavior are exported from `@nestledjs/forms-core` (and re-exported from their previous locations):

```tsx
import {
  singleSelectSubmitTransform,
  multiSelectSubmitTransform,
} from '@nestledjs/forms-core'
```

---

## Programmatic errors

Set errors manually from the form context:

```tsx
const { setError } = useFormContext()

// After a failed API call
setError('email', 'This email is already registered')
```
