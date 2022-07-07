import request from '@/utils/request'

export function getList(query) {
  return request({
    url: '/vue-admin-template/table/list',
    method: 'get',
    params: query
  })
}
export function createTable(data) {
  return request({
    url: '/vue-element-admin/article/create',
    method: 'post',
    data
  })
}
