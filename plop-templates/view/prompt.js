const { notEmpty } = require('../utils.js')

module.exports = {
  description: 'generate a view',
  prompts: [{
    type: 'input',
    name: 'path',
    message: 'view path please',
    validate: notEmpty('path')
  }, {
    type: 'input',
    name: 'name',
    message: 'view name please',
    validate: notEmpty('name')
  },
  {
    type: 'checkbox',
    name: 'blocks',
    message: 'Blocks:',
    choices: [{
      name: '<template>',
      value: 'template',
      checked: true
    },
    {
      name: '<script>',
      value: 'script',
      checked: true
    },
    {
      name: 'style',
      value: 'style',
      checked: true
    },
    {
      name: 'api',
      value: 'api',
      checked: true
    },
    {
      name: 'dialog',
      value: 'dialog',
      checked: true
    }],
    validate(value) {
      if (value.indexOf('script') === -1 && value.indexOf('template') === -1) {
        return 'View require at least a <script> or <template> tag.'
      }
      return true
    }
  }],
  actions: data => {
    const name = '{{name}}'
    const path = '{{path}}'
    var actions = [{
      type: 'add',
      path: `src/views/${path}/${name}/index.vue`,
      templateFile: 'plop-templates/view/index.hbs',
      data: {
        name: name,
        template: data.blocks.includes('template'),
        script: data.blocks.includes('script'),
        style: data.blocks.includes('style'),
        api: data.blocks.includes('api')
      }
    }]

    if (data.blocks.includes('dialog')) {
      actions.push({
        type: 'add',
        path: `src/views/${path}/${name}/add-or-update.vue`,
        templateFile: 'plop-templates/view/add-or-update.hbs',
        data: {
          name: name,
          dialog: data.blocks.includes('dialog')
        }
      })
    }

    if (data.blocks.includes('api')) {
      actions.push({
        type: 'add',
        path: `src/api/${name}.js`,
        templateFile: 'plop-templates/api/index.hbs',
        data: {
          name: name,
          basic: data.blocks.includes('api')
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
      })
    }

    return actions
  }
}
