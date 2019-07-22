<template>
  <div
    id="app"
    class="base-form"
  >
    <base-form v-bind="formOpt" />
    <el-row>
      <el-button
        type="primary"
        @click="getParams"
      >
        获取params
      </el-button>
      <el-button
        type=""
        @click="resetForms"
      >
        重置表单
      </el-button>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'App',
  data () {
    return {
      formOpt: {
        inline: false,
        ref: 'baseform',
        formrefname: 'baseform',
        hostName: 'http://10.9.35.138:8080',
        forms: [{
          label: '基本输入框',
          prop: 'inputTest',
          slots: [{ type: 'prepend', text: 'HTTP://' }],
          defaultValue: 'text'
        }, {
          label: '文本框',
          prop: 'textarea',
          inputType: 'textarea',
          rows: 4
        }, {
          itemType: 'number',
          label: '数字输入框',
          prop: 'number',
          slots: [{ type: 'append', text: 'm/s' }],
          rules: [{ required: true, message: '请输入值', trigger: 'blur' }]
        }, {
          itemType: 'radio',
          label: '单选',
          prop: 'radio',
          options: [{ label: '单选1', value: 'value1' }, { label: '单选2', value: 'value2' }],
          defaultValue: 'value1'
        }, {
          itemType: 'checkbox',
          label: '多选',
          prop: 'checkbox',
          options: [{ label: '多选1', value: '1' }, { label: '多选2', value: '2' }]
        }, {
          itemType: 'select',
          label: '本地下拉框',
          prop: 'select',
          options: ['val1', 'val2', 'val3'],
          change: this.selectchange
        }, {
          itemType: 'date',
          label: '日期',
          prop: 'date',
          placeholder: '请选择日期'
        }, {
          itemType: 'date',
          label: '日期时间',
          prop: 'datetime',
          dateType: 'datetime',
          format: 'yyyy-MM-dd HH:mm:ss',
          valueFormat: 'timestamp',
          placeholder: '请选择时间'
        }, {
          itemType: 'date',
          label: '日期范围',
          prop: ['startdate', 'enddate'],
          dateType: 'daterange',
          startPlaceholder: '开始时间',
          endPlaceholder: '结束时间'
        }, {
          itemType: 'date',
          label: '时间范围',
          prop: ['starttime', 'endtime'],
          dateType: 'datetimerange',
          startPlaceholder: '开始时间',
          endPlaceholder: '结束时间'
        }, {
          itemType: 'remoteselect',
          label: '远程下拉框',
          prop: 'remoteselect',
          hostName: 'http://10.9.35.138:8080',
          apiUrl: '/api/cluster/list',
          method: 'GET',
          labelkeyname: 'name',
          valuekeyname: 'name',
          change: this.remoteSelectChange
        }, {
          itemType: 'remoteselect',
          label: '远程下拉-静态参数',
          prop: 'staticParamsRemoteSelect',
          apiUrl: '/api/consumer/queryApprovedConsumers',
          method: 'GET',
          remoteParams: { clusterType: 'kafka' },
          labelkeyname: 'name',
          valuekeyname: 'name'
        }, {
          itemType: 'remoteselect',
          label: '远程下拉-关联参数',
          prop: 'relativeParamsRemoteSelect',
          apiUrl: '/api/consumer/queryApprovedConsumers',
          method: 'GET',
          remoteParams: { clusterType: 'kafka' },
          relativeProp: [{ prop: 'remoteselect', paramkey: 'clusterName' }],
          labelkeyname: 'name',
          valuekeyname: 'name'
        }
        ]
      }
    }
  },
  methods: {
    handleFormValidate ({ options, cb }) {
      this.$refs[options.ref].handleFormValidate((valid, value) => {
        if (valid) {
          cb && cb(value)
        }
      })
    },
    getParams () {
      const { formOpt, handleFormValidate } = this
      handleFormValidate({
        options: formOpt,
        cb: (value) => {
          console.log(value)
        }
      })
    },
    // 重置表单
    resetForms () {
      this.$refs[this.formOpt.ref].reset()
    },
    remoteSelectChange (val, formrefname) {
      console.log(val)
    },
    selectchange (val, formrefname) {
      console.log(val)
    }
  }
}
</script>
<style>
.base-form{
  width:500px;
}
</style>
