const api = process.env.VUE_APP_BASE_REQUEST

const menu = {
  NAV: `${api}/sys/menu/nav`,
  GET_INFO: `${api}/sys/menu/info`,
  GET_CHILDREN: `${api}/sys/menu/getChildren`,
  // LIST: `${api}/sys/menu/list`,
  PAGE: `${api}/sys/menu/page`,
  SAVE: `${api}/sys/menu/save`,
  UPDATE: `${api}/sys/menu/update`,
  DELETE: `${api}/sys/menu/delete`
}

exports.menu = menu
