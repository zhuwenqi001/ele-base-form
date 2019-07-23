# ele-base-form

>ele-base-form 是一个基于element-ui组件的vue插件。项目实现效果为以简约的、配置化方式表达form表单，提供常用的表单关联入口，支持远程校验等，旨在为存在大量表单的后台管理系统开发提供便利。

## 快速使用
```
$ npm i --save ele-base-form
```

## API
### 表单整体
#### attribute

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| --- |------|:----:|-----|:-----:|
| inline | 表单排列形式 | Boolean | - | false |
| size | 表单size | String | medium / small / mini | small |
| disabled | 表单整体禁用,优先级高于item disabled | Boolean | - | false |
| labelWidth | 表单统一label宽度 | String | - | '150px' |
| currentFormValue | 表单当前值。常用于编辑状态-表单赋值。其中对象key值和表单prop对应 | Object | - | {} |
| hostName | 表单中请求通用域名 | String | - | - |
| formrefname | 表单ref,常用场景：动态生成多个表单项，操作表单item时，item回调返回formrefname,以该参数作为找到当前表单的标志 | String | - | baseform |
| forms | 表单配置数组 | Array | - | - |

#### Methods

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
| pagination | - 下拉分页 - | - | - |
| labelkeyname | 数据展示label选择项 | String | - | 'label' |
| valuekeyname | 数据展示value选择项 | String | - | 'value' |
| disablekeyname | 数据展示禁用key | String | label,value.... | - |
| disableflg | 数据禁用flg | Boolean,String | - | - |
| staticOptions | 远程下拉框数据中添加的静态数据 | Array | - | - |
| remoteParams | 请求静态参数 | Object | - | - |
| relativeProp | 表单关联信息，1.被关联项修改值 重置关联项 2.paramkey作为请求的参数.3.filterkey作为静态筛选的参数[{prop:'',paramkey:'',filterkey:''] | Array | - | - |
| staticFilter | 下拉框静态筛选参数 | Object | - | {} |
| autoget | 自动请求下拉列表数据 | Boolean | - | false |
| change | 选中回调 | Function | - | - |



