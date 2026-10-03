---
title: Number fields
nextjs:
  metadata:
    description: Nestled Forms numeric input fields for capturing numbers and monetary values with formatting and validation.
---

Numeric input fields for capturing numbers and monetary values with formatting and validation. {% .lead %}

---

## Number

A numeric input field with optional min, max, and step constraints.

```tsx
FormFieldClass.number('quantity', {
  label: 'Quantity',
  required: true,
  min: 1,
  max: 100,
  step: 1,
  defaultValue: 1,
  helpText: 'Enter a quantity between 1 and 100',
})
```

### Number-specific options

| Option        | Type     | Default | Description                         |
| ------------- | -------- | ------- | ----------------------------------- |
| `min`         | `number` | —       | Minimum allowed value               |
| `max`         | `number` | —       | Maximum allowed value               |
| `step`        | `number` | `1`     | Increment step for up/down controls |
| `placeholder` | `string` | —       | Placeholder text                    |

### Decimal numbers

```tsx
FormFieldClass.number('weight', {
  label: 'Weight (kg)',
  min: 0,
  step: 0.1,
  placeholder: '0.0',
})
```

### Validation

```tsx
FormFieldClass.number('age', {
  label: 'Age',
  required: true,
  validate: (value) => {
    if (value < 18) return 'Must be 18 or older'
    if (value > 120) return 'Please enter a valid age'
    return true
  },
})
```

---

## Currency

A monetary input field with currency symbol, formatting, and support for 30+ currencies.

```tsx
FormFieldClass.currency('price', {
  label: 'Price',
  required: true,
  currency: 'USD',
  helpText: 'Enter the price in US dollars',
})
```

### Currency-specific options

| Option        | Type     | Default | Description            |
| ------------- | -------- | ------- | ---------------------- |
| `currency`    | `string` | `'USD'` | ISO 4217 currency code |
| `min`         | `number` | —       | Minimum allowed value  |
| `max`         | `number` | —       | Maximum allowed value  |
| `placeholder` | `string` | —       | Placeholder text       |

### Supported currencies

The currency field supports 30+ currencies with proper symbol and formatting:

| Code  | Symbol | Name              |
| ----- | ------ | ----------------- |
| `USD` | $      | US Dollar         |
| `EUR` | E      | Euro              |
| `GBP` | £      | British Pound     |
| `JPY` | ¥      | Japanese Yen      |
| `AUD` | A$     | Australian Dollar |
| `CAD` | C$     | Canadian Dollar   |
| `CHF` | CHF    | Swiss Franc       |
| `CNY` | ¥      | Chinese Yuan      |
| `INR` | R      | Indian Rupee      |
| `BRL` | R$     | Brazilian Real    |

And many more — see the full list in the forms-core currency utilities.

### Dynamic currency selection

```tsx
const fields = [
  FormFieldClass.select('currency', {
    label: 'Currency',
    options: [
      { value: 'USD', label: 'US Dollar ($)' },
      { value: 'EUR', label: 'Euro (E)' },
      { value: 'GBP', label: 'British Pound (£)' },
    ],
    defaultValue: 'USD',
  }),
  FormFieldClass.currency('amount', {
    label: 'Amount',
    required: true,
    currency: 'USD', // Will use the default; for dynamic, handle in your component
  }),
]
```

### Value handling

The currency field stores the numeric value without formatting. Use `submitTransform` if you need to convert the value:

```tsx
FormFieldClass.currency('price', {
  label: 'Price',
  currency: 'USD',
  submitTransform: (value) => Math.round(value * 100), // Convert to cents
})
```

---

## Common patterns

### Price range

```tsx
const fields = [
  FormFieldClass.currency('minPrice', {
    label: 'Minimum Price',
    currency: 'USD',
    wrapperClassName: 'col-span-1',
  }),
  FormFieldClass.currency('maxPrice', {
    label: 'Maximum Price',
    currency: 'USD',
    wrapperClassName: 'col-span-1',
    validateWithForm: (value, formValues) => {
      if (formValues.minPrice && value < formValues.minPrice) {
        return 'Max must be greater than min'
      }
      return true
    },
    validationDependencies: ['minPrice'],
  }),
]
```

### Percentage input

```tsx
FormFieldClass.number('taxRate', {
  label: 'Tax Rate (%)',
  min: 0,
  max: 100,
  step: 0.01,
  placeholder: '0.00',
  submitTransform: (value) => value / 100, // Store as decimal
})
```
