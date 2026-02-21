---
title: Date & time fields
---

Date picker, time picker, and datetime picker fields for capturing temporal data. {% .lead %}

---

## DatePicker

A date input field with a calendar picker.

```tsx
FormFieldClass.datePicker('birthDate', {
  label: 'Date of Birth',
  required: true,
})
```

### DatePicker-specific options

| Option         | Type             | Default | Description        |
| -------------- | ---------------- | ------- | ------------------ |
| `placeholder`  | `string`         | —       | Placeholder text   |
| `defaultValue` | `string \| Date` | —       | Initial date value |

### Date format

Dates are stored as ISO 8601 strings (`YYYY-MM-DD`). The display format follows the user's locale.

---

## DateTimePicker

A combined date and time input field.

```tsx
FormFieldClass.dateTimePicker('eventStart', {
  label: 'Event Start',
  required: true,
  helpText: 'When does the event begin?',
})
```

### DateTimePicker-specific options

| Option         | Type             | Default | Description            |
| -------------- | ---------------- | ------- | ---------------------- |
| `placeholder`  | `string`         | —       | Placeholder text       |
| `defaultValue` | `string \| Date` | —       | Initial datetime value |

### DateTime format

DateTime values are stored as ISO 8601 strings with timezone information.

---

## TimePicker

A time-only input field.

```tsx
FormFieldClass.timePicker('openingTime', {
  label: 'Opening Time',
  required: true,
})
```

### TimePicker-specific options

| Option         | Type     | Default | Description        |
| -------------- | -------- | ------- | ------------------ |
| `placeholder`  | `string` | —       | Placeholder text   |
| `defaultValue` | `string` | —       | Initial time value |

---

## Common patterns

### Date range

```tsx
const fields = [
  FormFieldClass.datePicker('startDate', {
    label: 'Start Date',
    required: true,
    wrapperClassName: 'col-span-1',
  }),
  FormFieldClass.datePicker('endDate', {
    label: 'End Date',
    required: true,
    wrapperClassName: 'col-span-1',
    validateWithForm: (value, formValues) => {
      if (
        formValues.startDate &&
        new Date(value) < new Date(formValues.startDate)
      ) {
        return 'End date must be after start date'
      }
      return true
    },
    validationDependencies: ['startDate'],
  }),
]
```

### Event scheduling

```tsx
const fields = [
  FormFieldClass.text('eventName', {
    label: 'Event Name',
    required: true,
  }),
  FormFieldClass.dateTimePicker('startTime', {
    label: 'Start Time',
    required: true,
  }),
  FormFieldClass.dateTimePicker('endTime', {
    label: 'End Time',
    required: true,
    validateWithForm: (value, formValues) => {
      if (
        formValues.startTime &&
        new Date(value) <= new Date(formValues.startTime)
      ) {
        return 'End time must be after start time'
      }
      return true
    },
    validationDependencies: ['startTime'],
  }),
  FormFieldClass.select('timezone', {
    label: 'Timezone',
    defaultValue: 'America/New_York',
    options: [
      { value: 'America/New_York', label: 'Eastern Time' },
      { value: 'America/Chicago', label: 'Central Time' },
      { value: 'America/Denver', label: 'Mountain Time' },
      { value: 'America/Los_Angeles', label: 'Pacific Time' },
    ],
  }),
]
```

### Business hours

```tsx
const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']

const fields = days.flatMap((day) => [
  FormFieldClass.checkbox(`${day.toLowerCase()}Enabled`, {
    label: day,
    defaultValue: true,
  }),
  FormFieldClass.timePicker(`${day.toLowerCase()}Open`, {
    label: `${day} Open`,
    defaultValue: '09:00',
    showWhen: (values) => values[`${day.toLowerCase()}Enabled`],
    wrapperClassName: 'col-span-1',
  }),
  FormFieldClass.timePicker(`${day.toLowerCase()}Close`, {
    label: `${day} Close`,
    defaultValue: '17:00',
    showWhen: (values) => values[`${day.toLowerCase()}Enabled`],
    wrapperClassName: 'col-span-1',
  }),
])
```

### Conditional date fields

```tsx
FormFieldClass.datePicker('deadline', {
  label: 'Deadline',
  showWhen: (values) => values.hasDeadline === true,
  requiredWhen: (values) => values.hasDeadline === true,
  validate: (value) => {
    if (new Date(value) < new Date()) {
      return 'Deadline must be in the future'
    }
    return true
  },
})
```

### Transform dates on submit

```tsx
FormFieldClass.datePicker('birthDate', {
  label: 'Date of Birth',
  submitTransform: (value) => new Date(value).toISOString(),
})
```
