import axios from 'axios'
import { Message } from 'element-ui'

// 创建一个axios实例
const service = axios.create({
  withCredentials: true // 允许携带cookie
})

// 请求发送处理
service.interceptors.request.use(
  config => {
    // 可以对用户权限进行请求进行拦截 Promise.reject(error)
    // 在发送请求做一些事情
    return config
  },
  error => {
    // 发送请求失败报错
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    Promise.reject(error)
  }
)

// 请求发送处理
service.interceptors.response.use(
  response => {
    const res = response.data
    return res
    // 请求成功
  },
  error => {
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
