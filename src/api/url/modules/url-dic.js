const api = process.env.VUE_APP_BASE_REQUEST

const dic = {
  SELECT: `${api}/sys/dic/select`,
  GET_INFO: `${api}/sys/dic/info`,
  PAGE: `${api}/sys/dic/page`,
  SAVE: `${api}/sys/dic/save`,
  UPDATE: `${api}/sys/dic/update`,
  DELETE: `${api}/sys/dic/delete`
}

exports.dic = dic
