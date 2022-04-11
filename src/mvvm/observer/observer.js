import Dep from '../dep'
import { def } from '../../utils'
import proxyPrototype from './array'

// 判断是否为对象，原始类型直接返回
export function observe(value) {
  if (typeof value !== 'object') return
  let ob
    // 判断__ob__属性，避免重复实例化observer
  if (value.__ob__ && value.__ob__ instanceof Observer) {
    ob = value.__ob__
  } else {
    ob = new Observer(value)
  }
  return ob
}


export class Observer {
  constructor(value) {
    this.value = value
    this.dep = new Dep() // 实例化dep？？
    def(value, '__ob__', this) // 将实例化observer放置在对象的__ob__属性上
    if (Array.isArray(value)) { //数组的方法处理
      Object.setPrototypeOf(value, proxyPrototype)
      this.observeArray(value)
    } else {
      this.walk(value)
    }
  }

  walk(obj) {
    Object.keys(obj).forEach((key) =>
      defineReactive(obj, key, obj[key]))
  }

  observeArray(arr) {
    arr.forEach((i) => observe(i))
  }
}

export function defineReactive(data, key, val) {
  const dep = new Dep() // 实例化dep？？？
  let childOb = observe(val)
  Object.defineProperty(data, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter() {
      if (Dep.target) {
        dep.depend() // 该属性在闭包中保存的dep收集依赖
        if (childOb) {
          childOb.dep.depend() // 属性值是对象/数组，该对象__ob__中的dep也需要收集依赖
          if (Array.isArray(val)) {
            dependArray(val)
          }
        }
      }
      return val
    },
    set: function reactiveSetter(newVal) {
      if (val === newVal) {
        return
      }
      val = newVal
      childOb = observe(newVal)
      dep.notify()
    }
  })
}

function dependArray(array) {
  for (let e of array) {
    e && e.__ob__ && e.__ob__.dep.depend()
    if (Array.isArray(e)) {
      dependArray(e)
    }
  }
}