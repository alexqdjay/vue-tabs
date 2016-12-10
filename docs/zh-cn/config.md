# 配置

`vue-tabs`的配置非常简单.


## VueTaber 配置

``` js
const vueTaber = new VueTaber({
    tabs: Array,
    persist: Boolean
})

``` 

- **tabs** 
  
  包含`tab`配置的数组

- **persist**  

  配置是否需要用`localStorage`记录已经打开的标签, 这样如果刷新浏览器或者关闭打开浏览器还能恢复这些标签.


## Tab 配置

```js
const tabs = [{
    name: 'user',   // 必需
    component: component // 必需,
    title: 'title',  // 必需
    beforeCreate: createHook // [可选],
    beforeClose: closeHook // [可选]
}]

```

- **name** 

  标签的ID由`name + # + key`生成, 由此来唯一确定一个标签.

  `name`是用来获取标签的配置. 当两个标签的`name`相同时, 可以使用`key`是用来区分标签.

- **component**

  配置的组件会在对应标签页打开时创建.

- **title**

  标签上显示的标题.

- **beforeCreate, beforeClose**  

  配置钩子, 详细见[Guards](./guards.md)
