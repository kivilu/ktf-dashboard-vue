const { setup: setupDevServer } = require('jest-dev-server')

module.exports = async function globalSetup() {
  await setupDevServer({
    command: 'vue-cli-service serve',
    launchTimeout: 120000,
    port: 3000,
    debug: true
  })

  // Your global setup
  console.log('global-setup.js was invoked')
}
