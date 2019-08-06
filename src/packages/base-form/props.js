
// 类型常量
const SIZE_VALUE = ['large', 'small', 'mini', 'medium']
const TYPE_VALUE = ['input', 'number', 'radio', 'checkbox', 'select', 'date', 'remoteselect', 'fuzzyinput', 'elautocomplete']
const INPUT_VALUE = ['text', 'textarea', 'email', 'password']
const SLOT_TYPE_VALUE = ['prepend', 'append']
const DATE_VALUE = ['date', 'daterange', 'datetime', 'datetimerange']
const METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']

/**
 * prop传值验证
 * @param value 当前值
 * @param {Array} typeArr 可能值集合
 * @returns {Boolean}
 */
function oneOf (value, typeArr) {
  const valid = typeArr.some(item => item === value)
  if (!valid) throw new Error(`params error:"${value}" must be one of [${typeArr.join(',')}] `)
  return valid
}

/**
 * form 组合props
 */
export const formGroupProps = {
  inline: {
    type: Boolean,
    default: false
  },
  forms: {
    type: Array,
    required: true
  },
  size: {
    type: String,
    default: 'small',
    validator: (val) => { return oneOf(val, SIZE_VALUE) }
  },
  disabled: {
    type: Boolean,
    default: false
  },
  labelWidth: {
    type: String,
    default: '150px'
  },
  // 改变值 意味着表单重绘
  currentFormValue: {
    type: Object,
    default: () => {
      return {}
    }
  },
  // 表单通用请求域名
  hostName: String,
  formrefname: {
    type: String,
    default: 'baseform'
  }
}

/**
 * form-item props
 */
export const formItemProps = {
  itemType: {
    type: String,
    default: 'input',
    validator: (val) => { return oneOf(val, TYPE_VALUE) }
  },
  label: String,
  labelWidth: String,
  prop: {
    type: [String, Array],
    required: true
  },
  // 表单项是否渲染
  visible: {
    type: Boolean,
    default: true
  },
  disabled: {
    type: Boolean,
    default: false
  },
  rules: {
    type: Array,
    default: () => {
      return []
    }
  },
  placeholder: String,
  defaultValue: [String, Array, Number],
  current: [String, Array, Object, Number],
  parent: Object,
  // 对于循环生成多表单情况，提供formrefname 作为标识
  formrefname: String,

  /**
   * 输入框私有属性
   */
  // 类型
  inputType: {
    type: String,
    default: 'text',
    validator: (val) => { return oneOf(val, INPUT_VALUE) }
  },
  // slot
  slots: {
    type: Array,
    validator: (arr) => {
      return arr.map(item => item.type).every(vv => oneOf(vv, SLOT_TYPE_VALUE))
    }
  },
  // 文本框
  rows: Number,

  /**
   * 计数器私有属性
   */
  min: Number,
  max: {
    type: Number,
    default: 2147483647
  },
  step: Number,
  stepStrictly: Boolean,

  /**
   * 选项、下拉框
   */
  options: Array,
  filterable: {
    type: Boolean,
    default: false
  },

  /**
   * 日期
   */
  // 类型
  dateType: {
    type: String,
    default: 'date',
    validator: (val) => { return oneOf(val, DATE_VALUE) }
  },
  // 输入框格式
  format: {
    type: String,
    default: 'yyyy-MM-dd'
  },
  // 绑定值格式
  valueFormat: {
    type: String,
    default: 'yyyy-MM-dd'
  },
  startPlaceholder: String,
  endPlaceholder: String,

  /**
   * 远程下拉框私有属性
   */
  // 域名
  hostName: String,
  // 接口路径
  apiUrl: String,
  // 请求类型
  method: {
    type: String,
    default: 'GET',
    validator: (val) => { return oneOf(val, METHODS) }
  },
  // 数据位置
  resultPath: {
    type: Array,
    default: () => {
      return ['result']
    }
  },
  labelkeyname: {
    type: String,
    default: 'label'
  },
  valuekeyname: {
    type: String,
    default: 'value'
  },
  disablekeyname: String,
  disableflg: [Boolean, String, Number],
  // 静态拼接数据
  staticOptions: {
    type: Array,
    default: () => {
      return []
    }
  },
  staticFilter: {
    type: Object,
    default: () => {
      return {}
    }
  },
  // 请求参数 静态
  remoteParams: {
    type: Object,
    default: () => {
      return {}
    }
  },
  // 关联项信息 1.被关联项修改值 重置关联项 2.值作为请求的参数
  relativeProp: {
    type: Array,
    default: () => {
      return []
    }
  },
  // 载入即触发请求，并设置默认值
  autoget: {
    type: Boolean,
    default: false
  },
  // 选中回调
  change: Function,
  pagination: {
    type: Boolean,
    default: false
  },
  // pageNum 参数名
  pageNumKey: {
    type: String,
    default: 'pageNum'
  },
  // 总页数位置
  pagePath: {
    type: Array,
    default: () => {
      return ['result', 'pages']
    }
  },
  // 唯一性验证
  checkApi: Object
}
