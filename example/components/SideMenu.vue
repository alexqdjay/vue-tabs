<template>
<nav class="side-menu">
    <ul class="nav">
        <li :class="{'active': selected===item.text}" v-for="item in menus" @click="clickMenuItem(item)"><a>{{item.text}}</a></li>
    </ul>
</nav>
</template>
<script>
export default {
    data () {
        return {
            menus: [{
                text: '首页',
                name: 'home'
            }, {
                text: '测试1',
                name: 'test1'
            }, {
                text: '测试2',
                name: 'test2'
            }, {
                text: '异步组件',
                name: 'async'
            }, {
                text: '设置',
                name: 'setting'
            }],
            selected: '管理'
        }
    },
    created () {
        this.$taber.$on('vue-tabs-active-change', (tab) => {
            if (tab) {
                this.selected = tab.meta.title
            } else {
                this.selected = null
            }
        })
    },
    methods: {
        clickMenuItem (item) {
            this.selected = item.text

            this.$taber.open({
                name: item.name,
                params: {
                    title: item.text
                }
            })
        }
    }
}
</script>
<style lang="less">
.side-menu {
    position: fixed;
    width: 200px;
    height: 100%;
    left: 0px;
    top: 1px;
    background-color: #2f4050;
    color: #a7b1c2;

    .nav {
        list-style: none;
        padding: 0px;

        > li.active {
            color: #fff;
        }

        > li > a {
            padding: 4px 10px 4px 40px;
            display: block;
            text-align: left;

            &:hover {
                cursor: pointer;
                color: #fff;
            }
        }
    }
}
</style>