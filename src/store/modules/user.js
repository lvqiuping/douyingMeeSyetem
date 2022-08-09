import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'
import Cookies from 'js-cookie'

const getDefaultState = () => {
  return {
    // 这些都是state的信息
    token: getToken(),
    userName: Cookies.get('permission'),
    permission: ''
  }
}

const state = getDefaultState()
const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_USER_NAME: (state, userName) => {
    state.userName = userName
  },
  SET_PERMISSION: (state, permission) => {
    state.permission = permission
  }
}
const actions = {
  // user login
  login({ commit }, userInfo) {
    return new Promise((resolve, reject) => {
      login(userInfo).then(response => {
        var str = userInfo.split('&')
        var obj = {}
        str.map((e) => {
          obj[e.split('=')[0]] = e.split('=')[1]
        })
        commit('SET_USER_NAME', obj.userName)
        commit('SET_TOKEN', response.data)
        setToken(response.data)
        Cookies.set('permission', obj.userName)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      const params = `userName=${state.userName}`
      logout(params).then(() => {
        removeToken() // must remove  token  first
        Cookies.remove('permission')
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    // return new Promise((resolve, reject) => {
    //   getInfo(state.token).then(response => {
    //     const { data } = response

    //     if (!data) {
    //       return reject('Verification failed, please Login again.')
    //     }

    //     const { userName } = data

    //     commit('SET_USER_NAME', userName)
    //     // commit('SET_AVATAR')
    //     resolve(data)
    //   }).catch(error => {
    //     reject(error)
    //   })
    // })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

