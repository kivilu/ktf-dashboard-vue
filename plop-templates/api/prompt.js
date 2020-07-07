const { notEmpty } = require('../utils.js')

module.exports = {
  description: 'generate api',
  prompts: [
    {
      type: 'input',
      name: 'path',
      message: 'api path please',
      validate: notEmpty('path')
    },
    {
      type: 'input',
      name: 'name',
      message: 'api name please',
      validate: notEmpty('name')
    },
    {
      type: 'checkbox',
      name: 'blocks',
      message: 'Blocks:',
      choices: [{
        name: '<create url module index>',
        value: 'create-url-module-index',
        checked: false
      }],
      validate(value) {
        return true
      }
    }],
  actions(data) {
    const path = '{{path}}'
    const name = '{{name}}'
    const actions = []
    if (data.blocks.includes('create-url-module-index')) {
      actions.push(
        {
          type: 'add',
          path: `src/api/url/modules/${path}/index.js`,
          templateFile: 'plop-templates/api/url-module-index.hbs',
          data: {
            path: path,
            name: name
          }
        },
        {
          type: 'modify',
          path: 'src/api/url/index.js',
          pattern: /(\/\/ --APPEND NEW IMPORT HERE--)/gi,
          template: 'import {{path}} from \'./modules/{{path}}\'\r\n$1'
        },
        {
          type: 'modify',
          path: 'src/api/url/index.js',
          pattern: /(\/\/ --APPEND NEW URL HERE--)/gi,
          template: ',\r\n...{{path}}\r\n$1'
        }
      )
    }

    actions.push(
      {
        type: 'add',
        path: `src/api/${path}/${name}.js`,
        templateFile: 'plop-templates/api/api.hbs',
        data: {
          path: path,
          name: name
        }
      },
      {
        type: 'add',
        path: `src/api/url/modules/${path}/url-${name}.js`,
        templateFile: 'plop-templates/api/url.hbs',
        data: {
          path: path,
          name: name
        }
      }
    )

    if (!data.blocks.includes('create-url-module-index')) {
      actions.push(
        {
          type: 'modify',
          path: `src/api/url/modules/${path}/index.js`,
          pattern: /(\/\/ --APPEND NEW IMPORT HERE--)/gi,
          template: 'import {{name}} from \'./url-{{name}}\'\r\n$1'
        },
        {
          type: 'modify',
          path: `src/api/url/modules/${path}/index.js`,
          pattern: /(\/\/ --APPEND NEW URL HERE--)/gi,
          template: ',\r\n...{{name}}\r\n$1'
        }
      )
    }

    return actions
  }
}
