import dic from './url-dic'
import log from './url-log'
import industry from './url-industry'
import region from './url-region'
// --APPEND NEW IMPORT HERE--

exports.sys = {
  ...dic,
  ...log,
  ...industry,
  ...region
  // --APPEND NEW URL HERE--
}
