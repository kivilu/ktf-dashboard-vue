import Vue from 'vue'
import Router from 'vue-router'
/* Layout */
import Layout from '@/layout'
import ktflable from '@/lable'
import { list2tree } from '@/utils'
import { nav } from '@/api/permission/menu'
import { isExternal } from '@/utils/validate'

Vue.use(Router)

// 开发环境不使用懒加载, 因为懒加载页面太多的话会造成webpack热更新太慢, 所以只有生产环境使用懒加载
const _import = require('./import-' + process.env.NODE_ENV)

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
    icon: 'svg-name'             the icon show in the sidebar
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
    // component: () => import('@/views/login/index'),
    component: _import('login/index'),
    hidden: true
  },

  {
    path: '/404',
    // component: () => import('@/views/404'),
    component: _import('404'),
    hidden: true
  },
  // 首次登录页面
  {
    path: '/first',
    component: _import('dashboard/first-login'),
    hidden: true,
    meta: {
      title: '首次访问'
    }
  },
  // Home页面
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        // component: () => _import('@/views/dashboard/index'),
        component: _import('dashboard/index'),
        meta: { title: ktflable.dashboard.TITLE, icon: 'dashboard' }
      }
    ]
  }
]

export async function dynamicRoutes() {
  const res = await nav()
  if (res.code !== 200) {
    return []
  }
  const menuslist = res.data
  const menus = list2tree(menuslist)
  return buildDynamicRoutes(menus)
}

export function buildDynamicRoutes(menus) {
  const res = []
  menus.forEach(menu => {
    const tmp = { ...menu }
    var children = tmp.children || []
    // console.log('children: ' + children.length)
    // if (tmp.url === '') { return true }
    var url = '/' + tmp.url
    // console.log('url:' + url)
    var route = {
      path: url,
      component:
        children.length > 0 || isExternal(tmp.url) || tmp.url === ''
          ? Layout
          : _import(`${tmp.url}` + '/index') || null,
      name: url.replace('/', '-'),
      meta: {
        title: tmp.name,
        icon: tmp.icon
      },
      children: []
    }
    if (tmp.children) {
      route.children = buildDynamicRoutes(tmp.children)
    }
    res.push(route)
  })
  return res
}

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
// export const asyncRoutes = [
//   {
//     path: '/nested',
//     component: Layout,
//     redirect: '/nested/menu1',
//     name: 'Nested',
//     meta: {
//       title: 'Nested',
//       icon: 'nested'
//     },
//     children: [{
//       path: 'menu1',
//       component: () => _import('@/views/nested/menu1/index'), // Parent router-view
//       name: 'Menu1',
//       meta: { title: 'Menu1' },
//       children: [{
//         path: 'menu1-1',
//         component: () => _import('@/views/nested/menu1/menu1-1'),
//         name: 'Menu1-1',
//         meta: { title: 'Menu1-1' }
//       },
//       {
//         path: 'menu1-2',
//         component: () => _import('@/views/nested/menu1/menu1-2'),
//         name: 'Menu1-2',
//         meta: { title: 'Menu1-2' },
//         children: [{
//           path: 'menu1-2-1',
//           component: () => _import('@/views/nested/menu1/menu1-2/menu1-2-1'),
//           name: 'Menu1-2-1',
//           meta: { title: 'Menu1-2-1' }
//         },
//         {
//           path: 'menu1-2-2',
//           component: () => _import('@/views/nested/menu1/menu1-2/menu1-2-2'),
//           name: 'Menu1-2-2',
//           meta: { title: 'Menu1-2-2' }
//         }]
//       },
//       {
//         path: 'menu1-3',
//         component: () => _import('@/views/nested/menu1/menu1-3'),
//         name: 'Menu1-3',
//         meta: { title: 'Menu1-3' }
//       }]
//     },
//     {
//       path: 'menu2',
//       component: () => _import('@/views/nested/menu2/index'),
//       meta: { title: 'menu2' }
//     }]
//   },

//   {
//     path: 'external-link',
//     component: Layout,
//     children: [{
//       path: 'https://panjiachen.github.io/vue-element-admin-site/#/',
//       meta: { title: 'External Link', icon: 'link' }
//     }]
//   },
//   // 404 page must be placed at the end !!!
//   { path: '*', redirect: '/404', hidden: true }
// ]

const createRouter = () =>
  new Router({
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
