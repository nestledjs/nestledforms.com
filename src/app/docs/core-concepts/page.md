---
title: Core concepts
nextjs:
  metadata:
    description: Understand how Nestled Forms works — the declarative and imperative dual API, FormFieldClass factory, form context, and the patterns that power the library.
---

Understand how Nestled Forms works — the dual API, FormFieldClass factory, form context, and the patterns that make the library powerful. {% .lead %}

---

## The dual API

Nestled Forms provides two ways to build forms: **declarative** and **imperative**. You can use either approach exclusively, or combine them in a single form.

### Declarative

Pass an array of field definitions to the `Form` component's `fields` prop. The form renders all fields automatically in order.

```tsx
import { Form, FormFieldClass } from '@nestledjs/forms'

const fields = [
  FormFieldClass.text('firstName', { label: 'First Name', required: true }),
  FormFieldClass.text('lastName', { label: 'Last Name', required: true }),
  FormFieldClass.email('email', { label: 'Email', required: true }),
]

<Form id="contact" fields={fields} submit={(values) => save(values)}>
  <button type="submit">Submit</button>
</Form>
```

**When to use:** Standard forms where you want concise, data-driven field definitions. Great for forms generated from configuration or when field order matches render order.

### Imperative

Use the `RenderFormField` component to place individual fields anywhere inside the form. No `fields` prop is needed on the `Form` component.

```tsx
import { Form, RenderFormField, FormFieldClass } from '@nestledjs/forms'
;<Form id="contact" submit={(values) => save(values)}>
  <div className="grid grid-cols-2 gap-4">
    <RenderFormField
      field={FormFieldClass.text('firstName', { label: 'First Name' })}
    />
    <RenderFormField
      field={FormFieldClass.text('lastName', { label: 'Last Name' })}
    />
  </div>
  <RenderFormField field={FormFieldClass.email('email', { label: 'Email' })} />
  <button type="submit">Submit</button>
</Form>
```

**When to use:** Complex layouts, forms with custom content between fields, or when you need programmatic control over field placement.

### Mixed

Combine both: use the `fields` array for the bulk of the form, and add additional `RenderFormField` components for extra fields that need special positioning.

```tsx
const baseFields = [
  FormFieldClass.text('name', { label: 'Name' }),
  FormFieldClass.email('email', { label: 'Email' }),
]

<Form id="mixed" fields={baseFields} submit={save}>
  <h3>Additional Information</h3>
  <RenderFormField field={FormFieldClass.textArea('notes', { label: 'Notes' })} />
  <button type="submit">Submit</button>
</Form>
```

---

## FormFieldClass

`FormFieldClass` is a factory class with static methods for creating field definitions. Each method corresponds to a field type and returns a typed field configuration object.

### Factory methods

Every factory method follows the same signature:

```tsx
FormFieldClass.fieldType(key: string, options?: FieldOptions)
```

- **key** — A unique string identifier for the field. This becomes the property name in the form values object.
- **options** — An optional configuration object. Each field type has its own specific options, plus shared options that all fields support.

### Example

```tsx
const field = FormFieldClass.text('username', {
  label: 'Username',
  required: true,
  placeholder: 'Enter your username',
  validate: (value) => value.length >= 3 || 'Must be at least 3 characters',
})
```

The returned object contains the field type, key, and all options. You never need to construct field objects manually.

---

## Shared field options

Every field type inherits these options:

### Display

| Option        | Type      | Description                          |
| ------------- | --------- | ------------------------------------ |
| `label`       | `string`  | Label text displayed above the field |
| `placeholder` | `string`  | Placeholder text inside the field    |
| `helpText`    | `string`  | Help text displayed below the field  |
| `hidden`      | `boolean` | Whether the field is hidden          |

### State

| Option          | Type                    | Description                    |
| --------------- | ----------------------- | ------------------------------ |
| `required`      | `boolean`               | Whether the field is required  |
| `disabled`      | `boolean`               | Whether the field is disabled  |
| `readOnly`      | `boolean`               | Whether the field is read-only |
| `readOnlyStyle` | `'value' \| 'disabled'` | How read-only fields appear    |
| `defaultValue`  | `any`                   | Default value for the field    |

### Conditional logic

| Option         | Type                      | Description                           |
| -------------- | ------------------------- | ------------------------------------- |
| `showWhen`     | `(formValues) => boolean` | Show/hide based on other field values |
| `requiredWhen` | `(formValues) => boolean` | Make required based on conditions     |
| `disabledWhen` | `(formValues) => boolean` | Disable based on conditions           |
| `validateWhen` | `(formValues) => boolean` | Only validate when condition is met   |

### Validation

| Option                   | Type                                    | Description                       |
| ------------------------ | --------------------------------------- | --------------------------------- |
| `validate`               | `(value) => true \| string \| Promise`  | Validation function               |
| `schema`                 | `ZodTypeAny`                            | Zod validation schema             |
| `validateWithForm`       | `(value, formValues) => true \| string` | Cross-field validation            |
| `validationDependencies` | `string[]`                              | Fields that trigger re-validation |
| `validationGroup`        | `string`                                | Group for multi-step validation   |
| `errorMessages`          | `object`                                | Custom error messages             |

