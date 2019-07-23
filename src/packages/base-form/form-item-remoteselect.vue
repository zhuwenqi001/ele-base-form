<template>
  <el-select
    v-model="value"
    v-loading="loading"
    :disabled="disabled"
    :placeholder="placeholder"
    @focus="loadData"
  >
    <el-option
      v-for="(option, i) in compoundSelectOptions"
      :key="i +'_'+ option.value"
      :disabled="disableflg === option[disablekeyname]"
      :value="option.value"
      :label="option.label"
    />
  </el-select>
</template>
<script>
import { formItemProps } from './props'
import httpService from '../../utils/httpService'

export default {
  name: 'Remoteselect',
  props: formItemProps,
  data () {
    return {
      value: undefined,
      selectOptions: [],
      // 是否更新 发起请求的标志
      updateFlg: true,
      loading:false
    }
  },
  computed: {
    compoundSelectOptions () {
      const { selectOptions, staticOptions } = this
      return selectOptions.concat(staticOptions)
    }
  },
  watch: {
    value (newval) {
      const { prop } = this
      const obj = {}
      obj[prop] = newval
      this.$emit('recieveRemoteSelectValue', obj)
    },
    remoteParams () {
      this.value = undefined
      this.selectOptions = []
      // 关联参数值发生改变 触发请求
      this.updateFlg = true
    }
  },
  methods: {
    loadData () {
      this.getRemoteData()
    },
    async getRemoteData () {
      const { updateFlg, hostName, apiUrl, method, resultPath, remoteParams, labelkeyname, valuekeyname } = this

      if (!updateFlg) return

      this.loading = true
      const res = await httpService.accessAPI({ hostName, apiUrl, method, params: remoteParams })
      this.loading = false

      let result = res
      resultPath.forEach(item => {
        result = result[item]
      })
      this.selectOptions = result.map(item => {
        return {
          label: item[labelkeyname],
          value: item[valuekeyname]
        }
      })

      this.updateFlg = false
    },
    reset () {
      this.value = undefined
    }
  }
}

</script>
