<template>
  <el-form-item
    :label="label"
    :prop="realprop"
    :rules="rules"
  >
    <!-- 普通输入框 -->
    <el-input
      v-if="itemType==='input'"
      v-model="value"
      :disabled="disabled"
      :placeholder="handleArrItem(placeholder,'请输入内容')"
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
        v-model="value"
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
      v-model="value"
      :disabled="disabled"
      @change="handleChange"
    >
      <el-radio
        v-for="(option,i) in options"
        :key="i+'_'+handleArrItem(option.value,option)"
        :label="handleArrItem(option.value, option)"
        :disabled="option.disabled"
      >
        {{ handleArrItem(option.label,option) }}
      </el-radio>
    </el-radio-group>

    <!-- 多选 -->
    <el-checkbox-group
      v-else-if="itemType === 'checkbox'"
      v-model="value"
      :disabled="disabled"
      @change="handleChange"
    >
      <el-checkbox
        v-for="(option,i) in options"
        :key="i+'_'+handleArrItem(option.value,option)"
        :label="handleArrItem(option.value,option)"
        :disabled="option.disabled"
      >
        {{ handleArrItem(option.label,option) }}
      </el-checkbox>
    </el-checkbox-group>

    <!-- 本地下拉框 -->
    <el-select
      v-else-if="itemType==='select'"
      v-model="value"
      :disabled="disabled"
      :placeholder="handleArrItem(placeholder,'请选择')"
      :filterable="filterable"
      @change="handleChange"
    >
      <el-option
        v-for="(option,i) in options"
        :key="i+'_'+handleArrItem(option.value,option)"
        :label="handleArrItem(option.label,option)"
        :value="handleArrItem(option.value,option)"
      />
    </el-select>

    <!-- 日期选择框 -->
    <el-date-picker
      v-else-if="itemType==='date'"
      v-model="value"
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
      :placeholder="handleArrItem(placeholder,'请选择')"
      :disableflg="disableflg"
      :disablekeyname="disablekeyname"
      :host-name="hostName"
      :api-url="apiUrl"
      :method="method"
      :remote-params="privateRemoteParams"
      :parent="parent"
      :prop="prop"
      :labelkeyname="labelkeyname"
      :valuekeyname="valuekeyname"
      @recieveRemoteSelectValue="recieveRemoteSelectValue"
    />
  </el-form-item>
</template>

<script>
import { formItemProps } from './props'
import remoteSelect from './form-item-remoteselect'

export default {
  name: 'FormItem',
  components: {
    remoteSelect
  },
  props: formItemProps,
  data () {
    const { remoteParams } = this
    return {
      value: undefined,
      privateRemoteParams: remoteParams
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
    }
  },
  watch: {
    value (newval) {
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
      const { relativeProp, relativeChange } = this
      // 监听forms params 变化，将兄弟formitem 关联起来
      // 被关联项改变，重置关联项的值
      if (relativeProp && relativeProp.length) {
        const Monitor = Boolean(relativeProp.filter(item => {
          const { prop } = item
          return newval[prop] !== oldval[prop]
        }).length)
        Monitor && relativeChange()
      }
    }
  },
  created () {
    this.initVal()
  },
  methods: {
    // slot类型区分
    filterSlot (type) {
      return this.slots.filter(item => item.type === type)
    },
    // 数组数据处理
    handleArrItem (val, alternate) {
      if (val === undefined) {
        return alternate
      }
      return val
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
      this.value = _value
    },
    // 重置val
    reset () {
      const { itemType, prop } = this
      this.value = undefined
      if (Array.isArray(prop)) {
        this.value = ['', '']
      }
      if (itemType === 'checkbox') {
        this.value = []
      }
      if (itemType === 'remoteselect') {
        this.$refs[`${prop}_remoteSelect`].reset()
      }
    },
    // 接收remoteSelect 值
    recieveRemoteSelectValue (obj) {
      this.$emit('recieveFormItemValue', obj)
    },
    // 被关联项改变
    relativeChange () {
      const { itemType, privateRemoteParams, parent, relativeProp } = this
      // 重置当前项的值
      this.value = undefined
      if (itemType === 'remoteselect') {
        // 作为请求的参数
        relativeProp.forEach(relative => {
          this.privateRemoteParams = Object.assign({}, privateRemoteParams, {
            [relative.paramkey]: parent[relative.prop]
          })
        })
      }
    },
    // change emit
    handleChange (value) {
      const { change, formrefname } = this
      if (change) {
        change(value, formrefname)
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
