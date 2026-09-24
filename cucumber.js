module.exports = {
  default: {
    requireModule: ['ts-node/register'],
    require: ['src/support/**/*.ts', 'src/steps/**/*.ts'],
    paths: ['src/features/**/*.feature'],
    format: [
      'progress-bar',
      'json:test-results/cucumber.json',
      'html:test-results/cucumber.html'
    ],
    parallel: 1,
    strict: true
  }
};
