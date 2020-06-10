const api = process.env.VUE_APP_BASE_REQUEST

const menu = {
  NAV: `${api}/sys/menu/nav`,
  PAGE: `${api}/sys/user/page`,
  SAVE: `${api}/sys/user/save`,
  UPDATE: `${api}/sys/user/update`,
  DELETE: `${api}/sys/user/delete`
}

exports.menu = menu
