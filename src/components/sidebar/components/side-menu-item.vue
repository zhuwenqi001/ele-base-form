<template>
  <div>
    <template v-if="data.submenu">
      <!-- 存在子级 -->
      <el-submenu :index="index">
        <template slot="title">{{data.label}}</template>
        <el-menu-item-group>
          <side-menu-item
            v-for="(item,i) in data.submenu"
            :key="i"
            :data="item"
            :index="`${index}-${i}`"
          />
        </el-menu-item-group>
      </el-submenu>
    </template>
    <template v-else>
      <el-menu-item
        :index="index"
        @click="go(data.name)"
      >
        <span slot="title">{{data.label}}</span>
      </el-menu-item>
    </template>
  </div>
</template>

<script>
export default {
  name: 'sideMenuItem',
  props: {
    data: {
      type: Object,
      default: () => {
        return {}
      }
    },
    index: String
  },
  methods: {
    go (name) {
      this.$router.push({ name })
    }
  }
}
</script>
