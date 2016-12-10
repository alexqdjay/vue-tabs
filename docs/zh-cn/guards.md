# 钩子

`VueTaber`实例提供了用于响应标签创建和关闭的钩子函数注册.

目前有两种方式配置钩子函数: 全局配置的和每个标签页配置的.

### 全局配置

```js
const taber = new VueTaber({...})
taber.beforeCreateEach((tab, next) => {
    // ...
})

taber.beforeCloseEach((tab, next) => {
    // ...
})
```

钩子是按创建顺序进行调用的, 先创建的先被调用.

每个钩子函数都接收到两个参数:

- **`tab: Object`**: 目标标签的数据对象 [标签数据对象](./api.md)

- **`next: Function`**: 这个方法必须被调用, 不然就会没有任何响应, 调用后下一步的动作依赖传入的参数

  - **`next()`**: 进行下个钩子函数的执行

  - **`next(false)`**: 放弃本次变化(创建或者关闭标签)

  - **`next(target)`**: `target:Object/String`, 放弃本次变化, 转向其他目标`target`, **只对创建起作用, 关闭时不起作用**


### 每个标签配置

```js
const vueTaber = new VueTaber({
    tabs: [{
        name: 'home',
        title: '首页',
        component: Hello,
        beforeCreate (tab, next) {
            console.log('before create:', tab)
            next()
        },
        beforeClose (tab, next) {
            console.log('before close', tab)
            next()
        }
    }]
})
```

