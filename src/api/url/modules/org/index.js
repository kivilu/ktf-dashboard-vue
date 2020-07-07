import corp from './url-corp'
import dept from './url-dept'
import title from './url-title'
// --APPEND NEW IMPORT HERE--

exports.org = {
  ...corp,
  ...dept,
  ...title
// --APPEND NEW URL HERE--
}
