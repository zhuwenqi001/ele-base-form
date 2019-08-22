/*
* 依据route生成的menu数据结构
 [
  {
      "label":"一级菜单",
      "name":"firstMenu"
  },
  {
      "label":"二级菜单",
      "submenu":[
          {
              "label":"二级子菜单1",
              "name":"secMenu2-1"
          },
          {
              "label":"二级子菜单2",
              "name":"secMenu2-2"
          }
      ]
  },
  {
      "label":"三级菜单",
      "submenu":[
          {
              "label":"三级子菜单1",
              "name":"secMenu3-1"
          },
          {
              "label":"三级子菜单2",
              "submenu":[
                  {
                      "label":"三级子菜单2-1",
                      "name":"secMenu3-2"
                  }
              ]
          }
      ]
  }
] */

import routes from '@/router/modules'

// 返回生成的符合规则的数组
const forEachMenu = (data) => {
  let _menu = []
  data.forEach(item => {
    const { meta: { label } = {}, name, children } = item
    if (label === undefined) {
      children && Array.isArray(children) && (_menu = forEachMenu(children))
    } else {
      const menuitem = { label }
      name !== undefined && Object.assign(menuitem, { name })
      children && Array.isArray(children) && Object.assign(menuitem, { submenu: forEachMenu(children) })
      _menu.push(menuitem)
    }
  })
  return _menu
}

export const menudata = forEachMenu(routes)
