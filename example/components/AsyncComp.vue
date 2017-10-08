<template>
<div class="async">
<h1>{{ msg }}</h1>
</div>
</template>

<script>
export default {
    name: 'async',
    data () {
        return {
            msg: '我是异步组件, 我也是受害者啊'
        }
    }
}
</script>
<style scoped>
</style>
