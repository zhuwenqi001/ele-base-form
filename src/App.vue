<template>
  <div
    id="app"
    class="base-form"
  >
    <ele-base-form v-bind="formOpt">
      <el-form-item>
        <z-button>搜索</z-button>
        <z-button>重置</z-button>
      </el-form-item>
    </ele-base-form>
    <!-- <el-row>
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
      <el-button
        type=""
        @click="clearForms"
      >
        清空表单
      </el-button>
    </el-row> -->
  </div>
</template>

<script>
export default {
  name: 'App',
  data () {
    return {
      formOpt: {
        inline: false,
        ref: 'testform',
        formrefname: 'testform',
        hostName: 'http://10.9.35.138:8080',
        forms: [
          {
            label: '基本输入框',
            prop: 'inputTest',
            slots: [{ type: 'prepend', text: 'HTTP://' }],
            disabled: true,
            defaultValue: 'text'
          }, {
            label: '文本框',
            prop: 'textarea',
            inputType: 'textarea',
            rows: 4,
            inline: false
          }, {
            itemType: 'number',
            label: '数字输入框',
            prop: 'number',
            step: 2,
            min: 2,
            max: 20,
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
            options: [{ label: '数值', value: 'number' }, { label: '字符串', value: 'string' }],
            change: this.selectchange
          }, {
            itemType: 'number',
            label: '关联数字框',
            prop: 'relativeNumber',
            visible: false
          }, {
            itemType: 'date',
            label: '日期',
            prop: 'date',
            placeholder: '请选择日期'
          },
          {
            itemType: 'date',
            label: '日期时间',
            prop: 'datetime',
            dateType: 'datetime',
            format: 'yyyy-MM-dd HH:mm:ss',
            valueFormat: 'timestamp',
            placeholder: '请选择时间'
          },
          {
            itemType: 'date',
            label: '日期范围',
            prop: ['startdate', 'enddate'],
            dateType: 'daterange',
            startPlaceholder: '开始时间',
            endPlaceholder: '结束时间'
          },
          {
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
            disablekeyname: 'value',
            disableflg: 'DefaultCluster',
            staticOptions: [{ label: '全部', value: 'all' }],
            change: this.remoteSelectChange
          }, {
            itemType: 'remoteselect',
            label: '远程下拉-静态参数',
            prop: 'staticParamsRemoteSelect',
            apiUrl: '/api/consumer/queryApprovedConsumers',
            method: 'GET',
            remoteParams: { clusterType: 'kafka' },
            labelkeyname: 'name',
            valuekeyname: 'name',
            staticFilter: { applicant: '王强' }
          // autoget: true
          }, {
            itemType: 'select',
            label: '人员',
            prop: 'user',
            options: ['王强']
          }, {
            itemType: 'remoteselect',
            label: '远程下拉-关联参数',
            prop: 'relativeParamsRemoteSelect',
            apiUrl: '/api/consumer/queryApprovedConsumers',
            method: 'GET',
            remoteParams: { clusterType: 'kafka' },
            relativeProp: [{ prop: 'remoteselect', paramkey: 'clusterName', require: true }, { prop: 'user', filterkey: 'applicant' }],
            labelkeyname: 'name',
            valuekeyname: 'name'
          }, {
            itemType: 'remoteselect',
            label: '分页型',
            prop: 'pagination',
            hostName: 'http://10.9.15.244:8080',
            apiUrl: '/exp/list',
            method: 'POST',
            remoteParams: { appId: 7, status: ['NOT_START', 'RUNNING', 'STOPPED'], pageSize: 10 },
            resultPath: ['result', 'list'],
            labelkeyname: 'expName',
            valuekeyname: 'expId',
            pagination: true
          }, {
            label: '唯一性校验',
            prop: 'appName',
            checkApi: {
              hostName: 'http://10.9.15.244:8080',
              apiUrl: '/app/unique',
              method: 'POST',
              paramkey: 'appName',
              message: '已存在或者以前使用过，请更换',
              statusPath: ['status'],
              messagePath: ['message'],
              trigger: 'blur'
            },
            rules: [{
              required: true, message: '请输入值', trigger: 'blur'
            }]
          }, {
            prop: 'slider',
            itemType: 'slider',
            max: 100,
            step: 1,
            showInput: true,
            marks: {
              0: '0%',
              100: '100%'
            }
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
    // 清空表单
    clearForms () {
      this.$refs[this.formOpt.ref].clear()
    },
    remoteSelectChange (val, formrefname) {
      console.log(val)
    },
    // 关联生成item
    selectchange (val, formrefname) {
      const generateItem = {}
      switch (val) {
        case 'number':
          Object.assign(generateItem, {
            itemType: 'number',
            label: '关联number',
            prop: 'relativeNumber',
            defaultValue: 0,
            rules: [{ required: true, message: '请输入关联number', trigger: 'blur' }]
          })
          break
        case 'string':
          Object.assign(generateItem, {
            itemType: 'input',
            label: '关联输入框',
            prop: 'relativeString',
            defaultValue: 'test'
          })
          break
      }
      this.formOpt.forms.splice(6, 1, generateItem)
    }
  }
}
</script>
<style>
.base-form{
  /* width:500px; */
}
</style>
