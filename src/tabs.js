import Hello from './components/Hello'

export default [{
    name: 'home',
    title: '首页',
    component: Hello
}, {
    name: 'test1',
    title: '测试1',
    component: {
        template: '<h2>测试1</h2>'
    }
}, {
    name: 'test2',
    title: '测试2',
    component: {
        template: '<h2>测试2</h2>'
    }
}, {
    name: 'test3',
    title: '测试3',
    component: {
        template: '<h2>测试3</h2>'
    }
}]