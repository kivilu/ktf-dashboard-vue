import { getSettings } from '@/api/sys/dic'
import { typeConvert } from '@/utils'
import defaultSettings from '@/settings'

const {
  showSettings,
  tagsView,
  fixedHeader,
  sidebarLogo,
  settings
} = defaultSettings

const state = {
  showSettings: showSettings,
  tagsView: tagsView,
  fixedHeader: fixedHeader,
  sidebarLogo: sidebarLogo,
  settings: settings
}

const mutations = {
  CHANGE_SETTING: (state, { key, value }) => {
    if (state.hasOwnProperty(key)) {
      state[key] = value
    }
  }
}

const actions = {
  changeSetting({ commit }, data) {
    commit('CHANGE_SETTING', data)
  },
  // get runtime setting
  getSettings({ commit, state }) {
    return new Promise((resolve, reject) => {
      getSettings()
        .then(({ code, msg, data }) => {
          // console.log(data)

          if (data) {
            if (Array.isArray(data)) {
              var settings = defaultSettings.settings
              data.forEach(item => {
                settings[item.key] = typeConvert(
                  item.value,
                  defaultSettings.settings[item.key]
                )
              })

              // console.log(settingVal)

              var setting = { key: 'settings', value: settings }

              commit('CHANGE_SETTING', setting)
            }

            resolve(data)
          }
        })
        .catch(error => {
          reject(error)
        })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
