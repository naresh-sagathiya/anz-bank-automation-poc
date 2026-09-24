# ANZ Bank Automation POC

Playwright, TypeScript, and Cucumber BDD automation for the ParaBank demo banking application. The framework uses Page Object Model, a shared `BasePage`, API-backed setup utilities, REST/SOAP coverage, Cucumber reporting, and GitHub Actions.

## Prerequisites

- Node.js 20 or newer
- npm 10 or newer
- Network access to the configured ParaBank environment

## Setup

```bash
npm install
npm run install:browsers
```

Create a local environment file:

PowerShell:

```powershell
Copy-Item .env.example .env
```

macOS/Linux:

```bash
cp .env.example .env
```

The default configuration targets:
`https://parabank.parasoft.com/parabank`

## Configuration

| Variable | Default | Purpose |
| --- | --- | --- |
| `BASE_URL` | `https://parabank.parasoft.com/parabank` | ParaBank application base URL |
| `BROWSER` | `chromium` | `chromium`, `firefox`, or `webkit` |
| `HEADLESS` | `true` | Headless browser execution |
| `DEFAULT_TIMEOUT` | `15000` | Default application timeout in milliseconds |
| `HEADED` | unset | Set to `true` for headed execution |

## Test commands

Run the complete suite:

```bash
npm test
```

Run the smoke suite:

```bash
npm run test:smoke
```

Run headed tests:

```bash
npm run test:headed
```

Run a tagged suite:

```bash
npx cucumber-js --config cucumber.js --tags '@account-transfer'
npx cucumber-js --config cucumber.js --tags '@bill-pay'
npx cucumber-js --config cucumber.js --tags '@loan'
npx cucumber-js --config cucumber.js --tags '@rest-api'
```

Run one scenario by name:

```bash
npx cucumber-js --config cucumber.js --name 'TC111 REST create customer'
```

Validate without executing browser or API actions:

```bash
npx cucumber-js --config cucumber.js --dry-run
```

Run code checks:

```bash
npm run typecheck
npm run lint
npm run format
```

## Coverage

The feature suite covers:

- Registration, login, account overview, and account opening
- Transfers between own accounts, balance validation, and ledger reconciliation
- Bill payments, validation errors, repeated payments, and debit entries
- Loan applications, approval decisions, loan accounts, and transfers from approved loans
- Transaction search by ID, date, date range, and amount
- Transaction ordering, pagination, API comparison, and multi-account reconciliation
- REST customer, account, transaction, transfer, and bill-payment operations
- REST negative cases and customer/account/transaction response schema checks
- SOAP customer retrieval
- End-to-end journey: registration, savings funding, loan approval, bill payment, and ledger verification

Available feature tags include:
`@smoke`, `@registration`, `@account`, `@account-overview`, `@account-transfer`, `@bill-pay`, `@loan`, `@transaction-search`, `@rest-api`, and `@e2e`.

## Project structure

```text
src/
	data/       API clients, schemas, and test data
	features/   Cucumber Gherkin scenarios
	locators/   Page-specific Playwright locators
	pages/      Page Objects built on BasePage
	steps/      Cucumber step definitions
	support/    Browser hooks, configuration, and CustomWorld
scripts/      Report generation utilities
reports/      Failure screenshots and generated reports
test-results/ Cucumber JSON and HTML output
```

## Test data

Shared values are stored in `src/data/test-data.json`. Registration steps generate unique usernames at runtime, so scenarios do not depend on a pre-existing customer. API scenarios also generate unique usernames for customer creation.

## Reports and failure evidence

Cucumber writes:

- JSON: `test-results/cucumber.json`
- HTML: `test-results/cucumber.html`

Generate the consolidated HTML report with:

```bash
npm run report
```

The generated report is written to `reports/cucumber-report.html`. Failed browser scenarios save screenshots under `reports/web/screenshots/`.

## Framework conventions

- Keep browser interactions in Page Objects and locator classes.
- Extend `BasePage` for reusable Playwright actions and assertions.
- Keep business-readable behavior in Cucumber steps and features.
- Use `CustomWorld` for scenario state shared between steps.
- Use `RestApiClient` for raw HTTP status/body assertions and `ApiDataClient` for existing successful API helpers.
- Keep scenario data in `src/data/test-data.json` rather than hard-coding repeated values in steps.

## CI

The GitHub Actions workflow is located at `.github/workflows/playwright.yml`. It installs dependencies and browsers, executes the configured test commands, and can publish the generated test artifacts.
