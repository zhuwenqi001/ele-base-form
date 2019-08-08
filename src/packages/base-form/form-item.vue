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
        v-for="({label,value,disabled},i) in fmtOptions"
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
        v-for="({label,value,disabled},i) in fmtOptions"
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
        v-for="({label,value,disabled},i) in fmtOptions"
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
      :remote-params="remoteParams"
      :param-prop="paramProp"
      :filter-prop="filterProp"
      :static-filter="staticFilter"
      :parent="parent"
      :disableflg="disableflg"
      :disablekeyname="disablekeyname"
      :labelkeyname="labelkeyname"
      :valuekeyname="valuekeyname"
      :static-options="staticOptions"
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
      return util.fmtParams({ props: filterProp, params: staticFilter, parent, keyname: 'filterkey' })
    },
    // 生成展示的选项
    fmtOptions () {
      const { options, labelkeyname, valuekeyname, filterVals } = this
      // 筛选 && 格式化数组
      return util.filterOptions(options, labelkeyname, valuekeyname, filterVals)
    }
  },
  watch: {
    // 值更新 通知form
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
    // 监听关联项值变化
    parent (newval, oldval) {
      const { relativeProp, reset } = this
      const bool = () => {
        return relativeProp.some(({ prop } = {}) => {
          return newval[prop] !== oldval[prop]
        })
      }
      // 监听到变化 重置值
      bool() && reset()
    },
    itemCur () {
      this.reset()
    }
  },
  created () {
    this.initVal()
  },
  methods: {
    // number slot类型区分
    filterSlot (type) {
      const { slots } = this
      let _slotContent = ''
      slots && (_slotContent = slots.filter(item => item.type === type))
      return _slotContent
    },
    // 初始化value
    initVal () {
      const { defaultValue, itemCur, itemType } = this
      let _value = defaultValue
      itemCur !== undefined && (_value = itemCur)
      if (itemType === 'checkbox' && _value === undefined) {
        // checkbox 初始值不可以为undefined
        _value = []
      }
      this.itemValue = _value
    },
    // 重置
    // @param type 清空/重置为初始值
    reset (type) {
      const { initVal, itemType, prop } = this
      if (type === 'clear') {
        this.itemValue = undefined
        itemType === 'checkbox' && (this.itemValue = [])
        itemType === 'remoteselect' && this.$refs[`${prop}_remoteSelect`].reset()
      } else {
        initVal()
      }
    },
    // 接收remoteSelect 值
    recieveRemoteSelectValue (obj) {
      this.$emit('recieveFormItemValue', obj)
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
