# Architectural Decision Record: Package Comparison Utility

## Status
Accepted

## Context
We needed a utility to compare `package.json` files between a base repository and its derived projects, to visualise and track differences in dependencies and devDependencies. The tool should be easy to use, configurable, and provide clear, actionable output for both humans and automation.

## Decision
- **Language & Platform:** Node.js, for native JSON support and ease of CLI scripting.
- **Comparison Scope:** Focus on `dependencies` and `devDependencies` fields, with extensibility for more fields in the future.
- **Output Formats:**
  - Colourised terminal diff for quick inspection
  - JSON report for automation and further processing
  - HTML report for visual inspection, customisable via template
- **CLI Design:**
  - Accepts base and target package.json paths, output format, and optional template path
  - Output files (JSON/HTML) are always written to an `output/` directory, which is ignored by Git
  - Output filenames include the compared file names and a timestamp for traceability
- **HTML Templating:**
  - Uses a template file with placeholders for easy customisation
  - Default template provided in `templates/HTML-TEMPLATE.example.html`
- **Testing:**
  - Unit tests for core logic and rendering
  - Integration tests that run the CLI end-to-end and verify output files
  - All tests are located in the `test/` directory
  - CI runs both unit and integration tests on every pull request
- **Project Standards:**
  - British English for documentation and comments
  - Keep dependencies to a minimum
  - Use emoji-based commit messages (see CONTRIBUTING.md)
  - All standards and instructions are documented in `CONTRIBUTING.md`

## Consequences
- The tool is robust, user-friendly, and easy to extend or customise
- Output is always organised and not committed to version control
- The project is easy for new contributors to understand and follow
- The approach supports both manual and automated workflows

## Alternatives Considered
- Using a full-featured diff library or framework (rejected for simplicity and minimal dependencies)
- Supporting more fields by default (deferred for future extensibility)
- Outputting to stdout by default for HTML/JSON (rejected in favour of always writing to files for consistency)

## Related Documents
- [CONTRIBUTING.md](../CONTRIBUTING.md)
- [README.md](../README.md)
- [docs/TEMPLATE-PLAN.md](../docs/TEMPLATE-PLAN.md)

---

*Last updated: 2025-07-11*
