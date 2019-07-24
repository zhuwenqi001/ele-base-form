<template>
  <el-form
    :ref="formrefname"
    :inline="inline"
    :size="size"
    :label-width="labelWidth"
    :model="params"
  >
    <template v-for="item in showForms">
      <form-item
        :key="generateKey(item.prop)"
        :ref="generateKey(item.prop)"
        v-bind="item"
        :parent="params"
        @recieveFormItemValue="recieveFormItemValue"
      />
    </template>
  </el-form>
</template>

<script>
import { formGroupProps } from './props'
import FormItem from './form-item'

export default {
  name: 'EleBaseForm',
  components: {
    FormItem
  },
  props: formGroupProps,
  data () {
    return {
      params: {}
    }
  },
  computed: {
    visibleForms () {
      return this.forms.filter(item => item.visible === undefined || item.visible === true)
    },
    showForms () {
      const { visibleForms, currentFormValue, labelWidth, disabled, hostName, formrefname } = this
      return visibleForms.map(form => {
        const { prop } = form
        let itemCurval
        if (Array.isArray(prop)) {
          // 时间范围 prop为数组
          itemCurval = []
          prop.forEach(propitem => {
            itemCurval.push(currentFormValue[propitem])
          })
        } else {
          itemCurval = currentFormValue[prop]
        }
        const _form = Object.assign({}, { itemCur: itemCurval, labelWidth, formrefname, hostName }, form, { disabled })
        return _form
      })
    }
  },
  watch: {
    forms () {
      this.initParams()
    },
    currentFormValue () {
      this.initParams()
    }
  },
  created () {
    this.initParams()
  },
  methods: {
    generateKey (prop) {
      if (Array.isArray(prop)) {
        return prop[0]
      }
      return prop
    },
    initParams () {
      const { visibleForms, currentFormValue, params } = this
      const _params = {}
      const _setParams = (prop) => {
        return {
          [prop]: params[prop] === undefined ? currentFormValue[prop] : params[prop]
        }
      }
      visibleForms.forEach(form => {
        const { prop } = form
        if (Array.isArray(prop)) {
          // 时间范围为数组
          prop.forEach(propItem => {
            Object.assign(_params, _setParams(propItem))
          })
        } else {
          // 已存在的params项 优先级高于currentFormValue
          // 解决改变forms 原params丢失
          Object.assign(_params, _setParams(prop))
        }
      })
      this.params = _params
    },
    // 表单值同步变化
    recieveFormItemValue (obj) {
      const { params } = this
      this.params = Object.assign({}, params, obj)
    },
    // 获取表单值
    getParams (callback, e) {
      callback && typeof callback === 'function' && callback(this.params, e)
      return this.params
    },
    // 表单提交验证
    handleFormValidate (callback, e) {
      const { getParams, formrefname } = this
      this.$refs[formrefname].validate(valid => {
        callback && typeof callback === 'function' && callback(valid, getParams(), e)
      })
    },
    // 表单重置
    reset (type) {
      const { showForms, generateKey, $refs } = this
      showForms.forEach(v => {
        const { prop } = v
        const ref = generateKey(prop)
        $refs[ref][0].reset(type)
      })
    },
    // 表单清空
    clear () {
      this.reset('clear')
    }
  }
}
</script>
