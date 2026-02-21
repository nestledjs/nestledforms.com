---
title: AI prompting
nextjs:
  metadata:
    description: Ready-to-use prompt examples for building Nestled Forms with AI assistants — declarative, imperative, multi-column, conditional, and Apollo-powered forms.
---

Ready-to-use prompts for building forms with AI assistants like Claude, ChatGPT, or Copilot. Copy any prompt below and paste it into your AI tool of choice. {% .lead %}

---

## Before you start

Every prompt below starts by pointing the AI to the full Nestled Forms documentation. This is the single most important line — it gives the AI everything it needs to generate correct code.

```shell
# Give this URL to your AI assistant
https://nestledforms.com/llms-full.txt
```

If your AI does not support fetching URLs, paste the contents of that file into your context window, or use `https://nestledforms.com/llms.txt` for a shorter summary with links.

{% callout title="Import from the platform package" %}
Always import from `@nestledjs/forms` (web) or `@nestledjs/forms-native` (React Native) — never from `@nestledjs/forms-core` directly. The platform packages re-export everything from core, so Form, FormFieldClass, RenderFormField, hooks, and types all come from a single import.
{% /callout %}

---

## Simple declarative form

A good starting point. This prompt asks for a standard contact form using the declarative API — just a `fields` array and a `Form` component.

```txt
Read https://nestledforms.com/llms-full.txt for the Nestled Forms documentation.

Build a contact form using @nestledjs/forms with the declarative API.
Import everything from '@nestledjs/forms' (not forms-core).

Fields:
- Full name (text, required)
- Email (email, required, validate format)
- Subject (select with options: General, Support, Sales)
- Message (textArea, required, minimum 20 characters)

Use FormFieldClass to define fields in a `fields` array.
Pass the array to the Form component's `fields` prop.
Add a submit button as a child of the Form.
Type the form values with a TypeScript interface.
```

---

## Multi-column imperative form

This prompt asks for a two-column layout using the imperative API with `RenderFormField` and CSS Grid. Good for demonstrating layout control.

```txt
Read https://nestledforms.com/llms-full.txt for the Nestled Forms documentation.

Build a user registration form using @nestledjs/forms with the imperative API.
Import Form, RenderFormField, and FormFieldClass from '@nestledjs/forms'.

Layout:
- Use a 2-column CSS grid (Tailwind: grid grid-cols-2 gap-4)
- First name and last name side by side
- Email spanning full width (col-span-2)
- Password and confirm password side by side
- A "Role" select field spanning full width
- Submit button right-aligned below the form

Use RenderFormField to place each field manually inside the grid.
Add validation: passwords must match (use validateWithForm for cross-field
validation).
Type the form values with a TypeScript interface.
```

---

## Declarative multi-column with wrapperClassName

This prompt shows how to achieve multi-column layouts while staying fully declarative — using `wrapperClassName` on each field instead of manual JSX.

```txt
Read https://nestledforms.com/llms-full.txt for the Nestled Forms documentation.

Build an address form using @nestledjs/forms with the declarative API.
Import everything from '@nestledjs/forms'.

Use wrapperClassName on each field for a multi-column grid layout:
- Street address: full width (col-span-2)
- City: left column (col-span-1)
- State: right column (col-span-1, select with US state options)
- ZIP code: left column (col-span-1)
- Country: right column (col-span-1, select)

All fields required. Add placeholder text to each field.
The parent container should use a 2-column CSS grid.
Use FormFieldClass to define all fields in a `fields` array.
```

---

## Conditional logic and Zod validation

This prompt demonstrates conditional fields and Zod schema validation — useful for dynamic, multi-path forms.

```txt
Read https://nestledforms.com/llms-full.txt for the Nestled Forms documentation.

Build an event registration form using @nestledjs/forms.
Import everything from '@nestledjs/forms'.

Fields:
- Name (text, required)
- Email (email, required)
- Ticket type (select: Free, Standard, VIP)
- Dietary requirements (select: None, Vegetarian, Vegan, Gluten-free)
  Only show when ticket type is Standard or VIP (use showWhen)
- Company name (text)
  Only required when ticket type is VIP (use requiredWhen)
- Special requests (textArea)
  Only show when ticket type is VIP (use showWhen)

Use Zod for form-level validation with a schema prop on the Form component.
Use showWhen and requiredWhen for conditional logic.
Type the form values interface.
```

---

## Apollo GraphQL search select

This prompt builds a form with server-side search using Apollo Client — ideal for forms that query a backend API.

```txt
Read https://nestledforms.com/llms-full.txt for the Nestled Forms documentation.

Build a project assignment form using @nestledjs/forms with Apollo search
selects. Import everything from '@nestledjs/forms'.

Fields:
- Project name (text, required)
- Assignee (searchSelectApollo — queries a GET_USERS GraphQL query,
  searches by name, displays user name + email, debounced)
- Reviewer (searchSelectApollo — same query but different field)
- Priority (select: Low, Medium, High, Critical)
- Due date (datePicker, required)
- Description (textArea)

Assume the app is already wrapped in ApolloProvider.
Write the GraphQL query with a $search variable.
Show how to configure the Apollo search select with:
query, searchVariable, labelField, valueField, and debounceMs.
```

---

## Full-featured mixed form

This prompt combines everything — mixed declarative/imperative, multi-column, conditional logic, sections, theming, and custom wrappers.

```txt
Read https://nestledforms.com/llms-full.txt for the Nestled Forms documentation.

Build a job application form using @nestledjs/forms that demonstrates
multiple features together. Import everything from '@nestledjs/forms'.

Requirements:
1. Use the MIXED API: declarative fields array for basic fields,
   plus imperative RenderFormField for a custom-laid-out section.

2. Sections with headers:
   - "Personal Information" — first name, last name (2-column grid),
     email (full width), phone (full width)
   - "Professional Details" — rendered imperatively with RenderFormField
     in a 2-column grid: current company, job title, years of experience
     (number), salary expectation (currency, USD)
   - "Application" — position (select), start date (datePicker),
     cover letter (textArea, full width)

3. Conditional logic:
   - If position is "Senior" or "Lead", show a "Management experience"
     switch field using showWhen
   - If management experience is true, show "Team size" number field
     using showWhen

4. Validation:
   - Email required with format validation
   - Years of experience must be 0-50
   - Cover letter required, minimum 100 characters

5. Use wrapperClassName for multi-column layout in declarative sections.
   Use CSS grid divs for imperative sections.

6. Add a custom theme that changes the primary button to indigo
   and input borders to slate-300.
```

---

## Tips for better results

- **Always include the docs URL.** The single biggest improvement to AI-generated Nestled Forms code is giving the AI the full documentation via `https://nestledforms.com/llms-full.txt`.
- **Specify the import.** Explicitly say `import from '@nestledjs/forms'` — older AI training data may use outdated import paths.
- **Name the API style.** Say "declarative" (fields array), "imperative" (RenderFormField), or "mixed" so the AI picks the right pattern.
- **Mention wrapperClassName for layouts.** If you want multi-column in declarative mode, tell the AI to use `wrapperClassName` with CSS grid classes — otherwise it may default to imperative layout.
- **Ask for TypeScript interfaces.** Nestled Forms is fully typed. Asking for a form values interface ensures the AI generates type-safe code.
