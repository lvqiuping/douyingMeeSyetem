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
export function getInfo(token) {
  return request({
    url: '/WeatherForecast',
    method: 'get',
    params: { token }
  })
}

