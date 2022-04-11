import { popTarget, pushTarget } from './dep'
import { isObject, parsePath } from '../utils'

export default class Watcher {
  constructor(vm, expOrFn, cb) {
    this.vm = vm
    this.cb = cb // 更新回调

    // 存放上次执行时存储自己的dep和id
    this.deps = []
    this.depIds = new Set()
      // 存放本次执行时存储自己的dep和id
    this.newDeps = []
    this.newDepIds = new Set()

    // 修改
    if (typeof expOrFn === 'function') {
      this.getter = expOrFn
    } else {
      this.getter = parsePath(expOrFn)
    }
    this.value = this.get()
  };

  get() {
    pushTarget(this) // 修改Dep.target
    const vm = this.vm
    const value = this.getter.call(vm, vm)
    popTarget() // 修改Dep.target
    this.cleanUpDeps() // 本次执行的dep放入上次的dep中
    return value
  };
  // 决定是否收集依赖，避免重复收集
  addDep(dep) {
    const id = dep.id
    if (!this.newDepIds.has(id)) {
      this.newDepIds.add(id)
      this.newDeps.push(dep)
      if (!this.depIds.has(id)) {
        dep.addSub(this)
      }
    }
  };
  // 删除依赖
  cleanUpDeps() {
    let i = this.deps.length
    while (i--) {
      const dep = this.deps[i]
      if (!this.newDepIds.has(dep.id)) { // 移除dep中的Watcher
        dep.removeSub(this)
      }
    };
    // 替换deps和newDeps，还有id，清空新的，为下次做准备
    let tmp = this.depIds
    this.depIds = this.newDepIds
    this.newDepIds = tmp
    this.newDepIds.clear()
    tmp = this.deps
    this.deps = this.newDeps
    this.newDeps = tmp
    this.newDeps.length = 0
  };
  // 数据变化时，派发更新
  update() {
    const value = this.get()
    if (value !== this.value || isObject(value)) {
      const oldValue = this.value
      this.value = value
      this.cb.call(this.vm, value, oldValue)
    }
  }
};
// update() {
//   const oldValue = this.value
//   this.value = parsePath(this.data, this.expression)
//   this.cb.call(this.data, this.value, oldValue)
// }