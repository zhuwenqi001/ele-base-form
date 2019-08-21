<template>
 <section class='main'>
   <sidebar/>
   <transition name="fade" mode="out-in">
     <router-view></router-view>
   </transition>
 </section>
</template>

<script>
import sidebar from '@/components/sidebar'

export default {
  name: 'nest',
  components: {
    sidebar
  },
  data () {
    return {}
  }
}
</script>
