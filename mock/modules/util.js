const path = require( 'path')
const fs = require( 'fs')

function loadjson (filename) {
  const file = path.resolve(__dirname, `../data/${filename}`)
  // 同步读取
  var data = fs.readFileSync(file, 'utf-8')
  return JSON.parse(data)
}


function getParents (pid, datas, targets, props = { pid: 'parentId' }) {
  //console.log('-------------------------')
  var result = []
  if (targets.length === 0)
    return result

  var ids = targets.filter(t => t[props.pid] == pid).map(t => t.id)
  if (ids.length > 0) {
    //console.log(targets)
    result = result.concat(ids)
    //console.log(result)
  }
  targets = targets.filter(t => !ids.includes(t.id))
  //console.log(targets)

  if (targets.length > 0) {
    var pids = targets.map(t => t[props.pid])
    var parents = datas.filter(data => pids.includes(data.id))
    if (parents)
      result = result.concat(getParents(pid, datas, parents))
  }



  return result
}


module.exports = {
  loadjson,
  getParents
}