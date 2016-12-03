import Vue from 'vue'
import App from './App'
import VueTaber from '../vue-tabs.js'
import '../vue-tabs.css'
import tabs from './tabs.js'

const vueTaber = new VueTaber({
    tabs,
    el: '#vueTabs'
})

vueTaber.beforeCreateEach((tab, next) => {
    if (tab.name === 'setting') {
        next('home')
    } else {
        next()
    }
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
