# 懒加载

介于有些组件比较大或者一般情况使用不到, 我们可以在打开那些对应的标签时再来加载这些组件.

vue本身就有异步组件的概念, 但`vue-tabs`暂时没能用到该机制, `vue-tabs`的异步组件是直接基于Promise去实现, 在实际开发中结合 webpack 的`code splitting feature`来实现懒加载是非常简单的事情.

下面是简单的示例:

```js

const Foo = resolve => {
    // require.ensure 是 Webpack 的特殊语法, 配置需要分块的文件
    require.ensure(['./Foo.vue'], () => {
        resolve(require('./Foo.vue'))
    })
}

{
    name: 'async',
    title: '异步组件',
    component: Foo
}
```