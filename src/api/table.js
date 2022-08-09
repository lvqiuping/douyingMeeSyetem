import request from '@/utils/request'
/**
 *
 * @param {*} query
 * @returns
 */
export function GetStatisticsView(query) {
  return request({
    url: '/api/Task/GetStatisticsView',
    method: 'get',
    params: query
  })
}
export function getTaskList(query) {
  return request({
    url: '/api/Task/GetPageList',
    method: 'get',
    params: query
  })
}
export function AddGrabTask(data) {
  return request({
    url: '/api/Task/AddGrabTask',
    method: 'post',
    data
  })
}
export function DeleteTasks(data) {
  return request({
    url: '/api/Task/DeleteTasks',
    method: 'post',
    data
  })
}
export function GetTaskParameters(query) {
  return request({
    url: '/api/Task/GetTaskParameters',
    method: 'get',
    params: query
  })
}
export function RevokeTask(data) {
  return request({
    url: '/api/Task/RevokeTask',
    method: 'post',
    data
  })
}

/**
 *
 * @param {*} query
 * @returns
 */
export function getVideoList(query) {
  return request({
    url: '/api/Video/GetPageList',
    method: 'get',
    params: query
  })
}
export function DeleteVideos(data) {
  return request({
    url: '/api/Video/DeleteVideos',
    method: 'post',
    data
  })
}
/**
 *
 * @param {*} query
 * @returns
 */
export function getCommentCountList(query) {
  return request({
    url: '/api/Comment/GetPageList',
    method: 'get',
    params: query
  })
}
export function DeleteComments(data) {
  return request({
    url: '/api/Comment/DeleteComments',
    method: 'post',
    data
  })
}

