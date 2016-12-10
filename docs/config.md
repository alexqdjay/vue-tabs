# Config

The configuration of `vue-tabs` is so simple.


## VueTaber config

``` js
const vueTaber = new VueTaber({
    tabs: Array,
    persist: Boolean
})

``` 

- **tabs** 
  
  A array contains tab configurations.

- **persist**  

  use localStorage to persist opened tabs, then these tabs would be restore when refresh 
browser.


## Tab config

```js
const tabs = [{
    name: 'user',   // REQUIRED
    component: component // REQUIRED,
    title: 'title', // REQUIRED
    beforeCreate: createHook // [OPTIONAL],
    beforeClose: closeHook // [OPTIONAL]
}]

```

- **name** 

  The ID of tab equals it's name plus it's key, so if name is 'user' and key is '002', the ID would be 'user#002'.

  The name is used to get the configuration, and key is used to distinguish tabs which has the same name.

- **component**

  The component will be created, when it's tab is opened.

- **title**
  
  The title of tab.

- **beforeCreate, beforeClose**  
  
  hooks of `vue-tabs`, see [Guards](./guards.md)
