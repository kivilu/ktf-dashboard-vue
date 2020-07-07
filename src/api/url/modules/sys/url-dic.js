const api = process.env.VUE_APP_BASE_REQUEST

const dic = {
  GET_SETTINGS: `${api}/sys/dic/getSettings`,
  GET_INFO: `${api}/sys/dic/info`,
  GET_CHILDREN: `${api}/sys/dic/getChildren`,
  // LIST: `${api}/sys/dic/list`,
  PAGE: `${api}/sys/dic/page`,
  SAVE: `${api}/sys/dic/save`,
  UPDATE: `${api}/sys/dic/update`,
  DELETE: `${api}/sys/dic/delete`
}

exports.dic = dic
