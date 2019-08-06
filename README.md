# ele-base-form

>ele-base-form 是一个基于element-ui组件的vue插件。项目实现效果为以简约的、配置化方式表达form表单，提供常用的表单关联入口，支持远程校验等。旨在为存在大量表单的后台管理系统开发提供便利。

此外感谢【daz10020】(https://github.com/daz10020)review，让代码质量有了很大的提升，有了工具有了更强的扩展性。
## 快速使用
### install
```
npm i --save ele-base-form
```
### 引入 main.js
```
import eleBaseForm from 'ele-base-form'
Vue.use(EleBaseForm)
```
### views 中使用
变更操作主要是对formOpt的可修改，修改需要符合vue的数据更新监听机制。
```
<template>
  <ele-base-form v-bind="formOpt" />
</template>
<script>
  export default{
    data(){
      return {
        formOpt: {
          inline: false,
          ref: 'testform',
          formrefname: 'testform',
          forms:[
            {
              label: '基本输入框',
              prop: 'inputTest',
              slots: [{ type: 'prepend', text: 'HTTP://' }],
              defaultValue: 'www.github.com'
            }, {
              itemType: 'select',
              label: '本地下拉框',
              prop: 'select',
              options: [{ label: '数值', value: 'number' }, { label: '字符串', value: 'string' }],
              change: this.selectchange
            }, {
              itemType: 'remoteselect',
              label: '远程下拉-静态参数',
              prop: 'staticParamsRemoteSelect',
              hostName:'http://www.xxxx.com',
              apiUrl: '/api/consumer/queryApprovedConsumers',
              method: 'GET',
              remoteParams: { clusterType: 'kafka' },
              labelkeyname: 'name',
              valuekeyname: 'name',
              staticFilter: { applicant: '王强' }
              autoget: true
            }
          ]
        }
      }
    },
    methods:{
      selectchange(val, formrefname){
        console.log(val,formrefname)
      }
    }
  }
</script>
```

## 常用场景
- 对表格数据的编辑操作，将rows Object 赋值给currentFormValue。（注意rows Object key值需要与forms中的prop值对应）
- 动态生成多个表单时，为表单配置使用formrefname参数。在涉及到表单内部(下拉框)关联操作时，可以由change回调返回formrefname，通过this.$refs[formrefname]找到操作项。（ref属性和formrefname需要值一致）
- form item关联（B依赖A）（目前集中在下拉，后面持续完善）。
    - 使用配置关联的效果
      - A无值，B（remoteselect）不发起请求 (强关联，relativeProp中配置require:true)
      - A修改，B值重置为空 （必然）
      - A修改，值作为B的依据 （配置）
        - A值作为B的请求参数
        - A值作为B的本地筛选参数
    - 复杂关联的操作入口  
      - change方法，作为操作forms数组的入口
- 支持下拉框远程请求、下拉分页、输入框远程校验等

## API
### 表单整体

#### attribute

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| --- |------|:----:|-----|:-----:|
| inline | 表单排列形式 | Boolean | - | false |
| size | 表单size | String | medium / small / mini | small |
| disabled | 表单整体禁用,优先级高于item disabled | Boolean | - | false |
| labelWidth | 表单统一label宽度 | String | - | '150px' |v
| currentFormValue | 表单当前值。常用于编辑状态-表单赋值。其中对象key值和表单prop对应 | Object | - | {} |
| hostName | 表单中请求通用域名 | String | - | - |
| formrefname | 表单ref,常用场景：动态生成多个表单项，操作表单item时，item回调返回formrefname,以该参数作为找到当前表单的标志 | String | - | baseform |
| forms | 表单配置数组 | Array | - | - |


#### Methods

| 事件名称 | 说明 | 回调参数 |
| --- |------|:----:|
| handleFormValidate | 根据rules验证form表单，访问方式为 this.$refs[refname].handleFormValidate | Function 接收valid,value两个参数 |
| reset | 重置表单数据 | - |
| clear | 清空表单数据 | - |

### 表单item

#### attribute
| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| --- |------|:----:|-----|:-----:|
| itemType | item 类型 | String | 'input', 'number', 'radio', 'checkbox', 'select', 'date', 'remoteselect', ~~'fuzzyinput'~~, ~~'elautocomplete'~~ | 'input' |
| label | item描述 | String | - | - |
| labelWidth | label 宽度 | String | - | - |
| prop | item key,必填，数组数据以它为key | String | - | - |
| visible | 表单项是否渲染 | Boolean | - | true |
| disabled | item 禁用 | Boolean | - | false |
| rules | 表单项验证规则 | Array | - | - |  |
| placeholder | placeholder | String | - | 输入框默认：请输入内容 ， 下拉框：请选择 |
| defaultValue | item 默认值 | String, Array, Number | - | - |
| inputType | itemType:'input' 时延伸类型 | String | 'text', 'textarea', 'email', 'password' | 'text' |
| slots | itemType:'input/number' 时支持append、prepend插入 | Array | [{type:'append',text:''},{type:'prepend',text:''}] | - |
| rows | itemType:'input',inputType:'textarea' 行数 | Number | - | - |
| min | itemType:'number' 最小值 | Number | - | - |
| max | itemType:'number' 最大值 | Number | - | 2147483647 |
| step | itemType:'number' 增减粒度 | Number | - | 1 |
| stepStrictly | itemType:'number' 是否严格控制递增递减step | Boolean | - | false |
| options | itemType:'select|radio|checkbox' 选项信息 | Array | - | - |
| filterable | itemType:'select' 是否可搜索 | Boolean | - | false |
| dateType | itemType:'date' 延伸的日期类型 | String | 'date', 'daterange', 'datetime', 'datetimerange' | 'date' |
| format | itemType:'date' 日期输入框格式 | String | timestamp/yyyy/MM/dd/HH/mm/ss... | 'yyyy-MM-dd' |
| valueFormat | itemType:'date' 日期输入框值绑定格式 | String | timestamp/yyyy/MM/dd/HH/mm/ss... | 'yyyy-MM-dd' |
| startPlaceholder | itemType:'date',dateType:'daterange/datetimerange' 第一项placeholder | String | - | - |
| endPlaceholder | itemType:'date',dateType:'daterange/datetimerange' 第二项placeholder | String | - | - |
| hostName | 请求域名，优先级高于form设置的hostName | String | - | - |
| apiUrl | 请求API路径 | String | - | - |
| method | 请求类型 | String | 'GET', 'POST', 'PUT', 'PATCH', 'DELETE' | 'GET' | 
| resultPath | 数据解析路径 | Array | - | ['result'] | 
| pagination | 下拉框滚动到底部，分页请求,根据需要，配合传参remoteParams:{pageSize}| Boolean | - | false |
| pageNumKey | 分页pageNum 参数key值 | String | - | pageNum |
| pagePath | 总页数所在res位置 | Array | - | ['result','pages'] |
| labelkeyname | 数据展示label选择项 | String | - | 'label' |
| valuekeyname | 数据展示value选择项 | String | - | 'value' |
| disablekeyname | 数据展示禁用key | String | label,value.... | - |
| disableflg | 数据禁用flg | Boolean,String | - | - |
| staticOptions | 远程下拉框数据中添加的静态数据 | Array | - | - |
| remoteParams | 请求静态参数 | Object | - | - |
| relativeProp | 表单关联信息，1.被关联项修改值 重置关联项 2.paramkey作为请求的参数.3.filterkey作为静态筛选的参数[{prop:'',paramkey:'',filterkey:'',require:true/false]，require表示是否强关联(强关联项无值时，不请求) | Array | - | - |
| staticFilter | 下拉框静态筛选参数 | Object | - | {} |
| autoget | 自动请求下拉列表数据 | Boolean | - | false |
| change | 选中回调 | Function | - | - |




