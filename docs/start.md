# Getting Start

A Single-Page application with vue + vue-tabs is so easy to dev, the only one thing to do is map our `Component` to our `Tab`. Here is a basic Example:

### Html

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

### 1. Tabs Config

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

### 2. New Instance & Install

```js
import VueTaber from 'vue-tabs'
import 'vue-tabs/vue-tabs.css' // import default style
import tabs from './tabs.js'   // import config

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

you can checkout DEMO code from github, [LIVE](http://alexqdjay.oschina.io/vue-tab)

