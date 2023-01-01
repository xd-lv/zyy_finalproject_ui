/*
 *    Copyright (c) 2018-2025, lengleng All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * Redistributions of source code must retain the above copyright notice,
 * this list of conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright
 * notice, this list of conditions and the following disclaimer in the
 * documentation and/or other materials provided with the distribution.
 * Neither the name of the pig4cloud.com developer nor the names of its
 * contributors may be used to endorse or promote products derived from
 * this software without specific prior written permission.
 * Author: lengleng (wangiegie@gmail.com)
 */

import request from '@/router/axios'

export function fetchList(query) {
  return request({
    url: '/aiplatform/modelservice/page',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return request({
    url: '/aiplatform/modelservice',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/aiplatform/modelservice/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return request({
    url: '/aiplatform/modelservice/' + id,
    method: 'delete'
  })
}

export function putObj(obj) {
  return request({
    url: '/aiplatform/modelservice',
    method: 'put',
    data: obj
  })
}

export function onlineObj(obj) {
  return request({
    url: '/aiplatform/modelservice/online',
    method: 'post',
    data: obj
  })
}

export function offlineObj(obj) {
  return request({
    url: '/aiplatform/modelservice/offline',
    method: 'post',
    data: obj
  })
}

export function getStatus() {
  return request({
    url: '/aiplatform/modelservice/allStatus',
    method: 'get',
    headers: {
      "nprogressDisable":true
    },
  })
}

export function getModelList() {
  return request({
    url: '/aiplatform/modelservice/getModelList',
    method: 'get',
    headers: {
      "nprogressDisable":true
    },
  })
}

export function getAPI(obj) {
  return request({
    url: '/aiplatform/modelservice/getAPI',
    method: 'post',
    data: obj,
    headers: {
      "nprogressDisable":true
    },
  })
}
