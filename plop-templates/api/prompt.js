const { notEmpty } = require('../utils.js')

module.exports = {
  description: 'generate api',
  prompts: [{
    type: 'input',
    name: 'name',
    message: 'api name please',
    validate: notEmpty('name')
  }],
  actions(data) {
    const name = '{{name}}'
    const actions = [{
      type: 'add',
      path: `src/api/${name}.js`,
      templateFile: 'plop-templates/api/index.hbs',
      data: {
        name: name
      }
    },
    {
      type: 'add',
      path: `src/api/url/modules/url-${name}.js`,
      templateFile: 'plop-templates/api/url.hbs',
      data: {
        name: name
      }
    },
    {
      type: 'modify',
      path: 'src/api/url/index.js',
      pattern: /(\/\/ --APPEND NEW IMPORT HERE--)/gi,
      template: 'import {{name}} from \'./modules/url-{{name}}.js\'\r\n$1'
    },
    {
      type: 'modify',
      path: 'src/api/url/index.js',
      pattern: /(\\r\\n\/\/ --APPEND NEW URL HERE--)/gi,
      template: ',\r\n...{{name}}\r\n$1'
    }]

    return actions
  }
}
