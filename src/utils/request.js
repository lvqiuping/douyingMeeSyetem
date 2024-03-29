import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken, getRefreshToken, setToken, setRefreshToken } from '@/utils/auth'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 180000 // request timeout
})

// request interc50eptor
service.interceptors.request.use(
  config => {
    // do something before request is sent
    // const req = new XMLHttpRequest()
    // var xx = req.getResponseHeader('x-powered-by')
    // console.log(req)
    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['Authorization'] = 'Bearer ' + getToken()
      config.headers['X-Authorization'] = 'Bearer ' + getRefreshToken()
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const accesstoken = response.headers['access-token']
    const xaccesstoken = response.headers['x-access-token']
    if (accesstoken) {
      setToken(accesstoken)
    }
    if (xaccesstoken) {
      setRefreshToken(xaccesstoken)
    }
    const res = response.data
    // if the custom code is not 20000, it is judged as an error.
    if (res.statusCode !== 200) {
      Message({
        message: res.errors || 'Error',
        type: 'error',
        duration: 5 * 1000
      })

      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      if (res.statusCode === 401 || res.statusCode === 500) {
        // to re-login
        MessageBox.confirm(res.errors, '提示', {
          confirmButtonText: '重新登陆',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/logout').then(() => {
            location.reload()
          })
        })
      }
      // 如果是403，不能禁用用户之类的操作

      return Promise.reject(new Error(res.errors || 'Error'))
    } else {
      return res
    }
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
