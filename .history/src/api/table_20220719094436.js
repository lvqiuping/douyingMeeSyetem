import request from '@/utils/request'

export function getList(query) {
  return request({
    url: '/api/Task/GetPageList',
    method: 'get',
    query
  })
}
export function createTable(data) {
  return request({
    url: '/api/Task/AddGrabTask',
    method: 'post',
    data
  })
}
export function updateTable(data) {
  return request({
    url: '/vue-element-admin/article/create',
    method: 'post',
    data
  })
}
export function deleteTable(id) {
  return request({
    url: `/vue-element-admin/role/${id}`,
    method: 'delete'
  })
}
