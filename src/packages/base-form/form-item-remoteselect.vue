<template>
  <el-select
    v-model="value"
    v-loading="loading"
    :disabled="disabled"
    :placeholder="placeholder"
    v-selectscroll="handleScroll"
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

export default {
  name: 'Remoteselect',
  props: {
    ...formItemProps,
    relativeFilter:{
      type:Object,
      default:()=>{
        return {}
      }
    }
  },
  data () {
    return {
      value: undefined,
      selectOptions: [],
      // 是否更新 发起请求的标志
      updateFlg: true,
      loading:false,
      pageNum:1,
      pages:0
    }
  },
  computed: {
    filterObj(){
      const {staticFilter,relativeFilter} = this
      return Object.assign(staticFilter,relativeFilter)
    },
    compoundSelectOptions () {
      const { selectOptions, staticOptions,filterObj} = this
      let _compoundOptions = staticOptions.concat(selectOptions)
      Object.keys(filterObj).forEach(item=>{
        _compoundOptions = _compoundOptions.filter(opt=>opt[item] === filterObj[item])
      })
      return _compoundOptions
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
    },
    relativeFilter(){
      this.value = undefined
    }
  },
  created() {
    this.autoget && this.getRemoteData()
  },
  methods: {
    async getRemoteData () {
      const { updateFlg, hostName, apiUrl, method, resultPath, remoteParams, labelkeyname, valuekeyname, autoget, pagination, pageNum, selectOptions,pageNumKey,pagePath } = this

      if (!updateFlg) return

      const _params = Object.assign({},remoteParams)
      if(pagination){
        Object.assign(_params,{[pageNumKey]:pageNum})
      }

      this.loading = true
      const res = await httpService.accessAPI({ hostName, apiUrl, method, params: _params })
      this.loading = false

      if(pagination){
        let pages = res
        pagePath.forEach(item=>{
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
      if(!result) return
      this.selectOptions = result.map(item => {
        return {
          ...item,
          label: item[labelkeyname],
          value: item[valuekeyname]
        }
      }).concat(selectOptions)
      if(autoget){
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
    handleScroll(direction) {
      if (direction) {
        // 请求下一页的数据
        const {pages} = this
        this.pageNum = ++this.pageNum
        if(this.pageNum > pages) return
        this.updateFlg = true
        this.getRemoteData()
      }
    }
  }
}

</script>
