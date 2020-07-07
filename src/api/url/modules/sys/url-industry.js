const api = process.env.VUE_APP_BASE_REQUEST

const industry = {
  GET_INFO: `${api}/sys/industry/info`,
  GET_CHILDREN: `${api}/sys/industry/getChildren`,
  GET_PARENT_BROTHERS: `${api}/sys/industry/getParentBrothers`,
  PAGE: `${api}/sys/industry/page`,
  SAVE: `${api}/sys/industry/save`,
  UPDATE: `${api}/sys/industry/update`,
  DELETE: `${api}/sys/industry/delete`
}

exports.industry = industry
