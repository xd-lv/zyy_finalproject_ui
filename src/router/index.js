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
    hidden: true,
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: 'Dashboard', icon: 'dashboard' }
    }]
  },
  {
    path: '/title',
    component: Layout,
    meta: { title: '边缘智能AI服务管理系统' }
  },
  {
    path: '/resource',
    component: Layout,
    meta: { title: '模型资源管理', icon: 'resourcemanagement' },
    children: [
      {
        path: 'data',
        name: 'Data',
        component: () => import('@/views/resource/data/index'),
        meta: { title: '文件管理', icon: 'data' }
      },
      {
        path: 'dataset',
        name: 'Dataset',
        component: () => import('@/views/resource/dataset/index'),
        meta: { title: '数据集管理', icon: 'dataset' }
      },
      {
        path: 'model',
        name: 'Model',
        component: () => import('@/views/resource/model/index'),
        meta: { title: '模型管理', icon: 'model' }
      }
    ]
  },
  {
    path: '/service',
    component: Layout,
    name: '服务管理',
    meta: { title: '服务管理', icon: 'servicemanagement' },
    children: [
      {
        path: 'construct',
        name: 'Construct',
        component: () => import('@/views/service/construct/index'),
        meta: { title: '服务构建', icon: 'construct' }
      },
      {
        path: 'version',
        name: 'Version',
        component: () => import('@/views/service/version/index'),
        meta: { title: '服务版本管理', icon: 'version' }
      },
      {
        path: 'update',
        name: 'Update',
        component: () => import('@/views/service/update/index'),
        meta: { title: '服务更新', icon: 'update' }
      }
    ]
  },
  {
    path: '/cluster',
    component: Layout,
    name: '集群管理',
    meta: { title: '集群管理', icon: 'clustermanagement' },
    children: [
      {
        path: 'node',
        name: 'Node',
        component: () => import('@/views/cluster/node/index'),
        meta: { title: '节点管理', icon: 'node' }
      },
      {
        path: 'monitor',
        name: 'Monitor',
        component: () => import('@/views/cluster/monitor/index'),
        meta: { title: '集群监控', icon: 'monitor' }
      }
    ]
  },
  // {
  //   path: '/auth',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'tree',
  //       name: 'Tree',
  //       component: () => import('@/views/tree/index'),
  //       meta: { title: '零信任认证管理', icon: 'tree' }
  //     }
  //   ]
  // },
  // {
  //   path: '/log',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       name: '日志监控',
  //       component: () => import('@/views/form/index'),
  //       meta: { title: '日志监控', icon: 'form' }
  //     }
  //   ]
  // },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
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
