import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/api/user/login',
    method: 'post',
    data: data
  })
}
export function logout(data) {
  return request({
    url: '/api/User/LogOut',
    method: 'post',
    data: data
  })
}
export function getUserList(query) {
  return request({
    url: '/api/User/GetPageList',
    method: 'get',
    params: query
  })
}

export function DisableUser(data) {
  return request({
    url: '/api/User/DisableUser?' + data,
    method: 'post'
  })
}

export function EnableUser(data) {
  return request({
    url: '/api/User/EnableUser?' + data,
    method: 'post'
  })
}

export function getInfo(token) {
  return request({
    url: '/WeatherForecast',
    method: 'get',
    params: { token }
  })
}

