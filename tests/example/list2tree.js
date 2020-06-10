var datalist = [
  { 'id': '1', 'parentId': '0', 'varCode': 'A1' },
  // { 'id': '2', 'parentId': '1', 'varCode': 'A11' },
  // { 'id': '3', 'parentId': '0', 'varCode': 'B1' },
  { 'id': '4', 'parentId': '3', 'varCode': 'B11' },
  { 'id': '5', 'parentId': '1', 'varCode': 'A12' },
  { 'id': '6', 'parentId': '7', 'varCode': 'C11' },
  { 'id': '7', 'parentId': '0', 'varCode': 'C1' },
  { 'id': '3', 'parentId': '0', 'varCode': 'B1' }
]
list2tree(datalist)

function list2tree(arr) {
  var result = []
  if (!arr || arr.length === 0) { return result }

  const cloneData = JSON.parse(JSON.stringify(arr))
  result = cloneData.filter(father => {
    const branchArr = cloneData.filter(child => father['id'] === child['parentId'])
    branchArr.length > 0 ? father['children'] = branchArr : ''
    return father['parentId'] === '0'
  })

  // var root = {
  //   id: null,
  //   name: 'root',
  //   value: null,
  //   pids: [],
  //   map: {}
  // }
  // arr.forEach((item, index) => {
  //   root = buildMap(root, item)
  // })

  console.log('最终结果' + JSON.stringify(result))

  return result
}

function buildMap(parent, item) {
  trace(parent, item.id === '5', 'parent:')
  trace(item, item.id === '5', 'item:')

  var children = parent.map[item.parentId] || []
  children.push({
    id: item.id,
    pid: item.parentId,
    value: item,
    map: {}
  })
  parent.map[item.parentId] = children
  parent.pids.push(item.parentId)

  return parent
}

function buildTree(current, item, depth = 1) {
  // console.log('++'.repeat(depth) + 'current:' + JSON.stringify(current) + ' item:' + JSON.stringify(item))
  // console.log('-'.repeat(depth) + 'item:' + JSON.stringify(item))
  trace(current, item.id === '3', 'current:')
  trace(item, item.id === '3', 'item:')

  if (current.length === 0) {
    // 当前节点为空
    if (!item.children) {
      item.children = []
    }
    current.push(item)
    return current
  }

  // 当前节点有
  var first = current.pop()
  trace(first, item.id === '3', 'first:')
  if (first.parentId === item.parentId) {
    // first与item同级，item放入current
    current.push(first, item)
  } else {
    if (first.id === item.parentId) {
      // first是item的父节点，item放入first的children
      if (!first.children) {
        first.children = []
      }
      first.children.push(item)
      current.push(first)
    } else if (first.parentId === item.id) {
      // item是first的父节点，从current删除first，将first加入item的children，最后将item放入current
      if (!item.children) {
        item.children = []
      }
      item.children.push(first)
      current.push(item)
    } else {
      current = buildTree(current, item, depth + 1)
      current.push(first)
      return current
    }
  }

  return current
}

function trace(data, flag, prefix = '') {
  if (flag) {
    var msg = typeof (data) === 'string' ? data : JSON.stringify(data)
    console.log(prefix + msg)
  }
}
