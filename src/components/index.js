import TabsView from './Tabs'
import Vue from 'vue'

function install (Vue) {
    if (install.installed) {
        return
    }
    install.installed = true

    Object.defineProperty(Vue.prototype, '$taber', {
        get () {
            return this.$root._taber
        }
    })

    Vue.mixin({
        beforeCreate () {
            if (this.$options.taber) {
                this._taber = this.$options.taber
            } else if (this.$options.__taber) {
                this._taber = this.$options.__taber
            }
        },
        mounted () {
            if (this.$options.taber) {
                const Taber = this.$options.taber
                const tabsView = new TabsViewConstructor({
                    el: this.$options.taber.el,
                    __taber: Taber
                })

                Taber.vm = tabsView
                // Taber.vm.tabs = Taber.opened
                Taber.vm.$on('vue-tabs-actived-change', (tab) => {
                    Taber.actived = tab
                })

                Taber.vm.$on('vue-tabs-close', (tab) => {
                    Taber.close(tab)
                })
            }
        },
        destory () {
            if (this.$options.tabs) {
                this.$options.tabs.vm.$off('vue-tabs-actived-change')
                this.$options.tabs.vm.$off('vue-tabs-close')
            }
        }
    })
}

const TabsViewConstructor = Vue.extend(TabsView)
export default class VueTaber {
    constructor (options) {
        const {tabs: ops_tabs, el} = options
        this._tabsMap = {}
        ops_tabs.forEach((tab) => {
            this._tabsMap[tab.name] = tab
        })

        this.el = el

        this.opened = []

        this.beforeOpenHocks = []
    }
    open (tab) {
        let Tab = tab
        if (typeof tab === 'string') {
            Tab = this._tabsMap[tab]
            if (!Tab) {
                console.error(`The Tab [${tab}] is not defined!`)
                return
            }
        }

        if (this.opened.indexOf(Tab) === -1) {
            this.opened.push(Tab)
            this.vm.open(Tab)
        }

        this.actived = Tab
    }
    close (tab) {
        if (typeof tab === 'string') {
            tab = this._tabsMap[tab]
        }
        if (!tab) {
            console.error(`The Tab [${tab}] is not defined!`)
        }
        const index = this.opened.indexOf(tab)
        if (index !== -1) {
            this.opened.splice(index, 1)

            if (this.opened.length === 0) {
                return
            }

            if (this.actived !== tab) {
                return
            }
            if (index < this.opened.length) {
                this.open(this.opened[index])
            } else {
                this.open(this.opened[this.opened.length - 1])
            }
        }
    }
    set actived (tab) {
        if (this.vm) {
            this.vm.active = tab
        }
    }
    get actived () {
        if (this.vm) {
            return this.vm.active
        }
    }
    beforeOpenEach (fn) {
        if (!fn || typeof fn !== 'function') {
            return
        }
        this.beforeOpenHocks.push(fn)
    }
}

VueTaber.install = install

if (window.Vue) {
    window.Vue.use(VueTaber)
}