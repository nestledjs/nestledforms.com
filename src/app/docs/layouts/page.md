---
title: Layouts
nextjs:
  metadata:
    description: Control how Nestled Forms fields are arranged — single column, multi-column grids, horizontal labels, and custom wrappers.
---

Control how form fields are arranged — single column, multi-column grids, horizontal labels, and custom wrappers. {% .lead %}

---

## Single column (default)

By default, fields stack vertically in a single column:

```tsx
const fields = [
  FormFieldClass.text('name', { label: 'Name' }),
  FormFieldClass.email('email', { label: 'Email' }),
  FormFieldClass.textArea('message', { label: 'Message' }),
]

<Form id="contact" fields={fields} submit={save}>
  <button type="submit">Submit</button>
</Form>
```

---

## Multi-column with CSS Grid

Use `wrapperClassName` on fields to control their grid placement. Wrap the form in a grid container.

### Two-column layout

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
    wrapperClassName: 'col-span-2', // Full width
  }),
  FormFieldClass.phone('phone', {
    label: 'Phone',
    wrapperClassName: 'col-span-1',
  }),
  FormFieldClass.text('company', {
    label: 'Company',
    wrapperClassName: 'col-span-1',
  }),
]
```

For declarative forms, apply the grid to the form's container. The form renders fields inside a `div` that you can target with CSS.

### Three-column layout

```tsx
const addressFields = [
  FormFieldClass.text('street', {
    label: 'Street Address',
    wrapperClassName: 'col-span-3', // Full width
  }),
  FormFieldClass.text('city', {
    label: 'City',
    wrapperClassName: 'col-span-1',
  }),
  FormFieldClass.select('state', {
    label: 'State',
    options: stateOptions,
    wrapperClassName: 'col-span-1',
  }),
  FormFieldClass.text('zip', {
    label: 'ZIP Code',
    wrapperClassName: 'col-span-1',
  }),
]
```

---

## Multi-column with Flexbox

Use flex classes on `wrapperClassName`:

```tsx
const fields = [
  FormFieldClass.text('firstName', {
    label: 'First Name',
    wrapperClassName: 'flex-1',
  }),
  FormFieldClass.text('lastName', {
    label: 'Last Name',
    wrapperClassName: 'flex-1',
  }),
]
```

---

## Imperative layout control

The imperative API gives you direct control over HTML structure:

```tsx
<Form id="complex" submit={save}>
  <div className="grid grid-cols-3 gap-4">
    <div className="col-span-2">
      <RenderFormField
        field={FormFieldClass.text('title', { label: 'Title' })}
      />
    </div>
    <div>
      <RenderFormField
        field={FormFieldClass.select('status', {
          label: 'Status',
          options: statusOptions,
        })}
      />
    </div>
  </div>

  <div className="mt-6">
    <RenderFormField
      field={FormFieldClass.textArea('description', {
        label: 'Description',
        rows: 6,
      })}
    />
  </div>

  <div className="mt-6 grid grid-cols-2 gap-4">
    <RenderFormField
      field={FormFieldClass.datePicker('startDate', { label: 'Start' })}
    />
    <RenderFormField
      field={FormFieldClass.datePicker('endDate', { label: 'End' })}
    />
  </div>

  <div className="mt-8 flex justify-end gap-3">
    <button type="button" className="btn-secondary">
      Cancel
    </button>
    <button type="submit" className="btn-primary">
      Save
    </button>
  </div>
</Form>
```

---

## Horizontal labels

Use the `layout` option to display labels alongside inputs instead of above them:

```tsx
FormFieldClass.text('name', {
  label: 'Full Name',
  layout: 'horizontal', // Label appears to the left of the input
})
```

### Settings-style form

```tsx
const settingsFields = [
  FormFieldClass.text('displayName', {
    label: 'Display Name',
    layout: 'horizontal',
  }),
  FormFieldClass.email('email', {
    label: 'Email Address',
    layout: 'horizontal',
  }),
  FormFieldClass.select('language', {
    label: 'Language',
    layout: 'horizontal',
    options: languageOptions,
  }),
  FormFieldClass.select('timezone', {
    label: 'Timezone',
    layout: 'horizontal',
    options: timezoneOptions,
  }),
  FormFieldClass.switch('notifications', {
    label: 'Email Notifications',
    layout: 'horizontal',
  }),
]
```

---

## Custom wrappers

Wrap individual fields in custom HTML for complete layout control:

```tsx
FormFieldClass.text('priority', {
  label: 'Priority Level',
  customWrapper: (children) => (
    <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
      <div className="mb-2 flex items-center gap-2">
        <span className="text-sm font-bold text-amber-600">HIGH PRIORITY</span>
      </div>
      {children}
    </div>
  ),
})
```

---

## Section-based forms

Use content fields and imperative layout to create sections:

### With content fields (declarative)

```tsx
const fields = [
  FormFieldClass.content('personalSection', {
    content: 'Personal Information',
    wrapperClassName:
      'col-span-2 text-lg font-bold border-b border-gray-200 pb-2',
  }),
  FormFieldClass.text('firstName', {
    label: 'First Name',
    wrapperClassName: 'col-span-1',
  }),
  FormFieldClass.text('lastName', {
    label: 'Last Name',
    wrapperClassName: 'col-span-1',
  }),

  FormFieldClass.content('addressSection', {
    content: 'Address',
    wrapperClassName:
      'col-span-2 text-lg font-bold border-b border-gray-200 pb-2 mt-6',
  }),
  FormFieldClass.text('street', {
    label: 'Street',
    wrapperClassName: 'col-span-2',
  }),
  FormFieldClass.text('city', {
    label: 'City',
    wrapperClassName: 'col-span-1',
  }),
  FormFieldClass.text('zip', { label: 'ZIP', wrapperClassName: 'col-span-1' }),
]
```

### With JSX sections (imperative)

```tsx
<Form id="application" submit={save}>
  <section className="mb-8">
    <h2 className="mb-4 text-xl font-bold">Personal Information</h2>
    <div className="grid grid-cols-2 gap-4">
      <RenderFormField
        field={FormFieldClass.text('firstName', { label: 'First Name' })}
      />
      <RenderFormField
        field={FormFieldClass.text('lastName', { label: 'Last Name' })}
      />
    </div>
  </section>

  <section className="mb-8">
    <h2 className="mb-4 text-xl font-bold">Professional Details</h2>
    <RenderFormField
      field={FormFieldClass.text('company', { label: 'Company' })}
    />
    <RenderFormField
      field={FormFieldClass.text('title', { label: 'Job Title' })}
    />
  </section>

  <button type="submit">Submit Application</button>
</Form>
```

---

## Responsive layouts

Use Tailwind's responsive prefixes in `wrapperClassName`:

```tsx
FormFieldClass.text('firstName', {
  label: 'First Name',
  wrapperClassName: 'col-span-2 sm:col-span-1', // Full width on mobile, half on desktop
})
```
