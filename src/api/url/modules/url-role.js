const api = process.env.VUE_APP_BASE_REQUEST

const role = {
  GET_INFO: `${api}/sys/role/info`,
  PAGE: `${api}/sys/role/page`,
  SAVE: `${api}/sys/role/save`,
  UPDATE: `${api}/sys/role/update`,
  DELETE: `${api}/sys/role/delete`
}

exports.role = role
