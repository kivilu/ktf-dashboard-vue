const { teardown: teardownDevServer } = require('jest-dev-server')

module.exports = async function globalTeardown() {
  await teardownDevServer()

  // Your global teardown
  console.log('global-teardown.js was invoked')
}
