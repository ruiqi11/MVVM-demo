import Watcher from '../watcher'
import directiveCompiler from './directiveCompiler'
import textCompiler from './textCompiler'


export default class Compiler {
  constructor(el, vm) {
    // el可以是选择器或元素节点
    this.el = isElementNode(el) ? el : document.querySelector(el)
    this.vm = vm
      // 先将el从页面上取出来放到fragment中，编译完成后再放回页面中。
    let fragment = node2Fragment(this.el)
    this.compile(fragment)
    this.el.appendChild(fragment)
  };
  // 主编译方法
  compile(node) {
      let childNodes = Array.from(node.childNodes)
      childNodes.forEach((c) => {
        if (isElementNode(c)) {
          this.compileElementNode(c)
        } else {
          this.compileTextNode(c)
        }
      })
    }
    // 元素节点编译方法
  compileElementNode(node) {
    Array.from(node.attributes).forEach(({ name, value: expression }) => {
      if (isDirective(name)) {
        const directive = name.split('-')[1]
        if (isEventDirective(directive)) {
          const eventType = directive.split(':')[1];
          new Watcher(
            this.vm,
            directiveCompiler[eventType](node, expression, this.vm) // v-on:click
          )
        } else {
          new Watcher(
            this.vm,
            directiveCompiler[directive](node, expression, this.vm) // v-model
          )
        }
      }
    })
    this.compile(node)
  }

  compileTextNode(node) {
    if (/\{\{(.+?)\}\}/g.test(node.textContent)) {
      new Watcher(this.vm, textCompiler(node, this.vm))
    }
  }
}

function node2Fragment(node) {
  let fragment = document.createDocumentFragment()
  let firstChild = node.firstChild
  while (firstChild) {
    fragment.appendChild(firstChild)
    firstChild = node.firstChild
  }
  return fragment
}

function isElementNode(node) {
  return node.nodeType === 1
}

function isDirective(str) {
  return str.startsWith('v-')
}

function isEventDirective(dir) {
  return dir.indexOf('on:') === 0;
}