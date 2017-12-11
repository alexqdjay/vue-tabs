/**
 * vue-tabs v0.3.1
 * (c) 2017 ALEXQDJAY
 * mail: alexqdjay@126.com
 * @license Apache2
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

var store = {
    save: function save (key, value) {
        if (!key || !value) {
            return
        }
        window.localStorage[key] = JSON.stringify(value);
    },
    get: function get (key) {
        var value = window.localStorage[key];
        if (!value) {
            return null
        }
        return JSON.parse(value)
    }
};

var consts = {
    STORE_KEY: '$TABS'
};

var Tab = {
render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('li',{class:{'active': _vm.tabData.active, 'loading': _vm.tabData.loading}},[_vm._v(_vm._s(_vm.tabData.meta.title)),_c('span',{staticClass:"btn-close",on:{"click":function($event){$event.stopPropagation();_vm.close($event);}}},[_vm._v("×")])])},
staticRenderFns: [],
    props: {
        tabData: Object
    },
    methods: {
        close: function close () {
            this.$emit('close', this.tabData);
        }
    }
};

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
render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"vue-tabs"},[_c('div',{staticClass:"tabs-list-wrapper"},[_c('ul',{staticClass:"tabs-list"},_vm._l((_vm.tabs),function(tab,index){return _c('tab',{key:index,attrs:{"tab-data":tab},on:{"close":function($event){_vm.close(tab);}},nativeOn:{"click":function($event){_vm.clickTab(tab);}}})}))]),_vm._v(" "),_c('div',{ref:"contentWrapEl",staticClass:"tabs-content-wrapper"})])},
staticRenderFns: [],
    components: {Tab: Tab},
    data: function data () {
        return {
            tabs: [],
            active: null
        }
    },
    beforeCreate: function beforeCreate () {
        this.tabSize = 0;
        this.tabMap = {};
    },
    created: function created () {
        this.$taber.vm = this;
    },
    mounted: function mounted () {
        this.$taber.mounted();
    },
    methods: {
        appendContent: function appendContent (tab) {
            var Component = cached[tab.name];
            var _this = this;
            var promise;
            if (!Component) {
                if (isFunction(tab.meta.component)) {
                    var asyncFn = tab.meta.component;
                    this.$set(tab, 'loading', true);
                    promise = new Promise(asyncFn).then(function (Component) {
                        if (Component.__esModule) {
                            Component = Component.default;
                        }
                        return (cached[tab.name] = _this.getVue().extend(Component))
                    });
                } else {
                    promise = Promise.resolve(tab.meta.component).then(function (Component) {
                        return (cached[tab.name] = _this.getVue().extend(Component))
                    });
                }
            } else {
                promise = Promise.resolve(Component);
            }

            promise.then(function (Component) {
                newInstance(Component);
            });

            return promise

            function newInstance (Component) {
                var $el = document.createElement('div');
                _this.$refs.contentWrapEl.appendChild($el);
                var instance = new Component({
                    el: $el,
                    __taber: _this.$taber,
                    parent: _this,
                    $tab: tab
                });

                tab.content = instance;
                instance.$el.classList.add('tabs-content');
            }
        },
        clickTab: function clickTab (tab) {
            if (tab && !tab.active) {
                this.select(tab);
            }
        },
        close: function close (tab) {
            if (!tab) {
                return
            }

            var hooks = [].concat( this.$taber.beforeCloseHooks );
            if (tab.meta.beforeClose && isFunction(tab.meta.beforeClose)) {
                hooks.push(tab.meta.beforeClose);
            }
            hooks.push(_close);
            var i = 0;
            var _this = this;
            function next (target) {
                if (target == null) {
                    hooks[++i].call(_this, tab, next);
                }
            }
            hooks[0].call(_this, tab, next);

            function _close () {
                tab.content.$destroy();
                // Fix IE11 Element has no `remove`
                if (tab.content.$el.remove) {
                    tab.content.$el.remove();
                } else if (tab.content.$el.removeNode) {
                    tab.content.$el.removeNode(true);
                } else {
                    throw 'Element has no method named remove or removeNode'
                }
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
                    this._saveTabs();
                }
                this.$emit(EVENT_CLOSE, tab);
            }
        },
        create: function create (tab) {
            var this$1 = this;

            var hooks = [].concat( this.$taber.beforeCreateHooks );
            if (tab.meta.beforeCreate && isFunction(tab.meta.beforeCreate)) {
                hooks.push(tab.meta.beforeCreate);
            }

            var i = 0;
            var _this = this;
            var next = function (target) {
                if (target == null) {
                    hooks[++i].call(_this, tab, next);
                } else if (target === false) {
                    return
                } else {
                    if (isString(target) && target === tab.name) {
                        hooks[++i].call(_this, tab, next);
                    } else if (isObject(target) && target.name === tab.name) {
                        hooks[++i].call(_this, tab, next);
                    } else {
                        _this.$taber.open(target);
                    }
                }
            };
            hooks.push(function () {
                this$1.tabs.push(tab);
                var p = this$1.appendContent(tab).then(function () {
                    this$1.$set(tab, 'loading', false);
                });
                tab.promise = p;
                if (tab.active !== false) {
                    this$1.select(tab);
                } else {
                    this$1._saveTabs();
                }
                var id = tabIdGen(tab.name, tab.key);
                this$1.tabMap[id] = tab;

                next = null;
                hooks = null;
            });

            hooks[0].call(this, tab, next);
        },
        findOpenTab: function findOpenTab (name, key) {
            var id = tabIdGen(name, key);
            return this.tabMap[id]
        },
        select: function select (tab) {
            var this$1 = this;

            if (!tab) {
                return
            }
            this.$set(tab, 'active', true);
            this.$emit(EVENT_ACTIVE_CHANGE, tab, this.active);
            this.active = tab;
            this.tabs.forEach(function (ftab) {
                if (tabIdGen(ftab.name, ftab.key) !== tabIdGen(tab.name, tab.key)) {
                    this$1.$set(ftab, 'active', false);
                    if (ftab.content && ftab.content.$el) {
                        ftab.content.$el.classList.remove('active');
                    }
                }
            });
            this._saveTabs();
            var promise = tab.promise;
            if (!promise) {
                promise = Promise.resolve();
            }
            promise.then(function () {
                if (tab.active && tab.content) {
                    tab.content.$el.classList.add('active');
                    tab.promise = null;
                }
            });
        },
        _saveTabs: function _saveTabs () {
            if (!this.$taber.persist) {
                return
            }
            var toSave = this.tabs.map(function (v) {
                return {
                    name: v.name,
                    key: v.key,
                    params: v.params,
                    active: v.active
                }
            });
            store.save(consts.STORE_KEY, toSave);
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
    var persist = options.persist;
    this._tabsMap = {};
    ops_tabs.forEach(function (tab) {
        this$1._tabsMap[tab.name] = tab;
    });

    this.beforeCreateHooks = [];
    this.beforeCloseHooks = [];

    this._events = {};
    this.persist = persist;
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
        console.error('$on error event:[' + event + '], call:' + call);
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
    this.beforeCreateHooks.push(fn);
};

VueTaber$1.prototype.beforeCloseEach = function beforeCloseEach (fn) {
    if (!isFunction(fn)) {
        return
    }
    this.beforeCloseHooks.push(fn);
};

VueTaber$1.prototype._restoreTabs = function _restoreTabs () {
        var this$1 = this;

    if (!this.persist) {
        return
    }
    var storeTabs = store.get(consts.STORE_KEY);
    if (!storeTabs) {
        return
    }
    storeTabs.forEach(function (tab) {
        this$1.open(tab);
    });
    };

VueTaber$1.prototype.mounted = function mounted () {
    this._restoreTabs();
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
