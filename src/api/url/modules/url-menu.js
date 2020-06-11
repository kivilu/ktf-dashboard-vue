const api = process.env.VUE_APP_BASE_REQUEST

const menu = {
  NAV: `${api}/sys/menu/nav`,
  LIST: `${api}/sys/menu/list`,
  SAVE: `${api}/sys/menu/save`,
  UPDATE: `${api}/sys/menu/update`,
  DELETE: `${api}/sys/menu/delete`
}

exports.menu = menu
