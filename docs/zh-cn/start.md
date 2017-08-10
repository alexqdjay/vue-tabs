# 开始使用

使用`vue + vue-tab`来开发一个SPA(单页面应用)是非常简单的, 你需要做的就是将`Component`和`tab`一一对应起来.

这里有个简单的例子:

## Html

``` html
<html>
<head>
<!-- some resource -->    
</head>
<body>
    <div id="app">
        <vue-tabs></vue-tabs>
    </div>
</body>
</html>
``` 

### JS

### 1. 标签页定义

``` js
import Hello from './components/Hello'
export default [{
    name: 'home', // name UNIQUE
    title: '首页', // tab's title
    component: Hello
}, {
    name: 'test1',
    title: '测试1',
    component: {
        template: '<h2>测试1</h2>'
    }
}]
```

### 2. 创建实例 & Install

```js
import VueTaber from 'vue-tabs'
import 'vue-tabs/vue-tabs.css' // 导入默认style, 你可以复制出来进行定制修改
import tabs from './tabs.js'   // 导入配置

Vue.use(VueTaber)

const vueTaber = new VueTaber({
    tabs
})

new Vue({
    el: '#app',
    taber: vueTaber,
    template: '<App/>',
    components: {
        App
    }
})
```

你可以checkout DEMO的代码, 非常简单 [DEMO演示](http://alexqdjay.oschina.io/vue-tab)

