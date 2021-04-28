# lucky-picker
[![npm](https://img.shields.io/npm/v/lucky-picker.svg)](https://www.npmjs.com/package/lucky-picker) 
[![LICENSE MIT](https://img.shields.io/npm/l/lucky-picker.svg)](https://www.npmjs.com/package/lucky-picker) 

仿老虎机滚动随机选择器

## 功能点 Feature
* 无限滚动
* 可交互滑动及点击上下滚动
* 自定义滚动时间
* 自定义 Tween.js 滚动动效，详见[Tween.js动画算法使用示意实例页面](https://www.zhangxinxu.com/study/201612/how-to-use-tween-js.html)
* 支持自适应缩放及缩放基点位置

## 效果 Demo
* [示例](https://github.com/hollton/lucky-picker/blob/master/index.html)
* ![xxxxx](https://github.com/hollton/lucky-picker/blob/master/assets/demo.png)

## 使用 Usage

### npm
```
npm install lucky-picker  --save

import LuckyPicker from 'lucky-picker'
new LuckyPicker(config, option)
```

### script
```
<script src="lucky-picker/index.js"></script>

new window.LuckyPicker(config, option)
```

## 参数 Params
* @param {Object} config: { // 容器配置
*    el: string or Dom, // 选择器名或选择器 Dom，必需
*    autoScale: boolean, // 设置自适应缩放，默认 false，默认渲染出的组件宽高为 456px * 144px
*    scaleOrigin: string, // 设置缩放基点，默认 'initial'，可选值同 transform-origin 属性
* }
* @param {Object} option: { // 数据配置
*    wheel: {Object} {, // 数据
*        data: [{
*            value: number or string, // 唯一标识
*            display: string, // 展示内容
*        }],
*        selected: number or string, // 初始选择项，值类型为 data.value
*        infinite: boolean, // 是否无限滚动，默认 true
*        interactive: boolean // 是否可交互滑动及点击，默认 false
*    }
*    init: function(scrollIns, rs){}, // 初始化完成回调，scrollIns：组件实例；rs：选中数据
*    end: function(rs){}, // start方法执行完成回调，rs：选中数据
*    getResult: function(rs){}, // 交互执行完成回调，rs：选中数据，interactive 为 true 生效
* }

## 方法 function
* start(index, opt) // 随机滚动选择执行入口
*    index: number, // 随机选择项序号
*    opt: {
*        time: ms, // 执行时间，单位毫秒ms，默认5000
*        animation: string // 执行动效，默认'Quad.easeInOut'，可选值详见[Tween.js动画算法使用示意实例页面](https://www.zhangxinxu.com/study/201612/how-to-use-tween-js.html)
* },
* destroy: function(), // 销毁实例
* appendItem: function(dataArr), // 插入数据，格式同创建实例 data
* removeItem: function(valArr), // 删除数据，值类型为 data.value
* newItem: function(dataArr), // 替换使用新数据，格式同创建实例 data