import Vue from 'vue'
import App from './App'
import VueTaber from './components/index.js'
import tabs from './tabs.js'

const vueTaber = new VueTaber({
    tabs,
    el: '#vueTabs'
})

vueTaber.beforeOpenEach((tab, next) => {
    console.log('before...', tab.name)
    next('test1')
})

Vue.use(VueTaber)

/* eslint-disable no-new */
new Vue({
    el: '#app',
    taber: vueTaber,
    template: '<App/>',
    components: {
        App
    }
})
