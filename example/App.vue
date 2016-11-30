<template>
<div id="app">
    <side-menu></side-menu>
    <vue-tabs></vue-tabs>
</div>
</template>

<script>
import Hello from './components/Hello'
import SideMenu from './components/SideMenu'

export default {
    name: 'app',
    components: {
        Hello, SideMenu
    },
    methods: {
        dd (tab) {
            console.log(tab)
        }
    }
}
</script>
<style>
html, body {
    padding: 0px;
    margin: 0px;
}
* {
    box-sizing: border-box;
}
#app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    position: relative;
    padding-left: 200px;
}
</style>
