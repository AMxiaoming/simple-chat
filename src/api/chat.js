import axios from '@/utils/request.js'


// node测试接口
export function demoApi() {
  return axios.get('/get-data')
}
// chat接口
export function chatApi(data) {
  return axios.post('/chat',data)
}
