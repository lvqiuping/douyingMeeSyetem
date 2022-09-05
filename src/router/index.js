import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    hidden: false,
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '数据大屏', icon: 'dashboard' }
    }]
  },
  {
    path: '/videoCapture',
    component: Layout,
    redirect: '/videoCapture/index',
    alwaysShow: true, // will always show the root menu
    name: 'D音视频获客', // 设定路由的名字，一定要填写不然使用<keep-alive>时会出现各种问题
    meta: {
      title: 'D音视频获客', // 设置该路由在侧边栏和面包屑中展示的名字
      icon: 'el-icon-s-help'
    },
    hidden: false,
    children: [
      {
        path: 'index',
        name: '关键词分析',
        component: () => import('@/views/videoCapture/index'),
        meta: { title: '关键词分析', icon: 'el-icon-full-screen' }
      },
      {
        path: 'peerBlogger',
        name: '同行博主分析',
        component: () => import('@/views/videoCapture/peerBlogger'),
        meta: { title: '同行博主分析', icon: 'el-icon-s-custom' }
      },
      {
        path: 'accurateVideo',
        name: '精准视频分析',
        component: () => import('@/views/videoCapture/accurateVideo'),
        meta: { title: '精准视频分析', icon: 'el-icon-video-camera' }
      },
      {
        path: 'video',
        name: '视频库',
        hidden: true,
        component: () => import('@/views/videoCapture/sub/video/index'),
        meta: { title: '视频库', icon: 'el-icon-video-camera-solid' }
      },
      {
        path: 'comment/:taskId?/:videoId?',
        name: '客户列表',
        hidden: true,
        component: () => import('@/views/videoCapture/sub/comment/index'),
        meta: { title: '客户列表', icon: 'el-icon-user-solid' }
      }
    ]
  },
  {
    path: '/userManagement',
    component: Layout,
    redirect: '/userManagement/index',
    alwaysShow: true,
    name: '修改密码',
    meta: {
      title: '修改密码',
      icon: 'el-icon-lock'
    },
    hidden: false,
    children: [
      {
        path: 'index',
        name: '修改密码',
        component: () => import('@/views/userManagement/index'),
        meta: { title: '修改密码', icon: 'el-icon-key' }
      }
    ]
  },
  // 404 page must be placed at the end !!! 这里本来到404页面，现在到首页
  { path: '*', redirect: '/', hidden: true }
]
const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
