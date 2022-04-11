## MVVM-demo

#### 博客地址

（待写）

#### 简介

- 根据vue数据双向绑定原理实现
- 使用webpack对项目进行打包

#### 使用

引入打包后`bundle.js`文件，即可在项目中实现类似Vue的双向绑定

```
<div id="app">
  <h1>{{title}}</h1>
  <button v-on:click="clickMe">v-on:click</v-on></button>
  <br>
  <h2>v-model：{{name}}</h2>
  <input v-model="name">
</div>
<script type="text/javascript">
  new MVVM({
    el: '#app',
    data: {
      title: 'hello world',
      name: 'a'
    },
    methods: {
      clickMe: function() {
        this.title = 'Welcome';
      }
    }
  });
</script>
```

#### 效果展示

https://ruiqi11.github.io/MVVM-demo/