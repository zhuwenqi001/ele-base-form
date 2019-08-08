
export const util = {
  deepCopy (obj, cache = []) {
    function find (list, f) {
      return list.filter(f)[0]
    }
    // just return if obj is immutable value
    if (obj === null || typeof obj !== 'object') {
      return obj
    }

    // if obj is hit, it is in circular structure
    const hit = find(cache, c => c.original === obj)
    if (hit) {
      return hit.copy
    }

    const copy = Array.isArray(obj) ? [] : {}
    // put the copy into cache at first
    // because we want to refer it in recursive deepCopy
    cache.push({
      original: obj,
      copy
    })

    Object.keys(obj).forEach(key => {
      copy[key] = this.deepCopy(obj[key], cache)
    })

    return copy
  },
  // 格式化option item 数据
  fmtOptionData (item, labelkeyname, valuekeyname) {
    return typeof item === 'object' ? {
      ...item,
      label: item[labelkeyname],
      value: item[valuekeyname]
    } : {
      label: item,
      value: item
    }
  },
  // 筛选options数据
  filterOptions (options, labelkeyname, valuekeyname, filterVals) {
    const filterValsKeys = Object.keys(filterVals)
    // filterVals中存在undefined 说明有必填项无实际值，直接返回为空
    if (!filterValsKeys && filterValsKeys.every(key => filterVals[key] === undefined)) return []
    // 此时 filterVals 饱含了必填项，和所有有值的一般关联
    const res = []
    options.forEach(item => {
      // 存在过滤条件 || 满足filterVals所有条件
      if (!filterValsKeys || filterValsKeys.every(key => item[key] === filterVals[key])) {
        // format
        res.push(this.fmtOptionData(item, labelkeyname, valuekeyname))
      }
    })
    return res
  },
  // 参数生成
  fmtParams ({ props, params, parent, keyname }) {
    const _params = { ...params }
    props.forEach(item => {
      const { prop, require } = item
      const key = item[keyname]
      // 存入一般关联的有效值、强关联（key值必有，无效值为undefined）
      if (((parent[prop] !== undefined && parent[prop] !== '') || require)) {
        parent[prop] === '' ? (_params[key] = undefined) : (_params[key] = parent[prop])
      }
    })
    return _params
  },
  // 对比两个对象的值是否完全相等 返回值 true/false
  isObjectValueEqual (a, b) {
    const aType = typeof a; const bType = typeof b
    if (aType !== bType) return false
    if (aType === 'object') {
    // 取对象a和b的属性名
      const aProps = Object.keys(a)
      const bProps = Object.keys(b)
      // 判断属性名的length是否一致
      if (aProps.length !== bProps.length) return false
      // 判断属性名是否都能找到
      if (aProps.some(key => bProps.indexOf(key) === -1)) return false
      // 判断属性值
      return aProps.every(key => this.isObjectValueEqual(a[key], b[key]))
    } else {
      return a === b
    }
  }

}
