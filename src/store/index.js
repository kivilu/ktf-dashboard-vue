import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import { jsModules } from '@/utils'

Vue.use(Vuex)
// https://webpack.js.org/guides/dependency-management/#requirecontext
const modulesFiles = require.context('./modules', true, /\.js$/)

// you do not need `import app from './modules/app'`
// it will auto require all vuex module from modules file
const modules = jsModules(modulesFiles)

const store = new Vuex.Store({
  modules,
  getters
})

export default store
