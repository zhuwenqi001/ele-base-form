
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
    const res = []
    options.forEach(item => {
      // 存在过滤条件 || 满足filterVals所有条件
      if (!filterValsKeys || filterValsKeys.every(key => item[key] === filterVals[key])) {
        // format
        res.push(this.fmtOptionData(item, labelkeyname, valuekeyname))
      }
    })
    return res
  }

}
