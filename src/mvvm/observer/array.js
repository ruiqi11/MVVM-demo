const reactiveMethods = [
  'push',
  'pop',
  'unshift',
  'shift',
  'splice',
  'reverse',
  'sort'
]

const arrayPrototype = Array.prototype //获取Array的原型对象
const proxyPrototype = Object.create(arrayPrototype) // 以Array的原型对象为原型创建对象
  // 也就是proxyPrototype的隐式原型指向 Array.prototype

reactiveMethods.forEach((method) => {
  const originalMethod = arrayPrototype[method] // 获取原有方法
  Object.defineProperty(proxyPrototype, method, { // 在proxyPrototype对象设置这几个方法，但是做了修改，让这几个方法可以触发更新
    value: function reactiveMethod(...args) {
      const result = originalMethod.apply(this, args) // 执行原有方法，并在后面返回该结果
      const ob = this.__ob__
      let inserted = null
      switch (method) {
        case 'push':
        case 'unshift':
          inserted = args
          break
        case 'splice':
          inserted = args.slice(2) // 第二个参数
      }
      if (inserted) ob.observeArray(inserted) // 监听新增的的数据
      ob.dep.notify() // 通知更新
      return result
    },
    enumerable: false,
    writable: true,
    configurable: true
  })
})

export default proxyPrototype