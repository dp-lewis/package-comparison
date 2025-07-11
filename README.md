# package-comparison 🚦
Utility to compare two package.json files to determine how different they are.

## Usage 🛠️

### 1. Compare Two package.json Files

Run the following command:

```
node compare-packages.js <base-package.json> <target-package.json> [format] [--template <template-file>]
```
- `<base-package.json>`: Path to the base (reference) package.json file
- `<target-package.json>`: Path to the target package.json file to compare
- `[format]`: (Optional) Output format: `terminal` (default), `json`, or `html`
- `[--template <template-file>]`: (Optional, for `html` format) Path to a custom HTML template file. Defaults to `templates/HTML-TEMPLATE.example.html`.

#### Example: Terminal Output
```
node compare-packages.js base-package.example.json target-package.example.json terminal
```
Sample output:
```
=== dependencies ===
+ axios@1.6.0
- lodash@4.17.21
~ express: 4.18.2 → 4.19.0
=== devDependencies ===
+ jest@29.7.0
- mocha@10.2.0
- chai@4.3.7
```

#### Example: HTML/JSON Output
```
node compare-packages.js base-package.example.json target-package.example.json html
node compare-packages.js base-package.example.json target-package.example.json json
```
Or with a custom template:
```
node compare-packages.js base-package.example.json target-package.example.json html --template templates/HTML-TEMPLATE.example.html
```
- 📄 The HTML and JSON reports will include the names and versions of the compared packages.
- 📁 The `output/` directory is ignored by Git and is the recommended location for generated reports.
- 🕒 Output filenames include the compared file names and a timestamp for traceability (e.g., `report_base_vs_target_2025-07-11T12-34-56.json`).

### 2. Output Formats 🎨
- `terminal`: Shows a colourised diff in your terminal
- `json`: Outputs the diff as JSON (written to the `output/` directory)
- `html`: Outputs the diff as an HTML report (written to the `output/` directory, customisable via template)

### 3. Run Unit Tests 🧪

To run the included unit tests:
```
node test/compare-packages.test.js
```

### 4. Run Integration Tests 🔗

To run the integration test (end-to-end):
```
node test/compare-packages.integration.test.js
```

### 5. Continuous Integration 🤖

Unit and integration tests are automatically run on every pull request via GitHub Actions.

### 6. Troubleshooting & FAQ ❓
- **No output file generated?** Ensure you have write permissions to the `output/` directory.
- **Template not found?** Check the path to your custom template or use the default in `templates/HTML-TEMPLATE.example.html`.
- **Want to compare more fields?** See the code comments for how to extend the comparison logic.

---

Feel free to contribute or suggest improvements! ✨
