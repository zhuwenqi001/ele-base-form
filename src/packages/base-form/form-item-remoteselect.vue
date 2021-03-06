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
      v-for="(option, i) in fmtOptions"
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
  name: 'RemoteSelect',
  props: {
    ...formItemProps,
    paramProp: {
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
      pageCount: 0,
      initFlg: true
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
      const { prop, fmtOptions } = this
      this.$emit('recieveRemoteSelectValue', { [prop]: newval })
      this.$emit('recieveRemoteSelectInfomation', fmtOptions.filter(item => item.value === newval)[0])
    },
    // 监听请求参数的变化
    fmtRequestParams (newval, oldval) {
      // 比较对象完全相同，返回true，changeflg为false
      this.requestParamsChangeFlg = !(util.isObjectValueEqual(newval, oldval))
    }
  },
  created () {
    this.autoget && this.getRemoteData()
  },
  methods: {
    isNeedRequest () {
      // 参数值相比上次发生了变化 || 请求参数中存在undefined（必填项无有效值）---发起请求
      // 初次请求 ---发起请求
      const { requestParamsChangeFlg, fmtRequestParams, initFlg } = this
      const keys = Object.keys(fmtRequestParams)
      return requestParamsChangeFlg || keys.some(key => fmtRequestParams[key] === undefined) || initFlg
    },
    async getRemoteData () {
      if (!this.isNeedRequest()) return
      this.initFlg = false
      const { fmtRequestParams, pagination, hostName, apiUrl, method, resultPath, autoget, selectOptions, pageNumKey, pageCountPath } = this

      const _params = Object.assign({}, fmtRequestParams)
      pagination && Object.assign(_params, { [pageNumKey]: 1 })

      // 数据请求
      this.loading = true
      const res = await httpService.accessAPI({ hostName, apiUrl, method, params: _params })
      this.loading = false
      // 总分页数
      pagination && (this.pageCount = util.parsePath(res, pageCountPath, 0))
      // 数据结果 考虑分页情况 追加上历史数据
      this.selectOptions = util.parsePath(res, resultPath, []).concat(selectOptions)
      // 主动更新情况 设置值为第一项
      autoget && this.selectOptions.length && (this.value = this.selectOptions[0].value)
    },
    reset () {
      this.value = undefined
    },
    /**
     * 处理滚动行为
     * @param {Boolean} direction true代表向下滚动,为false代表向上滚动
     */
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
