const api = process.env.VUE_APP_BASE_REQUEST

const menu = {
  NAV: `${api}/permission/menu/nav`,
  GET_INFO: `${api}/permission/menu/info`,
  GET_CHILDREN: `${api}/permission/menu/getChildren`,
  TOPS: `${api}/permission/menu/tops`,
  SAVE: `${api}/permission/menu/save`,
  UPDATE: `${api}/permission/menu/update`,
  DELETE: `${api}/permission/menu/delete`
}

exports.menu = menu
