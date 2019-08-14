# ele-base-form

![npm version](https://img.shields.io/npm/v/ele-base-form)
![npm download](https://img.shields.io/npm/dm/ele-base-form)

<p align="center">
  <a href="intro">简介</a> &nbsp;|&nbsp;
  <a href="use">快速使用</a> &nbsp;|&nbsp;
  <a href="API">API</a>
</p>

## <p id="intro">简介</p>
> ele-base-form 是一个基于element-ui组件的vue组件。  
> 项目实现效果为以简约的、配置化方式表达form表单。旨在为存在大量表单的后台管理系统开发提供便利。

## <p id="use">快速使用</p>

1. install
```
npm i --save ele-base-form
```
2. 引入
```
import eleBaseForm from 'ele-base-form'
Vue.use(EleBaseForm)
```
3. webpack配置  
组件基于es6编写，需要在项目的打包规则中添加插件，将组件es6转成es5。避免build时编译报错
```
module.exports={
  ...
  module:{
    rules:[
      ...
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include:[
          ...
          resolve('node_modules/ele-base-form/src'),
          resolve('node_modules/ele-base-form/src/packages'),
        ]
      }
    ]
  }
}
```

4. views 中使用  
在页面组件中，对form表单的变更操作主要是对formOpt的修改。修改需要符合vue数据更新监听机制。
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

## 常见操作场景
1. 表格数据的编辑。将rows Object赋值给currentFormValue，即可完成表单赋值。（注意rows Object key值需要与forms中的prop值对应）
2. 动态生成的表单建议添加formrefname参数。进行内部关联操作时（下拉框选中回调），change回调会返回formrefname，界面可以通过this.$refs[formrefname]找到操作项。（ref属性和formrefname需要值一致）
3. form item关联。提供部分简单关联入口见[relativeProp]()
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

## <p id="api">API</p>
### ele-base-form props

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| --- |------|:----:|-----|:-----:|
| inline | 表单排列形式 | Boolean | - | false |
| size | 表单size | String | medium / small / mini | small |
| disabled | 表单整体禁用,优先级高于item disabled | Boolean | - | false |
| labelWidth | 表单统一label宽度 | String | - | '150px' |v
| currentFormValue | 表单当前值。对表单进行外部赋值，对象key值和表单prop对应 | Object | - | {} |
| hostName | 表单中请求通用域名 | String | - | - |
| formrefname | 表单ref,常用场景：动态生成多个表单项，操作表单item时，item回调返回formrefname,以该参数作为找到当前表单的标志 | String | - | baseform |
| forms | 表单配置数组 | Array | - | - |

### ele-base-form Methods

| 事件名称 | 说明 | 回调参数 |
| --- |------|:----:|
| handleFormValidate | 根据rules验证form表单，访问方式为 this.$refs[refname].handleFormValidate | Function 接收valid,value两个参数 |
| reset | 重置表单数据 | - |
| clear | 清空表单数据 | - |


### forms item detail

> 通用配置

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| --- |------|:----:|-----|:-----:|
| itemType | item 类型 | String | [input](#input类型支持配置), 'number', 'radio', 'checkbox', 'select','slider', 'date', 'remoteselect' | 'input' |
| label | item描述 | String | - | - |
| labelWidth | label 宽度 | String | - | - |
| prop | item key,必填，数组数据以它为key | String | - | - |
| visible | 表单项是否渲染 | Boolean | - | true |
| disabled | item 禁用 | Boolean | - | false |
| inline | 是否自成一行 | Boolean | - | false |
| rules | 表单项验证规则 | Array | - | - |  |
| placeholder | placeholder | String | - | 输入框默认：请输入内容 ， 下拉框：请选择 |
| defaultValue | item 默认值 | String, Array, Number | - | - |
| change | 选中回调 | Function | - | - |

>  #input类型支持配置

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| --- |------|:----:|-----|:-----:|
| inputType | 输入框延伸类型 | String | 'text', 'textarea', 'email', 'password' | 'text' |
| slots | 支持append、prepend插入 | Array | [{type:'append',text:''},{type:'prepend',text:''}] | - |
| rows | inputType:'textarea' 行数 | Number | - | - |

> number类型支持配置

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| --- |------|:----:|-----|:-----:|
| slots | 支持append、prepend插入 | Array | [{type:'append',text:''},{type:'prepend',text:''}] | - |
| min | itemType:'number' 最小值 | Number | - | - |
| max | itemType:'number' 最大值 | Number | - | 2147483647 |
| step | itemType:'number' 增减粒度 | Number | - | 1 |
| stepStrictly | itemType:'number' 是否严格控制递增递减step | Boolean | - | false |

> radio类型支持配置

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| --- |------|:----:|-----|:-----:|
| options | 选项信息，支持['example1','example2']或者[{label:'example1',value:'value1',name:'cc'}] | Array | - | - |
| labelkeyname | 数据展示label选择项 | String | - | 'label' |
| valuekeyname | 数据展示value选择项 | String | - | 'value' |

> checkbox类型支持配置
| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| --- |------|:----:|-----|:-----:|
| options | 选项信息，支持['example1','example2']或者[{label:'example1',value:'value1',name:'cc'}] | Array | - | - |
| labelkeyname | 数据展示label选择项 | String | - | 'label' |
| valuekeyname | 数据展示value选择项 | String | - | 'value' |

> select类型支持配置
| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| --- |------|:----:|-----|:-----:|
| options | 选项信息，支持['example1','example2']或者[{label:'example1',value:'value1',name:'cc'}] | Array | - | - |
| filterable | 是否可搜索 | Boolean | - | false |
| labelkeyname | 数据展示label选择项 | String | - | 'label' |
| valuekeyname | 数据展示value选择项 | String | - | 'value' |
| disablekeyname | 数据展示禁用key | String | label,value.... | - |
| disableflg | 数据禁用flg | Boolean,String | - | - |

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




