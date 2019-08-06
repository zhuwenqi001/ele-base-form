<template>
  <el-form-item
    :label="label"
    :prop="realprop"
    :rules="fmtRules"
    :label-width="labelWidth"
  >
    <!-- 普通输入框 -->
    <el-input
      v-if="itemType==='input'"
      v-model="itemValue"
      v-loading="loading"
      :disabled="disabled"
      :placeholder="fmtPlaceholder"
      :type="inputType"
      :rows="rows"
    >
      <template v-for="(_slot,i) in slots">
        <template :slot="_slot.type">
          <span :key="_slot.type+i">{{ _slot.text }}</span>
        </template>
      </template>
    </el-input>

    <!-- 计数器 -->
    <div
      v-else-if="itemType==='number'"
      class="inputnumber"
    >
      <template v-for="(_slot,i) in prependSlot">
        <span
          :key="_slot.type+i"
          class="addition"
        >{{ _slot.text }}</span>
      </template>
      <el-input-number
        v-model="itemValue"
        :disabled="disabled"
        :min="min"
        :max="max"
        :step="step"
        :step-strictly="stepStrictly"
      />
      <template v-for="(_slot,i) in appendSlot">
        <span
          :key="_slot.type+i"
          class="addition"
        >{{ _slot.text }}</span>
      </template>
    </div>

    <!-- 单选 -->
    <el-radio-group
      v-else-if="itemType==='radio'"
      v-model="itemValue"
      :disabled="disabled"
      @change="handleChange"
    >
      <el-radio
        v-for="({label,value,disabled},i) in fmtOption"
        :key="`${i}_${value}`"
        :label="value"
        :disabled="disabled"
      >
        {{ label }}
      </el-radio>
    </el-radio-group>

    <!-- 多选 -->
    <el-checkbox-group
      v-else-if="itemType === 'checkbox'"
      v-model="itemValue"
      :disabled="disabled"
      @change="handleChange"
    >
      <el-checkbox
        v-for="({label,value,disabled},i) in fmtOption"
        :key="`${i}_${value}`"
        :label="value"
        :disabled="disabled"
      >
        {{ label }}
      </el-checkbox>
    </el-checkbox-group>

    <!-- 本地下拉框 -->
    <el-select
      v-else-if="itemType==='select'"
      v-model="itemValue"
      :disabled="disabled"
      :placeholder="fmtPlaceholder"
      :filterable="filterable"
      @change="handleChange"
    >
      <el-option
        v-for="({label,value,disabled},i) in fmtOption"
        :key="`${i}_${value}`"
        :label="label"
        :value="value"
      />
    </el-select>

    <!-- 日期选择框 -->
    <el-date-picker
      v-else-if="itemType==='date'"
      v-model="itemValue"
      :disabled="disabled"
      :format="format"
      :value-format="valueFormat"
      :type="dateType"
      :start-placeholder="startPlaceholder"
      :end-placeholder="endPlaceholder"
      :placeholder="placeholder"
    />

    <!-- 远程下拉框 -->
    <remote-select
      v-else-if="itemType === 'remoteselect'"
      :ref="prop + '_remoteSelect'"
      :disabled="disabled"
      :placeholder="fmtPlaceholder"
      :prop="prop"
      :host-name="hostName"
      :api-url="apiUrl"
      :method="method"
      :remote-params="privateRemoteParams"
      :relative-prop="relativeProp"
      :parent="parent"
      :disableflg="disableflg"
      :disablekeyname="disablekeyname"
      :labelkeyname="labelkeyname"
      :valuekeyname="valuekeyname"
      :static-options="staticOptions"
      :static-filter="staticFilter"
      :relative-filter="relativeFilter"
      :autoget="autoget"
      :result-path="resultPath"
      :pagination="pagination"
      :page-num-key="pageNumKey"
      @recieveRemoteSelectValue="recieveRemoteSelectValue"
    />
  </el-form-item>
</template>

<script>
import { formItemProps } from './props'
import remoteSelect from './form-item-remoteselect'
import httpService from '../../utils/httpService'
import { util } from '../../utils/common'

