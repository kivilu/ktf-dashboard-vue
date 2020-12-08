const api = process.env.VUE_APP_BASE_REQUEST

const user = {
  LOGIN: `${api}/login`,
  LOGOUT: `${api}/logout`,
  GET_INFO: `${api}/permission/user/info`, // get user overview
  PAGE: `${api}/permission/user/page`,
  SAVE: `${api}/permission/user/save`,
  UPDATE: `${api}/permission/user/update`,
  DELETE: `${api}/permission/user/delete`,
  PASSWORD: `${api}/permission/user/password`,
  PASSWORD_RESET: `${api}/permission/user/passwordReset`
}

module.exports={
  user
}
