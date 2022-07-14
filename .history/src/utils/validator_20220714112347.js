import { validUsername } from '@/utils/validate'
const validateUsername = (rule, value, callback) => {
  // if (!validUsername(value)) {
  //   callback(new Error('请输入正确的用户名'))
  // } else {
  //   callback()
  // }
  if (!value) {
    callback(new Error('请输入正确的用户名'))
  } else {
    callback()
  }
}
const validatePassword = (rule, value, callback) => {
  if (value.length < 6) {
    callback(new Error('请输入正确的密码'))
  } else {
    callback()
  }
}
export {
  validateUsername,
  validatePassword
}
