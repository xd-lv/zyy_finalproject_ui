import request from '@/utils/request'

export function getClusterList(params) {
  return request({
    url: '/vue-admin-template/table/list',
    method: 'get',
    params
  })
}