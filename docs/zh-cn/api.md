# 接口

## VueTaber 实例

在系统中只会存在**一个 VueTaber**, 在组件中可以直接使用`this.$taber`来获取.

### 方法

- **taber.open(tab)**

  - 参数类型: Object/String

  调用时, 如果没有该的`ID`tab存在, 则新建一个tab, 否则激活该tab.

  `key`是参数`param`的一个可选字段.
  
  tab的`ID`的构成: name#key, 如name为`user`, key为`002`, 那么ID为`user#002`.

  所以, 如果name一样, key不一样那么ID也会不一样, 这样会重新打开一个tab.

  ``` js
  this.$taber.open('home') // 打开一个`name`为home的tab

  // 也可以传入对象
  this.$taber.open({
    name: 'home',
    key: user.id
  })
  ```


- **taber.close(tab)**

- **taber.select(tab)**

- **taber.$on(event, callback)**

- **taber.$off(event[, callback])**

- **taber.beforeCreateEach(hookFn)**

  添加全局钩子


- **taber.beforeCloseEach(hookFn)**


## Tab 标签数据对象

**tab 对象** 代表当前标签页的状态数据, 它还包含**标签的配置信息** 

- **tab.name**
- **tab.meta**

  - 类型: Object  

  配置信息


## 事件

- **`vue-tabs-active-change: function (tab)`**: 当激活另一个标签页时触发
- **`ue-tabs-close: function (tab)`**: 当标签页被关闭时触发


这两个事件的响应处理方法都会接受到`tab`这个参数

