---
title: Rich content fields
nextjs:
  metadata:
    description: Nestled Forms fields for rich text editing, static content display, fully custom components, and action buttons.
---

Fields for rich text editing, static content display, fully custom components, and action buttons. {% .lead %}

---

## MarkdownEditor

A rich text editor that outputs both markdown and HTML. Powered by MDX Editor with a full toolbar including a heading picker (Normal / H1 / H2 / H3).

```tsx
FormFieldClass.markdownEditor('description', {
  label: 'Description',
  required: true,
  helpText: 'Use markdown to format your content',
})
```

### MarkdownEditor-specific options

| Option               | Type                                  | Default                                                  | Description                                          |
| -------------------- | ------------------------------------- | -------------------------------------------------------- | ---------------------------------------------------- |
| `placeholder`        | `string`                              | —                                                        | Placeholder text                                     |
| `height`             | `number`                              | `300`                                                    | Editor height in pixels                              |
| `maxLength`          | `number`                              | —                                                        | Maximum character count                              |
| `disabled`           | `boolean`                             | `false`                                                  | Disables the editor                                  |
| `readOnly`           | `boolean`                             | `false`                                                  | Renders in read-only mode                            |
| `readOnlyStyle`      | `'value' \| 'disabled'`               | `'value'`                                                | How read-only is displayed                           |
| `outputFormat`       | `'markdown' \| 'html' \| 'both'`      | `'markdown'`                                             | Output format                                        |
| `onHtmlChange`       | `(html: string) => void`              | —                                                        | Callback for HTML output                             |
| `enableImageUpload`  | `boolean`                             | `false`                                                  | Enables image insertion                              |
| `imageUploadHandler` | `(file: File) => Promise<string>`     | —                                                        | Custom upload handler                                |
| `imageUploadMode`    | `'base64' \| 'custom' \| 'immediate'` | `'base64'`                                               | How images are stored                                |
| `maxImageSize`       | `number`                              | `5242880`                                                | Max image size in bytes (5 MB)                       |
| `allowedImageTypes`  | `string[]`                            | `['image/png', 'image/jpeg', 'image/gif', 'image/webp']` | Accepted image types                                 |
| `overlayContainer`   | `HTMLElement \| null`                 | —                                                        | Container for popups (fixes modal z-index conflicts) |
| `popupZIndex`        | `number`                              | —                                                        | Z-index override for popups                          |
| `plugins`            | `Plugin[]`                            | —                                                        | Custom MDXEditor plugins — replaces all defaults     |

### Features

- **Heading picker**: Choose Normal, H1, H2, or H3 from the toolbar
- **Rich text toolbar**: Bold, italic, underline, code, lists, links
- **Dual output**: Stores both raw markdown and rendered HTML
- **Image upload**: Supports base64 or custom upload handlers
- **Keyboard shortcuts**: Standard shortcuts (Ctrl+B for bold, etc.)
- **Read-only mode**: Display content without editing

### Setup

The markdown editor requires an additional dependency:

```shell
npm install @mdxeditor/editor
```

Import the CSS in your application's entry point:

```tsx
import '@mdxeditor/editor/style.css'
```

### Image upload

```tsx
FormFieldClass.markdownEditor('content', {
  label: 'Content',
  enableImageUpload: true,
  imageUploadMode: 'custom',
  imageUploadHandler: async (file) => {
    const formData = new FormData()
    formData.append('image', file)
    const { url } = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    }).then((r) => r.json())
    return url
  },
})
```

### Dual format output

When `outputFormat` is `'both'`, the form data contains two keys: the field name for the raw markdown and `{fieldName}_html` for the rendered HTML.

```tsx
FormFieldClass.markdownEditor('content', {
  label: 'Content',
  outputFormat: 'both',
  onHtmlChange: (html) => setRenderedHtml(html),
})

// Form data contains:
// content      → "# Hello\n\nThis is **bold**"
// content_html → "<h1>Hello</h1><p>This is <strong>bold</strong></p>"
```

### Custom plugins

Pass `plugins` to take full control of the MDXEditor plugin set. When provided it replaces all defaults — you get exactly what you pass in.

```tsx
import {
  headingsPlugin,
  listsPlugin,
  tablePlugin,
  toolbarPlugin,
  BlockTypeSelect,
  BoldItalicUnderlineToggles,
  InsertTable,
  Separator,
} from '@mdxeditor/editor'

FormFieldClass.markdownEditor('content', {
  label: 'Content',
  plugins: [
    headingsPlugin(),
    listsPlugin(),
    tablePlugin(),
    toolbarPlugin({
      toolbarContents: () => (
        <>
          <BlockTypeSelect />
          <Separator />
          <BoldItalicUnderlineToggles />
          <Separator />
          <InsertTable />
        </>
      ),
    }),
  ],
})
```

### Modal z-index conflicts

If the editor is inside a modal and link/image dialogs don't appear correctly, use one of these fixes:

```tsx
// Option 1: render popups inside your modal container
FormFieldClass.markdownEditor('content', {
  overlayContainer: document.getElementById('my-modal'),
})

// Option 2: raise the popup z-index above your modal
FormFieldClass.markdownEditor('content', {
  popupZIndex: 10000,
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
  maxLength: 10000,
  validate: (value) => {
    if (!value || value.length < 100) {
      return 'Article must be at least 100 characters'
    }
    return true
  },
})
```