### Layout

| Option             | Type                         | Description                     |
| ------------------ | ---------------------------- | ------------------------------- |
| `wrapperClassName` | `string`                     | CSS class for the field wrapper |
| `layout`           | `'horizontal' \| 'vertical'` | Label/input arrangement         |
| `customWrapper`    | `(children) => JSX.Element`  | Custom wrapper component        |

### Transform

| Option            | Type                 | Description                            |
| ----------------- | -------------------- | -------------------------------------- |
| `submitTransform` | `(value) => unknown` | Transform value before form submission |

---

## Form component

The `Form` component is the top-level wrapper for all fields. It manages form state, validation, and submission.

### Props

```tsx
interface FormProps<T> {
  id: string // Unique form identifier
  fields?: FormField[] // Declarative field definitions
  submit: (values: T) => void // Submit handler
  initialValues?: Partial<T> // Pre-fill form values
  readOnly?: boolean // Make all fields read-only
  theme?: FormTheme // Custom theme
  validateOnBlur?: boolean // Validate fields on blur
  validateOnChange?: boolean // Validate fields on change
  children?: React.ReactNode // Child elements (buttons, imperative fields)
}
```

### Example with all features

```tsx
<Form<InvoiceFormValues>
  id="invoice-form"
  fields={invoiceFields}
  initialValues={{ currency: 'USD', status: 'DRAFT' }}
  submit={handleSubmit}
  readOnly={isViewMode}
  theme={customTheme}
  validateOnBlur
>
  <div className="flex gap-4">
    <button type="submit">Save Invoice</button>
    <button type="button" onClick={onCancel}>
      Cancel
    </button>
  </div>
</Form>
```

---

## Form context

Inside a `Form`, any child component can access form state through the `useFormContext` hook.

```tsx
import { useFormContext } from '@nestledjs/forms'

function SubmitButton() {
  const { formValues, errors, isSubmitting } = useFormContext()

  return (
    <button
      type="submit"
      disabled={isSubmitting || Object.keys(errors).length > 0}
    >
      {isSubmitting ? 'Saving...' : 'Submit'}
    </button>
  )
}
```

The context provides:

| Property       | Type                   | Description                        |
| -------------- | ---------------------- | ---------------------------------- |
| `formValues`   | `object`               | Current values of all fields       |
| `errors`       | `object`               | Current validation errors          |
| `isSubmitting` | `boolean`              | Whether the form is submitting     |
| `setValue`     | `(key, value) => void` | Programmatically set a field value |
| `setError`     | `(key, error) => void` | Programmatically set a field error |
| `reset`        | `() => void`           | Reset form to initial values       |

---

## Reading values reactively

To render from a field's value — a summary line, a conditional section, a custom field
reflecting a sibling's answer — use `useFormValue`. It subscribes the component that
calls it, so it re-renders wherever you use it.

```tsx
import { Form, useFormValue } from '@nestledjs/forms'

function Mirror() {
  const answer = useFormValue<string>('answer')
  return <p>You picked: {answer}</p>
}

;<Form
  id="quiz"
  submit={handleSubmit}
  defaultValues={{ answer: '' }}
  fields={fields}
>
  <Mirror />
</Form>
```

Use `useFormValues()` to read the whole form.

{% callout type="warning" title="Don't use form.watch() to read during render" %}
`form.watch(name)` compiles, returns the correct value on first render, and then
silently never updates — no error, no warning, no type error.

`watch()` re-renders only the component that owns `useForm()`, which is `Form` itself.
`Form` passes `children` straight through, so React sees the same element reference and
skips reconciling that subtree — your component is never reached.

Use `useFormValue` instead. The callback form, `form.watch(cb)`, is fine: it returns a
real subscription rather than relying on a re-render. `getValues`, `setValue` and
`register` all behave normally.
{% /callout %}

---

## Form config context

Access form configuration through `useFormConfig`:

```tsx
import { useFormConfig } from '@nestledjs/forms'

function CustomField() {
  const { readOnly, validateOnBlur } = useFormConfig()
  // ...
}
```

---

## Theme context

Access the current theme through `useFormTheme`:

```tsx
import { useFormTheme } from '@nestledjs/forms'

function CustomField() {
  const theme = useFormTheme()
  return <input className={theme.input} />
}
```

---

## Field types at a glance

| Category         | Field types                                                                          |
| ---------------- | ------------------------------------------------------------------------------------ |
| **Text input**   | `text`, `textArea`, `email`, `password`, `url`, `phone`                              |
| **Numeric**      | `number`, `currency`                                                                 |
| **Selection**    | `select`, `multiSelect`, `enumSelect`, `radio`, `checkboxGroup`                      |
| **Search**       | `searchSelect`, `searchSelectApollo`, `searchSelectMulti`, `searchSelectMultiApollo` |
| **Boolean**      | `checkbox`, `switch`, `customCheckbox`                                               |
| **Date & time**  | `datePicker`, `dateTimePicker`, `timePicker`                                         |
| **Rich content** | `markdownEditor`, `content`, `custom`, `button`                                      |

Each category has a dedicated documentation page with detailed options, examples, and usage patterns.
