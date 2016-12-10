# Lazy Loading

Because of some components‘ size is so big and rarely used, we can load these components when we open the tab which is mapped to the component.

Vue has the async component feature, but `vue-tabs` can't use it simply now, `vue-tabs` using Promise to achieve the target. Combining Webpack's code splitting feature, we can easy to lazy-load the compoent.

A basic example as follows:

```js

const Foo = resolve => {
    // require.ensure is Webpack's usage
    require.ensure(['./Foo.vue'], () => {
        resolve(require('./Foo.vue'))
    })
}

// config of tab
{
    name: 'async',
    title: '异步组件',
    component: Foo
}
```