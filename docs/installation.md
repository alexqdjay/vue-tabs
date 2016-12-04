# Installation

### Direct Link

include the `vue` and `vue-tabs`, then it will be installed automatically

``` html
<script src="/path/to/vue.js"></script>
<script src="/path/to/vue-tabs.js"></script>
``` 

### NPM

``` bash
npm install vue-tabs
```

if used with module system, you must install the `vue-tabs` via `vue.use()`

``` js
import Vue from 'vue'
import VueTaber from 'vue-tabs'

Vue.use(VueTaber)

```

### Build DEV

you can also clone from github, build it youself

``` bash
git clone git@github.com:alexqdjay/vue-tabs.git node_modules/vue-tabs
cd node_modules/vue-tabs
npm install
npm run build
```
