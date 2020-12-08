const api = process.env.VUE_APP_BASE_REQUEST

const log = {
  GET_INFO: `${api}/sys/log/info`,
  PAGE: `${api}/sys/log/page`,
  SAVE: `${api}/sys/log/save`,
  UPDATE: `${api}/sys/log/update`,
  DELETE: `${api}/sys/log/delete`
}

exports.log = log
