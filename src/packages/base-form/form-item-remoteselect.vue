<template>
  <el-select
    v-model="value"
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
import httpService from '../utils/httpService'

export default {
  name: 'Remoteselect',
  props: formItemProps,
  data () {
    return {
      value: undefined,
      selectOptions: [],
      // 是否更新 发起请求的标志
      updateFlg: true
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

      const res = await httpService.accessAPI({ hostName, apiUrl, method, params: remoteParams })
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
