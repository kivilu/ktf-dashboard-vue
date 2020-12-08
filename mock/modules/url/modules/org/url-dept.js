const api = process.env.VUE_APP_BASE_REQUEST

const dept = {
  GET_INFO: `${api}/org/dept/info`,
  TOPS: `${api}/org/dept/tops`,
  GET_CHILDREN: `${api}/org/dept/getChildren`,
  LIST_BY_CORP: `${api}/org/dept/listByCorp`,
  SAVE: `${api}/org/dept/save`,
  UPDATE: `${api}/org/dept/update`,
  DELETE: `${api}/org/dept/delete`
}

exports.dept = dept
