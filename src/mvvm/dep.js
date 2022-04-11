// 初始化uid，为每个dep添加一个id，避免依赖被多次收集
let uid = 0

export default class Dep {
  constructor() {
    this.subs = [] // 提供维护依赖数组，存放Watcher
    this.id = uid++ // id每新增一个会加1
  }
  addSub(sub) { // 提供收集Watcher方法
    this.subs.push(sub)
  }
  removeSub(sub) { // 提供移除Watcher方法
    remove(this.subs, sub)
  }
  depend() { // 提供判断是否收集Watcher方法
    if (Dep.target) { // Dep.target 为当前的Watcher
      Dep.target.addDep(this) // 让Watcher来决定自己是否被dep收集
    }
  }
  notify() { // 提供触发Watcher方法
    const subs = [...this.subs]
    subs.forEach((w) => w.update()) //遍历依赖数组，触发所有Watcher
  }
}
// 在模板编译函数中的实例化watcher的，如何取到该实例
// 全局Dep.target，存放Watcher，同一时刻只有一个watcher的代码在执行，会进行替换
Dep.target = null;
// 考虑父子组件：
// 新建父组件watcher时，window.target会指向父组件watcher，
// 之后新建子组件watcher，window.target将被子组件watcher覆盖，
// 子组件渲染完毕，回到父组件watcher时，window.target变成了null这就会出现问题
// 因此，我们用一个栈结构来保存watcher。先进先出

// 栈结构开始
const targetStack = []
export function pushTarget(_target) {
  targetStack.push(Dep.target) //在数组最后增加元素
  Dep.target = _target
}

export function popTarget() {
  Dep.target = targetStack.pop() // pop删除数组最后一个元素，并返回被删元素
}
// 栈结构结束

function remove(arr, item) {
  if (!arr.length) return
  const index = arr.indexOf(item)
  if (index > -1) {
    return arr.splice(index, 1)
  }
}