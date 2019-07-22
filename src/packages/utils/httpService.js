import http from './http'

export default {
  /**
   * 请求调用函数
   * @param apiname 接口名 对应apiUrl.js
   * @param params 请求参数
   * @param path 动态路径参数
   * @param headers 自定义请求头
   */
  accessAPI: function ({ hostName = '', method = '', apiUrl = '', params = {}, headers = {} }) {
    const group = { method, headers }
    Object.assign(group, {
      url: hostName + apiUrl
    })
    if (method === 'GET') {
      Object.assign(group, { params })
    } else if (method === 'POST' || method === 'PUT' || method === 'PATCH' || method === 'DELETE') {
      Object.assign(group, { data: params })
    }
    return http(group)
  }
}
