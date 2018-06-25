<template>
<div class="vue-tabs">
    <div class="tabs-list-wrapper">
        <ul class="tabs-list">
            <tab v-for="(tab, index) in tabs" :tab-data="tab" @close="close(tab)" @click.native="clickTab(tab)" :key="index"></tab>
        </ul>
    </div>
    <div class="tabs-content-wrapper" ref="contentWrapEl">
    </div>
</div>
</template>
<script>
import {isFunction, isString, isObject, store, consts} from './utils'
import Tab from './Tab.vue'
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
    components: {Tab},
    data () {
        return {
            tabs: [],
            active: null
        }
    },
    beforeCreate () {
        this.tabSize = 0
        this.tabMap = {}
    },
    created () {
        this.$taber.vm = this
    },
    mounted () {
        this.$taber.mounted()
    },
    methods: {
        appendContent (tab) {
            let Component = cached[tab.name]
            const _this = this
            let promise
            if (!Component) {
                if (isFunction(tab.meta.component)) {
                    const asyncFn = tab.meta.component
                    this.$set(tab, 'loading', true)
                    promise = new Promise(asyncFn).then((Component) => {
                        if (Component.__esModule) {
                            Component = Component.default
                        }
                        return (cached[tab.name] = _this.getVue().extend(Component))
                    })
                } else {
                    promise = Promise.resolve(tab.meta.component).then((Component) => {
                        return (cached[tab.name] = _this.getVue().extend(Component))
                    })
                }
            } else {
                promise = Promise.resolve(Component)
            }

            promise.then((Component) => {
                newInstance(Component)
            })

            return promise

            function newInstance (Component) {
                const $el = document.createElement('div')
                _this.$refs.contentWrapEl.appendChild($el)
                const instance = new Component({
                    el: $el,
                    __taber: _this.$taber,
                    parent: _this,
                    $tab: tab
                })

                tab.content = instance
                instance.$el.classList.add('tabs-content')
            }
        },
        clickTab (tab) {
            if (tab && !tab.active) {
                this.select(tab)
            }
        },
        close (tab) {
            if (!tab) {
                return
            }

            const hooks = [...this.$taber.beforeCloseHooks]
            if (tab.meta.beforeClose && isFunction(tab.meta.beforeClose)) {
                hooks.push(tab.meta.beforeClose)
            }
            hooks.push(_close)
            let i = 0
            const _this = this
            function next (target) {
                if (target == null) {
                    hooks[++i].call(_this, tab, next)
                }
            }
            hooks[0].call(_this, tab, next)

            function _close () {
                tab.content.$destroy()
                // Fix IE11 Element has no `remove`
                if (tab.content.$el.remove) {
                    tab.content.$el.remove()
                } else if (tab.content.$el.removeNode) {
                    tab.content.$el.removeNode(true)
                } else {
                    throw 'Element has no method named remove or removeNode'
                }
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
                    this._saveTabs()
                }
                this.$emit(EVENT_CLOSE, tab)
            }
        },
        create (tab) {
            let hooks = [...this.$taber.beforeCreateHooks]
            if (tab.meta.beforeCreate && isFunction(tab.meta.beforeCreate)) {
                hooks.push(tab.meta.beforeCreate)
            }
            let i = 0
            let _this = this
            let next = function (target) {
                if (target == null) {
                    hooks[++i].call(_this, tab, next)
                } else if (target === false) {
                    return
                } else {
                    if (isString(target) && target === tab.name) {
                        hooks[++i].call(_this, tab, next)
                    } else if (isObject(target) && target.name === tab.name) {
                        hooks[++i].call(_this, tab, next)
                    } else {
                        _this.$taber.open(target)
                    }
                }
            }
            hooks.push(() => {
                this.tabs.push(tab)
                const p = this.appendContent(tab).then(() => {
                    this.$set(tab, 'loading', false)
                })
                tab.promise = p
                if (tab.active !== false) {
                    this.select(tab)
                } else {
                    this._saveTabs()
                }
                const id = tabIdGen(tab.name, tab.key)
                this.tabMap[id] = tab

                next = null
                hooks = null
            })

            hooks[0].call(this, tab, next)
        },
        findOpenTab (name, key) {
            const id = tabIdGen(name, key)
            return this.tabMap[id]
        },
        select (tab) {
            if (!tab) {
                return
            }
            this.$set(tab, 'active', true)
            this.$emit(EVENT_ACTIVE_CHANGE, tab, this.active)
            this.active = tab
            this.tabs.forEach((ftab) => {
                if (tabIdGen(ftab.name, ftab.key) !== tabIdGen(tab.name, tab.key)) {
                    this.$set(ftab, 'active', false)
                    if (ftab.content && ftab.content.$el) {
                        ftab.content.$el.classList.remove('active')
                    }
                }
            })
            this._saveTabs()
            let promise = tab.promise
            if (!promise) {
                promise = Promise.resolve()
            }
            promise.then(() => {
                if (tab.active && tab.content) {
                    tab.content.$el.classList.add('active')
                    tab.promise = null
                }
            })
        },
        _saveTabs () {
            if (!this.$taber.persist) {
                return
            }
            const toSave = this.tabs.map((v) => {
                return {
                    name: v.name,
                    key: v.key,
                    params: v.params,
                    active: v.active
                }
            })
            store.save(consts.STORE_KEY, toSave)
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

@keyframes loading-rotate {
    from {transform: rotate(0);}
    to {transform: rotate(360deg);}
}

@-webkit-keyframes loading-rotate {
    from {transform: rotate(0);}
    to {transform: rotate(360deg);}
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

        &.loading:before {
            content: ' ';
            box-sizing: border-box;
            display: inline-block;
            width: 14px;
            height: 14px;
            position: absolute;
            left: 0px;
            top: 10px;
            border-radius: 9px;
            border: 2px solid #1ab394;
            border-top-color: transparent;
            border-left-color: transparent;
            animation: loading-rotate .8s infinite linear;
            -webkit-animation: loading-rotate .8s infinite linear;
        }

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