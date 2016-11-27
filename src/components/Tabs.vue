<template>
<div class="vue-tabs">
    <div class="tabs-list-wrapper">
        <ul class="tabs-list">
            <li v-for="tab in tabs" :class="{'active': active===tab}" @click="clickTab(tab)">{{tab.title}}<span class="btn-close" @click.stop="close(tab)">&times;</span></li>
        </ul>
    </div>
    <div class="tabs-content-wrapper" ref="contentWrapEl">
    </div>
</div>
</template>
<script>
import Vue from 'vue'
import {isFunction, isString} from '../utils'
const cached = {}
export default {
    data () {
        return {
            tabs: [],
            active: null,
            finalTabs: []
        }
    },
    beforeCreate () {
        this.$tabContents = []
        this.tabSize = 0
    },
    methods: {
        appendContent (tab) {
            const Component = cached[tab.name] || (cached[tab.name] = Vue.extend(tab.component))
            Component.prototype.$tab = Object.create(tab)
            const $el = document.createElement('div')
            const instance = new Component({
                el: $el,
                __taber: this.$options.__taber
            })
            instance.$tabObj = tab
            instance.$el.classList.add('tabs-content')
            this.$refs.contentWrapEl.appendChild(instance.$el)
            this.$tabContents.push(instance)
            if (tab === this.active) {
                instance.$el.classList.add('active')
            }
        },
        clickTab (tab) {
            this.$emit('vue-tabs-actived-change', tab)
        },
        close (tab) {
            this.$emit('vue-tabs-close', tab)
            this.$tabContents.forEach(($tabContent) => {
                if ($tabContent.$tabObj.name === tab.name) {
                    $tabContent.$destroy()
                    $tabContent.$el.remove()
                }
            })
        },
        open (tab) {
            const beforeOpenHocks = [...this.$taber.beforeOpenHocks]
            if (tab.beforeOpen && isFunction(tab.beforeOpen)) {
                beforeOpenHocks.push(tab.beforeOpen)
            }

            let i = 0
            let _this = this
            function next (target) {
                if (target == null) {
                    beforeOpenHocks[++i].call(_this, tab, next)
                } else if (target === false) {
                    return
                } else {
                    // go to sleep, here is to be continued
                    if (isString(tab)) {
                        return
                    }
                    _this.$taber.open(target)
                }
            }
            beforeOpenHocks.push(() => {
                this.tabs.push(tab)
                this.appendContent(tab)
            })

            beforeOpenHocks[0].call(this, tab, next)
        }
    },
    watch: {
        // tabs (v, ov) {
        //     if (!v) {
        //         return
        //     }

        //     if (v.length !== this.tabSize) {
        //     }

        //     if (v.length <= this.tabSize) {
        //         this.tabSize = v.length
        //         return
        //     }
        //     this.tabSize = v.length
        //     this.appendContent(v[v.length - 1])
        // },
        active (tab, otab) {
            if (!tab || tab === otab) {
                return
            }
            this.$tabContents.forEach(($tabContent) => {
                if ($tabContent.$tabObj.name === tab.name) {
                    $tabContent.$el.classList.add('active')
                    $tabContent.$tab = Object.create(tab)
                } else {
                    $tabContent.$el.classList.remove('active')
                }
            })
        }
    }
}
</script>
<style lang="less">
.vue-tabs {
    position: relative;
}

.tabs-list-wrapper {
    padding: 0px 8px;
}

.tabs-list {
    list-style: none;
    margin: 0px;
    padding: 0px;
    overflow: auto;
    width: auto;
    zoom: 1;

    > li {
        float: left;
        padding: 6px 18px;
        position: relative;
        color: #999;

        &.active {
            color: #333;

            &:after {
                content: ' ';
                position: absolute;
                bottom: 0px;
                width: 100%;
                height: 2px;
                background-color: #1ab394;
                left: 0px;
            }

            .btn-close {
                opacity: 1;
            }
        }

        &:hover {
            cursor: pointer;

            .btn-close {
                opacity: 1;
            }
        }

        .btn-close {
            position: absolute;
            display: inline-block;
            opacity: 0;
            top: 2px;
            right: 0px;
            line-height: 12px;
            width: 14px;
            height: 14px;
            border-radius: 14px;
            font-size: 12px;
            color: #999;
            transition: all 0.2s ease;

            &:hover {
                color: #333;
                transform: scale(1.5);
                cursor: pointer;
            }
        }

    }
}

.tabs-content-wrapper {
    position: relative;

    .tabs-content {
        display: none;

        &.active {
            display: block;
        }
    }
}
</style>