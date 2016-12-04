# Guards

The guards provided by `VueTaber` are used to guard tab changes either by opening tab or closing tab.

There are several ways to hook into these changes: globally and per-tab.

### Global config

```js
const taber = new VueTaber({...})
taber.beforeCreateEach((tab, next) => {
    // ...
})

taber.beforeCloseEach((tab, next) => {
    // ...
})
```

Before guards are called in creation order when tab is opening or closing.

Every hook function receives two arguments:

- **`tab: Object`**: target tab object [Tab Object](./api.md)

- **`next: Function`**: the function must be called, and the next action depends on the argument provided to the `next`

  - **`next()`**: move to the next hook in the pipleline

  - **`next(false)`**: abort current change(create or close)

  - **`next(target)`**: `target:Object/String`, abort current change and redirect to the target, **ONLY for create, NOT for close**


### Per-Tab

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

