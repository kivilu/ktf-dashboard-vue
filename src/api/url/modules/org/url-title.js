const api = process.env.VUE_APP_BASE_REQUEST

const title = {
  GET_INFO: `${api}/org/title/info`,
  PAGE: `${api}/org/title/page`,
  LIST: `${api}/org/title/list`,
  SAVE: `${api}/org/title/save`,
  UPDATE: `${api}/org/title/update`,
  DELETE: `${api}/org/title/delete`
}

exports.title = title
