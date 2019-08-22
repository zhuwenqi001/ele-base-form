export default {
  path: '',
  name: 'nest',
  component: () => import('@/components/layout/nest'),
  children: [
    {
      path: 'basic',
      name: 'basic',
      component: () => import('@/views/basic'),
      meta: {
        label: '基础配置'
      }
    },
    {
      path: 'remoteselect',
      name: 'remoteselect',
      component: () => import('@/views/remote-select'),
      meta: {
        label: '请求类型下拉'
      }
    },
    {
      path: 'relative',
      meta: {
        label: '关联'
      },
      children: [
        {
          path: 'params',
          name: 'relativeParams',
          component: () => import('@/views/relative/params'),
          meta: {
            label: '作为请求参数关联'
          }
        },
        {
          path: 'filters',
          name: 'relativeFilters',
          component: () => import('@/views/relative/filters'),
          meta: {
            label: '作为筛选参数关联'
          }
        }
      ]
    }
  ]
}
