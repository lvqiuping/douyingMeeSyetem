const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  // avatar: state => state.user.avatar,
  userNname: state => state.user.userNname
  // permission: state => state.user.permission
}
export default getters
