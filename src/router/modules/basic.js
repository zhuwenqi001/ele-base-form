export default {
  path: '',
  name: 'nest',
  component: () => import('@/components/layout/nest'),
  children: [
    {
      path: 'basic',
      name: 'basic',
      component: () => import('@/views/basic')
    }
  ]
}
