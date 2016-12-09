# API

## VueTaber Instance

Only **One VueTaber** exists in our system, it's `this.$taber` inside component

### Methods

- **taber.open(tab)**

  - param type: Object/String

  Open a Tab, if it has be existed it would be setted `ative`, it would be created.

  `key` is a field of param, when the param is a object, and it is optional. The ID of tab equals it's name plus it's key, so if name is 'user' and key is '002', the ID would be 'user#002'.

  If has the same name but key is different，that would create two tabs.

  ``` js
  this.$taber.open('home') // open the tab named 'home'

  // or object
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

  add global guards.


- **taber.beforeCloseEach(hookFn)**


## Tab Object

The **tab object** represents the state of current Tab, it contains **config info**

- **tab.name**
- **tab.meta**

  - type: Object  

  the config info


## Events

- **`vue-tabs-active-change: function (tab)`**: emit when atived tab changed
- **`ue-tabs-close: function (tab)`**: emit when tab closed


The handler function of these two events would be provided the `tab` (Tab Object) as the argument.

