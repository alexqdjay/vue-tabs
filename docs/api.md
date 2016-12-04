# API

## VueTaber Instance

Only **One VueTaber** exists in our system, it's `this.$taber` inside component

### Methods

- **taber.open(tab)**

  - param type: Object/String

  Open a Tab, if it has be existed it would be setted `ative`, it would be created.

  ``` js
  this.$taber.open('home') // open the tab named 'home'

  // or object
  this.$taber.open({
    name: 'home'
  })
  ```


- **taber.close(tab)**

- **taber.select(tab)**

- **taber.$on(event, callback)**

- **taber.$off(event[, callback])**

- **taber.beforeCreateEach(hockFn)**

  add global guards.


- **taber.beforeCloseEach(hockFn)**


## Tab Object

The **tab object** represents the state of current Tab, it contains **config info**

- **tab.name**
- **tab.meta**

  - type: Object  

  the config info

