# package-comparison
Utility to compare two package.json files to determine how different they are.

## Usage

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

#### Example: HTML Output
```
node compare-packages.js base-package.example.json target-package.example.json html > output/report.html
```
Or with a custom template:
```
node compare-packages.js base-package.example.json target-package.example.json html --template templates/HTML-TEMPLATE.example.html > output/report.html
```
- The HTML report will include the names and versions of the compared packages.
- The `output/` directory is ignored by Git and is the recommended location for generated reports.

### 2. Output Formats
- `terminal`: Shows a colorized diff in your terminal
- `json`: Outputs the diff as JSON
- `html`: Outputs the diff as an HTML report (customizable via template)

### 3. Run Unit Tests

To run the included unit tests:
```
node compare-packages.test.js
```

### 4. Continuous Integration

Unit tests are automatically run on every pull request via GitHub Actions.

---

Feel free to contribute or suggest improvements!
