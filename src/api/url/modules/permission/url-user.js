const api = process.env.VUE_APP_BASE_REQUEST

const user = {
  LOGIN: `${api}/sys/user/login`,
  LOGOUT: `${api}/sys/user/logout`,
  GET_INFO: `${api}/sys/user/info`, // get user overview
  PAGE: `${api}/sys/user/page`,
  SAVE: `${api}/sys/user/save`,
  UPDATE: `${api}/sys/user/update`,
  DELETE: `${api}/sys/user/delete`
}

exports.user = user
