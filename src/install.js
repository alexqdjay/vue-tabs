import TabsView from './Tabs'
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