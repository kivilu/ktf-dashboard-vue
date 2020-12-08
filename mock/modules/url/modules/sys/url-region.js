const api = process.env.VUE_APP_BASE_REQUEST

const region = {
  GET_INFO: `${api}/sys/region/info`,
  TOPS: `${api}/sys/region/tops`,
  GET_CHILDREN: `${api}/sys/region/getChildren`,
  SAVE: `${api}/sys/region/save`,
  UPDATE: `${api}/sys/region/update`,
  DELETE: `${api}/sys/region/delete`,
  PROVINCES: `${api}/sys/region/provinces`
}

exports.region = region
