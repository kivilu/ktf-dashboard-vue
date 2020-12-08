const api = process.env.VUE_APP_BASE_REQUEST

const role = {
  GET_INFO: `${api}/permission/role/info`,
  LIST: `${api}/permission/role/list`,
  PAGE: `${api}/permission/role/page`,
  SAVE: `${api}/permission/role/save`,
  UPDATE: `${api}/permission/role/update`,
  DELETE: `${api}/permission/role/delete`
}

exports.role = role
