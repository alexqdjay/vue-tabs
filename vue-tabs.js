/**
 * vue-tabs v0.1.0
 * (c) 2016 ALEXQDJAY
 * @license MIT
 */
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global.VueTaber = factory());
}(this, (function () { 'use strict';

function isFunction (fn) {
    if (!fn) {
        return false
    }
    return typeof fn === 'function'
}

function isString (str) {
    if (!str) {
        return false
    }
    return typeof str === 'string'
}

function isObject (obj) {
    if (!obj) {
        return false
    }
    return Object.prototype.toString.call(obj) === '[object Object]'
}

function tabIdGen (tabName, tabKey) {
    if ( tabKey === void 0 ) tabKey = '';

    if (isObject(tabName)) {
        var name = tabName.name;
        var key = tabName.key; if ( key === void 0 ) key = '';
        return (name + "/" + key)
    }
    return (tabName + "/" + tabKey)
}
var EVENT_ACTIVE_CHANGE = 'vue-tabs-active-change';
var EVENT_CLOSE = 'vue-tabs-close';
var cached = {};
var TabsView = {
render: function(){var _vm=this;var _h=_vm.$createElement;return _h('div',{staticClass:"vue-tabs"},[_h('div',{staticClass:"tabs-list-wrapper"},[_h('ul',{staticClass:"tabs-list"},[_vm._l((_vm.tabs),function(tab){return _h('li',{class:{'active': _vm.active===tab},on:{"click":function($event){_vm.clickTab(tab);}}},[_vm._s(tab.meta.title),_h('span',{staticClass:"btn-close",on:{"click":function($event){$event.stopPropagation();_vm.close(tab);}}},["×"])])})])])," ",_h('div',{ref:"contentWrapEl",staticClass:"tabs-content-wrapper"})])},
staticRenderFns: [],
    data: function data () {
        return {
            tabs: [],
            active: null
        }
    },
    beforeCreate: function beforeCreate () {
        this.tabSize = 0;
        this.tabMap = {};
        this.$taber.vm = this;
    },
    methods: {
        appendContent: function appendContent (tab) {
            var Component = cached[tab.name] || (cached[tab.name] = this.getVue().extend(tab.meta.component));
            // Component.prototype.$tab = tab
            var $el = document.createElement('div');
            var instance = new Component({
                el: $el,
                __taber: this.$taber,
                parent: this,
                $tab: tab
            });
            tab.content = instance;
            instance.$el.classList.add('tabs-content');
            this.$refs.contentWrapEl.appendChild(instance.$el);
        },
        clickTab: function clickTab (tab) {
            this.select(tab);
        },
        close: function close (tab) {
            if (!tab) {
                return
            }

            var hocks = [].concat( this.$taber.beforeCloseHocks );
            if (tab.meta.beforeClose && isFunction(tab.meta.beforeClose)) {
                hocks.push(tab.meta.beforeClose);
            }
            hocks.push(_close);
            var i = 0;
            var _this = this;
            function next (target) {
                if (target == null) {
                    hocks[++i].call(_this, tab, next);
                } else if (target === false) {
                    return
                }
            }
            hocks[0].call(_this, tab, next);

            function _close () {
                tab.content.$destroy();
                tab.content.$el.remove();
                this.tabMap[tabIdGen(tab)] = null;
                var index = this.tabs.indexOf(tab);
                if (index === -1) {
                    return
                }
                this.tabs.splice(index, 1);

                if (this.tabs.length > 0 && this.active === tab) {
                    if (index < this.tabs.length) {
                        this.select(this.tabs[index]);
                    } else {
                        this.select(this.tabs[this.tabs.length - 1]);
                    }
                } else if (this.tabs.length === 0) {
                    this.$emit(EVENT_ACTIVE_CHANGE, null, tab);
                }
                this.$emit(EVENT_CLOSE, tab);
            }
        },
        create: function create (tab) {
            var this$1 = this;

            var hocks = [].concat( this.$taber.beforeCreateHocks );
            if (tab.meta.beforeCreate && isFunction(tab.meta.beforeCreate)) {
                hocks.push(tab.meta.beforeCreate);
            }

            var i = 0;
            var _this = this;
            var next = function (target) {
                if (target == null) {
                    hocks[++i].call(_this, tab, next);
                } else if (target === false) {
                    return
                } else {
                    if (isString(target) && target === tab.name) {
                        hocks[++i].call(_this, tab, next);
                    } else if (isObject(target) && target.name === tab.name) {
                        hocks[++i].call(_this, tab, next);
                    } else {
                        _this.$taber.open(target);
                    }
                }
            };
            hocks.push(function () {
                this$1.tabs.push(tab);
                this$1.appendContent(tab);
                this$1.select(tab);
                var id = tabIdGen(tab.name, tab.key);
                this$1.tabMap[id] = tab;

                next = null;
                hocks = null;
            });

            hocks[0].call(this, tab, next);
        },
        findOpenTab: function findOpenTab (name, key) {
            var id = tabIdGen(name, key);
            return this.tabMap[id]
        },
        select: function select (tab) {
            if (!tab || tab === this.active) {
                return
            }
            this.$emit(EVENT_ACTIVE_CHANGE, tab, this.active);
            this.active = tab;
        }
    },
    watch: {
        active: function active (tab, otab) {
            if (!tab || tab === otab) {
                return
            }
            this.tabs.forEach(function (ftab) {
                if (ftab.name === tab.name) {
                    ftab.content.$el.classList.add('active');
                } else {
                    ftab.content.$el.classList.remove('active');
                }
            });
        }
    }
};

function install (Vue) {
    if (install.installed) {
        return
    }
    install.installed = true;

    Object.defineProperty(Vue.prototype, '$taber', {
        get: function get () {
            return this.$root._taber
        }
    });

    Object.defineProperty(Vue.prototype, '$tab', {
        get: function get$1 () {
            return this.$options.$tab
        }
    });

    TabsView.methods.getVue = function () { return Vue; };
    Vue.component('VueTabs', TabsView);

    Vue.mixin({
        beforeCreate: function beforeCreate () {
            if (this.$options.taber) {
                this._taber = this.$options.taber;
            } else if (this.$options.__taber) {
                this._taber = this.$options.__taber;
            }
        }
    });
}

var allEvents = ['vue-tabs-close', 'vue-tabs-active-change'];
var VueTaber$1 = function VueTaber$1 (options) {
    var this$1 = this;

    var ops_tabs = options.tabs;
    this._tabsMap = {};
    ops_tabs.forEach(function (tab) {
        this$1._tabsMap[tab.name] = tab;
    });

    this.beforeCreateHocks = [];
    this.beforeCloseHocks = [];

    this._events = {};
};

var prototypeAccessors = { vm: {} };

VueTaber$1.prototype.findTab = function findTab (tab) {
    if (!tab) {
        return null
    }
    var name;
    if (isString(tab)) {
        name = tab;
    } else {
        name = tab.name;
    }
    return this._tabsMap[name]
};

VueTaber$1.prototype.open = function open (tab) {
    if (isString(tab)) {
        tab = {name: tab};
    }
    var meta = this.findTab(tab);
    if (!meta) {
        console.error(("The Tab [" + (tab.name) + "] is not defined!"));
        return
    }
    tab.meta = meta;
    var findedTab = this.vm.findOpenTab(tab.name, tab.key);
    if (!findedTab) {
        this.vm.create(tab);
    } else {
        this.vm.select(findedTab);
    }
};

VueTaber$1.prototype.close = function close (tab) {
    if (isString(tab)) {
        tab = {name: tab};
    }
    var meta = this.findTab(tab);
    if (!meta) {
        console.error(("The Tab [" + (tab.name) + "] is not defined!"));
        return
    }
    tab.meta = meta;
    var findedTab = this.vm.findOpenTab(tab.name, tab.key);
    this.vm.close(findedTab);
};

VueTaber$1.prototype.select = function select (tab) {
    if (isString(tab)) {
        tab = {name: tab};
    }
    var findedTab = this.vm.findOpenTab(tab.name, tab.key);
    this.vm.select(findedTab);
};

VueTaber$1.prototype.$on = function $on (event, call) {
    if (!event || !isFunction(call)) {
        console.log('$on error event:[' + event + '], call:' + call);
        return
    }
    if (!this._events[event]) {
        this._events[event] = [];
        }
    this._events[event].push(call);
};

VueTaber$1.prototype.$off = function $off (event, call) {
    if (!event) {
        return
    }
    var listeners = this._events[event] || [];
    if (call) {
        var index = listeners.indexOf(call);
        if (index !== -1) {
            listeners.splice(index, 1);
        }
    } else {
        this._events[event] = [];
    }
};

VueTaber$1.prototype.beforeCreateEach = function beforeCreateEach (fn) {
    if (!isFunction(fn)) {
        return
    }
    this.beforeCreateHocks.push(fn);
};

VueTaber$1.prototype.beforeCloseEach = function beforeCloseEach (fn) {
    if (!isFunction(fn)) {
        return
    }
    this.beforeCloseHocks.push(fn);
};

prototypeAccessors.vm.set = function (vm) {
        var this$1 = this;

    this._vm = vm;
    var _this = this;
    allEvents.forEach(function (event) {
        vm.$on(event, function () {
                var args = [], len = arguments.length;
                while ( len-- ) args[ len ] = arguments[ len ];

            var listeners = this$1._events[event] || [];
            listeners.forEach(function (listener) {
                listener.apply(_this, args);
            });
        });
    });
};

prototypeAccessors.vm.get = function () {
    return this._vm
};

Object.defineProperties( VueTaber$1.prototype, prototypeAccessors );

VueTaber$1.install = install;

if (window.Vue) {
    window.Vue.use(VueTaber$1);
}

return VueTaber$1;

})));
