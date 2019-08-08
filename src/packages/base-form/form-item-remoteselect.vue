<template>
  <el-select
    v-model="value"
    v-loading="loading"
    v-selectscroll="handleScroll"
    :disabled="disabled"
    :placeholder="placeholder"
    @focus="getRemoteData"
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
import { util } from '../../utils/common'

export default {
  name: 'Remoteselect',
  props: {
    ...formItemProps,
    paramsProps: {
      type: Array,
      default: () => ([])
    },
    filterProp: {
      type: Array,
      default: () => ([])
    }
  },
  data () {
    return {
      value: undefined,
      selectOptions: [],
      requestParamsChangeFlg: false,
      loading: false,
      pageNum: 1,
      pages: 0
    }
  },
  computed: {
    // 有效请求参数
    fmtRequestParams () {
      const { paramProp, remoteParams, parent } = this
      return util.fmtParams({ props: paramProp, params: remoteParams, parent, keyname: 'paramkey' })
    },
    fmtFilterParams () {
      const { filterProp, staticFilter, parent } = this
      return util.fmtParams({ props: filterProp, params: staticFilter, parent, keyname: 'filterkey' })
    },
    fmtOptions () {
      const { selectOptions, staticOptions, fmtFilterParams, labelkeyname, valuekeyname } = this
      const options = staticOptions.concat(selectOptions)
      return util.filterOptions(options, labelkeyname, valuekeyname, fmtFilterParams)
    }
  },
  watch: {
    value (newval) {
      const { prop, parent } = this
      parent[prop] !== newval && this.$emit('recieveRemoteSelectValue', { [prop]: newval })
    },
    // 监听请求参数的变化
    fmtRequestParams (newval, oldval) {
      this.requestParamsChangeFlg = util.isObjectValueEqual(newval, oldval)
    }
  },
  created () {
    this.autoget && this.getRemoteData()
  },
  methods: {
    isNeedRequest () {
      // 请求参数中不存在undefined（必填项无有效值） || 参数值相比上次发生了变化
      const { requestParamsChangeFlg, fmtRequestParams } = this
      const keys = Object.keys(fmtRequestParams)
      return requestParamsChangeFlg || keys.some(key => fmtRequestParams[key] === undefined)
    },
    async getRemoteData () {
      if (!this.isNeedRequest()) return

      const { hostName, apiUrl, method, resultPath, remoteParams, labelkeyname, valuekeyname, autoget, pagination, pageNum, selectOptions, pageNumKey, pagePath, relativeProp } = this
      if (relativeProp && relativeProp.length) {
        // 强关联项值为undefined 或者空 不请求
        const strongRealtiveBool = relativeProp.every(item => {
          const { require, paramkey } = item
          if (require) {
            return !(remoteParams[paramkey] === undefined || remoteParams[paramkey] === '')
          }
          return true
        })
        if (!strongRealtiveBool) return
      }

      const _params = Object.assign({}, remoteParams)
      if (pagination) {
        Object.assign(_params, { [pageNumKey]: pageNum })
      }

      this.loading = true
      const res = await httpService.accessAPI({ hostName, apiUrl, method, params: _params })
      this.loading = false

      if (pagination) {
        let pages = res
        pagePath.forEach(item => {
          pages = pages[item]
        })
        this.pages = pages
      }

      let result = res
      // debugger
      // 数据位置
      resultPath.forEach(item => {
        result = result[item]
      })
      if (!result) return
      this.selectOptions = result.map(item => {
        return {
          ...item,
          label: item[labelkeyname],
          value: item[valuekeyname]
        }
      }).concat(selectOptions)
      if (autoget) {
        // 主动更新情况 设置值为第一项
        this.value = this.selectOptions[0].value
      }
      this.updateFlg = false
    },
    reset () {
      this.value = undefined
    },
    /** *******************************
     ** Fn: handleScroll
     ** Intro: 处理滚动行为
     ** @params: direction 为true代表向下滚动,为false代表向上滚动
     *********************************/
    handleScroll (direction) {
      if (direction) {
        // 请求下一页的数据
        const { pages } = this
        this.pageNum = ++this.pageNum
        if (this.pageNum > pages) return
        this.updateFlg = true
        this.getRemoteData()
      }
    }
  }
}

</script>
