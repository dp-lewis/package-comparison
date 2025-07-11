# HTML Output Template Plan

This document outlines the plan for making the HTML output of the package comparison utility configurable via templates.

---

## 1. Template File Support
- Allow users to provide a custom HTML template file (e.g., via a CLI argument or config).
- If no template is provided, use a default built-in template.

## 2. Template Placeholders
- Define placeholders in the template (e.g., `{{title}}`, `{{dependencies}}`, `{{devDependencies}}`).
- At runtime, replace these placeholders with generated HTML sections.

## 3. CLI/Config Integration
- Add a CLI argument (e.g., `--template <path>`) to specify a template file.
- Optionally, support a config file for more advanced customization.

## 4. Implementation Steps
1. Create a default HTML template as a string or file.
2. Add logic to read a user-supplied template if provided.
3. Implement a simple placeholder replacement system.
4. Update the HTML output logic to use the template and inject the diff content.

## 5. Documentation & Examples
- Document how to use and customize templates in the README.
- Provide an example template file.

---

This plan can be updated as the feature evolves.
