const { notEmpty } = require('../utils.js')

module.exports = {
  description: 'generate mock',
  prompts: [{
    type: 'input',
    name: 'name',
    message: 'mock name please',
    validate: notEmpty('name')
  }],
  actions(data) {
    const name = '{{name}}'
    const actions = [{
      type: 'add',
      path: `mock/modules/${name}.js`,
      templateFile: 'plop-templates/mock/index.hbs',
      data: {
        name: name
      }
    },
    {
      type: 'modify',
      path: 'mock/index.js',
      pattern: /(\/\/ --APPEND NEW IMPORT HERE--)/gi,
      template: 'import {{name}} from \'./modules/{{name}}\'\r\n$1'
    },
    {
      type: 'modify',
      path: 'mock/index.js',
      pattern: /(\/\/ --APPEND NEW MODULE HERE--)/gi,
      template: ',\r\n...{{name}}\r\n$1'
    }]

    return actions
  }
}
