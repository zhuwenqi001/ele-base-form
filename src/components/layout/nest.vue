<template>
 <section class='main'>
   <sidebar/>
   <transition name="fade" mode="out-in">
     <div class='maincont'>
       <router-view></router-view>
     </div>
   </transition>
 </section>
</template>

<script>
import sidebar from '@/components/sidebar/sidebar'

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
