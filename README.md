# package-comparison
Utility to compare two package.json files to determine how different they are.

## Usage

### 1. Compare Two package.json Files

Run the following command:

```
node compare-packages.js <base-package.json> <target-package.json> [format]
```
- `<base-package.json>`: Path to the base (reference) package.json file
- `<target-package.json>`: Path to the target package.json file to compare
- `[format]`: (Optional) Output format: `terminal` (default), `json`, or `html`

#### Example
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

### 2. Output Formats
- `terminal`: Shows a colorized diff in your terminal
- `json`: Outputs the diff as JSON
- `html`: (Coming soon) Outputs the diff as an HTML report

### 3. Run Unit Tests

To run the included unit tests:
```
node compare-packages.test.js
```

### 4. Continuous Integration

Unit tests are automatically run on every pull request via GitHub Actions.

---

Feel free to contribute or suggest improvements!
