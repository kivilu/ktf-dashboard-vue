/**
 * vue文件中标签文本定义
 */
import { jsModules } from '@/utils'

const modulesFiles = require.context('./modules', true, /\.js$/)
const ktflable = jsModules(modulesFiles)

export default ktflable
