<template>
<div class="vue-tabs">
    <div class="tabs-list-wrapper">
        <ul class="tabs-list">
            <li v-for="tab in tabs" :class="{'active': active===tab}" @click="clickTab(tab)">{{tab.meta.title}}<span class="btn-close" @click.stop="close(tab)">&times;</span></li>
        </ul>
    </div>
    <div class="tabs-content-wrapper" ref="contentWrapEl">
    </div>
</div>
</template>
<script>
import {isFunction, isString, isObject} from './utils'

function tabIdGen (tabName, tabKey = '') {
    if (isObject(tabName)) {
        const {name, key = ''} = tabName
        return `${name}/${key}`
    }
    return `${tabName}/${tabKey}`
}
const EVENT_ACTIVE_CHANGE = 'vue-tabs-active-change'
const EVENT_CLOSE = 'vue-tabs-close'
const cached = {}
export default {
    data () {
        return {
            tabs: [],
            active: null
        }
    },
    beforeCreate () {
        this.tabSize = 0
        this.tabMap = {}
        this.$taber.vm = this
    },
    methods: {
        appendContent (tab) {
            const Component = cached[tab.name] || (cached[tab.name] = this.getVue().extend(tab.meta.component))
            // Component.prototype.$tab = tab
            const $el = document.createElement('div')
            const instance = new Component({
                el: $el,
                __taber: this.$taber,
                parent: this,
                $tab: tab
            })
            tab.content = instance
            instance.$el.classList.add('tabs-content')
            this.$refs.contentWrapEl.appendChild(instance.$el)
        },
        clickTab (tab) {
            this.select(tab)
        },
        close (tab) {
            if (!tab) {
                return
            }

            const hocks = [...this.$taber.beforeCloseHocks]
            if (tab.meta.beforeClose && isFunction(tab.meta.beforeClose)) {
                hocks.push(tab.meta.beforeClose)
            }
            hocks.push(_close)
            let i = 0
            const _this = this
            function next (target) {
                if (target == null) {
                    hocks[++i].call(_this, tab, next)
                } else if (target === false) {
                    return
                }
            }
            hocks[0].call(_this, tab, next)

            function _close () {
                tab.content.$destroy()
                tab.content.$el.remove()
                this.tabMap[tabIdGen(tab)] = null
                const index = this.tabs.indexOf(tab)
                if (index === -1) {
                    return
                }
                this.tabs.splice(index, 1)

                if (this.tabs.length > 0 && this.active === tab) {
                    if (index < this.tabs.length) {
                        this.select(this.tabs[index])
                    } else {
                        this.select(this.tabs[this.tabs.length - 1])
                    }
                } else if (this.tabs.length === 0) {
                    this.$emit(EVENT_ACTIVE_CHANGE, null, tab)
                }
                this.$emit(EVENT_CLOSE, tab)
            }
        },
        create (tab) {
            let hocks = [...this.$taber.beforeCreateHocks]
            if (tab.meta.beforeCreate && isFunction(tab.meta.beforeCreate)) {
                hocks.push(tab.meta.beforeCreate)
            }

            let i = 0
            let _this = this
            let next = function (target) {
                if (target == null) {
                    hocks[++i].call(_this, tab, next)
                } else if (target === false) {
                    return
                } else {
                    if (isString(target) && target === tab.name) {
                        hocks[++i].call(_this, tab, next)
                    } else if (isObject(target) && target.name === tab.name) {
                        hocks[++i].call(_this, tab, next)
                    } else {
                        _this.$taber.open(target)
                    }
                }
            }
            hocks.push(() => {
                this.tabs.push(tab)
                this.appendContent(tab)
                this.select(tab)
                const id = tabIdGen(tab.name, tab.key)
                this.tabMap[id] = tab

                next = null
                hocks = null
            })

            hocks[0].call(this, tab, next)
        },
        findOpenTab (name, key) {
            const id = tabIdGen(name, key)
            return this.tabMap[id]
        },
        select (tab) {
            if (!tab || tab === this.active) {
                return
            }
            this.$emit(EVENT_ACTIVE_CHANGE, tab, this.active)
            this.active = tab
        }
    },
    watch: {
        active (tab, otab) {
            if (!tab || tab === otab) {
                return
            }
            this.tabs.forEach((ftab) => {
                if (ftab.name === tab.name) {
                    ftab.content.$el.classList.add('active')
                } else {
                    ftab.content.$el.classList.remove('active')
                }
            })
        }
    }
}
</script>
<style >
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