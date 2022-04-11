import { parsePath } from '../../utils'

// 指令解析器
function setValue(vm, expression, value) {
  const keys = expression.split('.')
  let obj = vm.$data
  for (let i = 0; i < keys.length - 1; i++) {
    obj = obj[keys[i]]
  }
  obj[keys.slice(-1)] = value
}
// 只处理了v-model指令和v-on指令
export default {
  model(node, expression, vm) {
    node.addEventListener('input', (e) =>
      setValue(vm, expression, e.target.value)
    )
    const value = parsePath(expression).call(vm, vm)
    return function() {
      node.value = value
    }
  },
  click(node, expression, vm) {
    const cb = vm.$methods && vm.$methods[expression];
    if (cb) {
      node.addEventListener("click", cb.bind(vm), false);
      const value = parsePath(expression).call(vm, vm)
      return function() {
        node.value = value
      }
    }
  }
}