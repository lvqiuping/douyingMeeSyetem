import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'
import Cookies from 'js-cookie'

const getDefaultState = () => {
  return {
    // 这些都是state的信息
    token: getToken(),
    userName: Cookies.get('permission'),
    permission: '',
    isAdmin: Cookies.get('isAdmin'),
    userId: Cookies.get('userId')
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
  },
  SET_IS_ADMIN: (state, isAdmin) => {
    state.isAdmin = isAdmin
  },
  SET_USER_ID: (state, userId) => {
    state.userId = userId
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
        Cookies.set('permission', obj.userName)
        Cookies.set('userId', response.data.userId)
        Cookies.set('isAdmin', response.data.isAdmin)
        commit('SET_IS_ADMIN', response.data.isAdmin)
        commit('SET_USER_ID', response.data.userId)
        commit('SET_TOKEN', response.data.token)
        setToken(response.data.token)
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
        Cookies.remove('userId')
        Cookies.remove('isAdmin')
        window.location.reload() // f5
        resetRouter()
        // resolve() //
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
    return new Promise((resolve, reject) => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true, // 必须写
  state,
  mutations,
  actions
}

