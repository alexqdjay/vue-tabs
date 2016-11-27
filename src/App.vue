<template>
<div id="app">
    <side-menu></side-menu>
    <div id="vueTabs"></div>
</div>
</template>

<script>
import Hello from './components/Hello'
import SideMenu from './components/SideMenu'
import Tabs from './components/Tabs'

export default {
    name: 'app',
    components: {
        Hello, SideMenu, Tabs
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