export default {
  name: 'FormItem',
  components: {
    remoteSelect
  },
  props: formItemProps,
  data () {
    const { relativeProp } = this
    // 拆分请求参数 筛选参数
    const paramProp = []
    const filterProp = []
    relativeProp.forEach(prop => {
      const { paramkey, filterkey } = prop
      paramkey !== undefined && paramProp.push(prop)
      filterkey !== undefined && filterProp.push(prop)
    })
    return {
      itemValue: undefined,
      loading: false,
      paramProp,
      filterProp
    }
  },
  computed: {
    prependSlot () {
      return this.filterSlot('prepend')
    },
    appendSlot () {
      return this.filterSlot('append')
    },
    realprop () {
      const { prop } = this
      if (Array.isArray(prop)) {
        return prop[0]
      }
      return prop
    },
    fmtPlaceholder () {
      const { placeholder, itemType } = this
      return placeholder === undefined ? itemType === 'input' ? '请输入' : '请选择' : placeholder
    },
    fmtRules () {
      const { rules, checkApi, checkApi: { trigger } = {}, validateUniqueCode } = this
      const _fmtRules = util.deepCopy(rules)
      checkApi && _fmtRules.push({
        validator: validateUniqueCode(checkApi), trigger
      })
      return _fmtRules
    },
    // 筛选条件
    filterVals () {
      const { filterProp, staticFilter, parent } = this
      const _filterVals = { ...staticFilter }
      filterProp.forEach(item => {
        const { prop, filterkey, require } = item;
        (parent[prop] !== undefined || require) && (_filterVals[filterkey] = parent[prop])
      })
      return _filterVals
    },
    fmtOption () {
      const { options, labelkeyname, valuekeyname, filterVals } = this
      // 筛选 && 格式化数组
      return util.filterOptions(options, labelkeyname, valuekeyname, filterVals)
    }
  },
  watch: {
    itemValue (newval) {
      const { prop } = this
      const obj = {}
      if (Array.isArray(prop)) {
        prop.forEach((vv, i) => {
          obj[vv] = newval[i]
        })
      } else {
        obj[prop] = newval
      }
      this.$emit('recieveFormItemValue', obj)
    },
    parent (newval, oldval) {
      const { relativeProp, relativeChange, remoteParamsChange } = this
      const bool = (key) => {
        return relativeProp.some(item => {
          const { prop } = item
          return (newval[prop] !== oldval[prop]) && (key === undefined || item[key] !== undefined)
        })
      }
      // 监听forms params 变化，将兄弟formitem 关联起来
      // 被关联项改变，重置关联项的值
      if (relativeProp && relativeProp.length) {
        const monitorChange = bool()
        monitorChange && relativeChange()
        const monitorRemoteParams = bool('paramkey')
        monitorRemoteParams && remoteParamsChange()
      }
    }
  },
  created () {
    this.initVal()
  },
  methods: {
    // slot类型区分
    filterSlot (type) {
      const { slots } = this
      if (slots) {
        return slots.filter(item => item.type === type)
      } else {
        return ''
      }
    },
    // 初始化value
    initVal () {
      const { defaultValue, itemCur, itemType } = this
      let _value
      itemCur === undefined ? (_value = defaultValue) : (_value = itemCur)
      if (itemType === 'checkbox' && _value === undefined) {
        // checkbox 初始值不可以为undefined
        _value = []
      }
      this.itemValue = _value
    },
    // 重置val
    reset (type) {
      const { itemType, prop } = this
      if (itemType === 'remoteselect') {
        this.$refs[`${prop}_remoteSelect`].reset()
      }
      if (type === 'clear') {
        this.itemValue = undefined
        Array.isArray(prop) && (this.itemValue = ['', ''])
        itemType === 'checkbox' && (this.itemValue = [])
      } else {
        this.initVal()
      }
    },
    // 接收remoteSelect 值
    recieveRemoteSelectValue (obj) {
      this.$emit('recieveFormItemValue', obj)
    },
    // 被关联项改变
    relativeChange () {
      const { itemType, parent, relativeProp } = this
      // 重置当前项的值
      this.itemValue = undefined
      if (itemType !== 'remoteselect') return

      const _relativeFilter = {}
      relativeProp.forEach(relative => {
        const { prop, filterkey } = relative
        // 关联项值作为本地筛选的参数
        filterkey !== undefined && Object.assign(_relativeFilter, {
          [filterkey]: parent[prop]
        })
      })
      this.relativeFilter = _relativeFilter
    },
    remoteParamsChange () {
      const { remoteParams, relativeProp, itemType, parent } = this
      if (itemType !== 'remoteselect') return

      const _privateRemoteParams = { ...remoteParams }
      relativeProp.forEach(relative => {
        const { prop, paramkey } = relative
        // 作为请求的参数
        paramkey !== undefined && Object.assign(_privateRemoteParams, {
          [paramkey]: parent[prop]
        })
      })
      this.privateRemoteParams = _privateRemoteParams
    },
    // change emit
    handleChange (value) {
      const { change, formrefname } = this
      if (change) {
        change(value, formrefname)
      }
    },
    // 唯一性验证方法
    validateUniqueCode ({ hostName, apiUrl, method, message, paramkey, statusPath, messagePath }) {
      const that = this
      return async function (rule, value, callback, sourse) {
        const params = {}
        paramkey !== undefined ? Object.assign(params, { [paramkey]: value }) : Object.assign(params, sourse)

        that.loading = true
        const res = await httpService.accessAPI({ hostName, apiUrl, method, params })
        that.loading = false

        let status = res
        let _message = message
        statusPath.forEach(item => {
          status = status[item]
        })
        if (messagePath) {
          _message = res
          messagePath.forEach(item => {
            _message = _message[item]
          })
        }
        status ? callback() : callback(new Error(_message))
      }
    }
  }
}
</script>
<style>
.inputnumber{
  display: inline-table;
  width:100%;
}
.inputnumber .el-input-number{
  width:100%;
}
.inputnumber .addition{
    color: #909399;
    vertical-align: middle;
    display: table-cell;
    position: relative;
    border-radius: 4px;
    padding: 0 20px;
    width: 1px;
    white-space: nowrap;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    font-size: 14px;
    line-height: 25px;
}
.base-form .el-radio__input{
  vertical-align: top;
  outline:none;
}
.base-form .el-radio__label,.base-form .el-checkbox{
  font-weight:normal;
}
.base-form .el-select,.base-form .el-input__inner{
  width:100%;
}

</style>
