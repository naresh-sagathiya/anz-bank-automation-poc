const reporter = require('cucumber-html-reporter');

reporter.generate({
  theme: 'bootstrap',
  jsonFile: 'test-results/cucumber.json',
  output: 'reports/cucumber-report.html',
  reportSuiteAsScenarios: true,
  launchReport: false,
  name: 'ANZ Bank Automation POC',
  brandTitle: 'ParaBank Automation Results'
});
