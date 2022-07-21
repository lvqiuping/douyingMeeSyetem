import request from '@/utils/request'

export function createUser(data) {
  return request({
    url: '/api/User/AddUser',
    method: 'post',
    data: data
  })
}

