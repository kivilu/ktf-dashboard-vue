const { notEmpty } = require('../utils.js')

module.exports = {
  description: 'generate mock',
  prompts: [
    {
      type: 'input',
      name: 'path',
      message: 'mock path please',
      validate: notEmpty('path')
    },
    {
      type: 'input',
      name: 'name',
      message: 'mock name please',
      validate: notEmpty('name')
    }],
  actions(data) {
    const path = '{{path}}'
    const name = '{{name}}'
    const actions = [{
      type: 'add',
      path: `mock/modules/${path}/${name}.js`,
      templateFile: 'plop-templates/mock/index.hbs',
      data: {
        path: path,
        name: name
      }
    },
    {
      type: 'add',
      path: `mock/data/${name}.json`,
      templateFile: 'plop-templates/mock/json.hbs',
      data: {
        path: path,
        name: name
      }
    },
    {
      type: 'modify',
      path: 'mock/index.js',
      pattern: /(\/\/ --APPEND NEW IMPORT HERE--)/gi,
      template: 'import {{name}} from \'./modules/{{path}}/{{name}}\'\r\n$1'
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
