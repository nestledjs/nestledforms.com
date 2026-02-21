---
title: Rich content fields
nextjs:
  metadata:
    description: Nestled Forms fields for rich text editing, static content display, fully custom components, and action buttons.
---

Fields for rich text editing, static content display, fully custom components, and action buttons. {% .lead %}

---

## MarkdownEditor

A rich text editor that outputs both markdown and HTML. Powered by MDX Editor with a full toolbar.

```tsx
FormFieldClass.markdownEditor('description', {
  label: 'Description',
  required: true,
  helpText: 'Use markdown to format your content',
})
```

### MarkdownEditor-specific options

| Option        | Type     | Default | Description      |
| ------------- | -------- | ------- | ---------------- |
| `placeholder` | `string` | —       | Placeholder text |

### Features

- **Toolbar**: Bold, italic, headings, lists, links, code blocks, and more
- **Dual output**: Stores both the raw markdown and rendered HTML
- **Image upload**: Supports embedding images
- **Live preview**: See formatted output as you type
- **Keyboard shortcuts**: Standard markdown shortcuts (Ctrl+B for bold, etc.)

### Setup

The markdown editor requires an additional dependency:

```shell
npm install @mdxeditor/editor
```

Import the CSS in your application's entry point:

```tsx
import '@mdxeditor/editor/style.css'
```

### Value format

The markdown editor stores a value with both formats:

```tsx
{
  markdown: '# Hello\n\nThis is **bold** text.',
  html: '<h1>Hello</h1><p>This is <strong>bold</strong> text.</p>'
}
```

Use `submitTransform` if you only need one format:

```tsx
FormFieldClass.markdownEditor('content', {
  label: 'Content',
  submitTransform: (value) => value.markdown, // Only submit the markdown
})
```

---

## Content

A display-only field for showing static content, instructions, or messages within a form. Content fields do not collect any data.

```tsx
FormFieldClass.content('instructions', {
  label: 'Important',
  content:
    'Please fill out all required fields before submitting. Your information will be reviewed within 24 hours.',
})
```

### Content-specific options

| Option    | Type                  | Default | Description            |
| --------- | --------------------- | ------- | ---------------------- |
| `content` | `string \| ReactNode` | —       | The content to display |

### Use cases

- Section headers or dividers within a form
- Contextual help or instructions
- Legal text or disclaimers
- Dynamic messages based on form state

### Conditional content

```tsx
FormFieldClass.content('warning', {
  label: 'Warning',
  content:
    'You are about to create a public listing. This action cannot be undone.',
  showWhen: (values) => values.visibility === 'public',
})
```

---

## Custom

A fully custom field that renders your own React component while integrating with the form's state management and validation.

```tsx
FormFieldClass.custom('colorPicker', {
  label: 'Brand Color',
  component: ({ value, onChange, error }) => (
    <div>
      <input
        type="color"
        value={value || '#000000'}
        onChange={(e) => onChange(e.target.value)}
      />
      {error && <span className="text-red-500">{error}</span>}
    </div>
  ),
  validate: (value) => value !== '#000000' || 'Please choose a color',
})
```

### Custom-specific options

| Option      | Type                     | Default | Description            |
| ----------- | ------------------------ | ------- | ---------------------- |
| `component` | `(props) => JSX.Element` | —       | Custom React component |

### Component props

Your custom component receives:

| Prop       | Type                  | Description                    |
| ---------- | --------------------- | ------------------------------ |
| `value`    | `any`                 | Current field value            |
| `onChange` | `(value) => void`     | Update the field value         |
| `error`    | `string \| undefined` | Current validation error       |
| `disabled` | `boolean`             | Whether the field is disabled  |
| `readOnly` | `boolean`             | Whether the field is read-only |

### Advanced custom field

```tsx
FormFieldClass.custom('fileUpload', {
  label: 'Upload Document',
  required: true,
  component: ({ value, onChange, error, disabled }) => (
    <div className="rounded-lg border-2 border-dashed p-6 text-center">
      {value ? (
        <div>
          <p>{value.name}</p>
          <button onClick={() => onChange(null)}>Remove</button>
        </div>
      ) : (
        <input
          type="file"
          disabled={disabled}
          onChange={(e) => onChange(e.target.files?.[0])}
          accept=".pdf,.doc,.docx"
        />
      )}
      {error && <p className="mt-2 text-red-500">{error}</p>}
    </div>
  ),
  validate: (value) => value != null || 'Please upload a document',
})
```

---

## Button

An action button within the form. Useful for adding buttons that perform actions other than form submission.

```tsx
FormFieldClass.button('addItem', {
  label: 'Add Line Item',
  onClick: () => {
    // Add a new item to the form
  },
})
```

### Button-specific options

| Option    | Type         | Default | Description          |
| --------- | ------------ | ------- | -------------------- |
| `onClick` | `() => void` | —       | Click handler        |
| `variant` | `string`     | —       | Button style variant |

### Use cases

```tsx
const fields = [
  // ... other fields
  FormFieldClass.button('preview', {
    label: 'Preview',
    onClick: () => setShowPreview(true),
  }),
  FormFieldClass.button('reset', {
    label: 'Reset to Defaults',
    onClick: () => resetForm(),
  }),
]
```

---

## Common patterns

### Multi-section form with content dividers

```tsx
const fields = [
  FormFieldClass.content('personalInfo', {
    content: 'Personal Information',
    wrapperClassName: 'col-span-2 font-bold text-lg border-b pb-2',
  }),
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

  FormFieldClass.content('addressInfo', {
    content: 'Address Information',
    wrapperClassName: 'col-span-2 font-bold text-lg border-b pb-2 mt-4',
  }),
  FormFieldClass.text('street', {
    label: 'Street Address',
    wrapperClassName: 'col-span-2',
  }),
  FormFieldClass.text('city', {
    label: 'City',
    wrapperClassName: 'col-span-1',
  }),
  FormFieldClass.text('zip', {
    label: 'ZIP Code',
    wrapperClassName: 'col-span-1',
  }),
]
```

### Rich text with character count

```tsx
FormFieldClass.markdownEditor('article', {
  label: 'Article Body',
  required: true,
  validate: (value) => {
    if (!value?.markdown || value.markdown.length < 100) {
      return 'Article must be at least 100 characters'
    }
    if (value.markdown.length > 10000) {
      return 'Article must be less than 10,000 characters'
    }
    return true
  },
})
```
