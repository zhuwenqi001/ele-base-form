<template>
  <div class='sidebar'>
   <side-menu :data="menudata"></side-menu>
  </div>
</template>
<script>
import sideMenu from './components/side-menu'
import { menudata } from './index'
export default {
  name: 'sidebar',
  components: {
    sideMenu
  },
  data () {
    return {
      menudata
    }
  }
}
</script>
