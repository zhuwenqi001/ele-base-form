<template>
  <el-menu
    mode="vertical"
    class="el-menu-vertical"
  >
    <side-menu-item
      v-for="(item,i) in data"
      :data="item"
      :index="'_'+i"
      :key="i"/>
  </el-menu>
</template>

<script>
import sideMenuItem from './side-menu-item'

export default {
  name: 'sideMenu',
  props: {
    data: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  components: {
    sideMenuItem
  }
}
</script>
