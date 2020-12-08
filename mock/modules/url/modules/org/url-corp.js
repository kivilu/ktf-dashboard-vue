const api = process.env.VUE_APP_BASE_REQUEST

const corp = {
  GET_INFO: `${api}/org/corp/info`,
  PAGE: `${api}/org/corp/page`,
  LIST: `${api}/org/corp/list`,
  SAVE: `${api}/org/corp/save`,
  UPDATE: `${api}/org/corp/update`,
  DELETE: `${api}/org/corp/delete`
}

exports.corp = corp
