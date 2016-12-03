import TabsView from './Tabs.vue'
export default function install (Vue) {
    if (install.installed) {
        return
    }
    install.installed = true

    Object.defineProperty(Vue.prototype, '$taber', {
        get () {
            return this.$root._taber
        }
    })

    Object.defineProperty(Vue.prototype, '$tab', {
        get () {
            return this.$options.$tab
        }
    })

    TabsView.methods.getVue = () => Vue
    Vue.component('VueTabs', TabsView)

    Vue.mixin({
        beforeCreate () {
            if (this.$options.taber) {
                this._taber = this.$options.taber
            } else if (this.$options.__taber) {
                this._taber = this.$options.__taber
            }
        }
    })
}