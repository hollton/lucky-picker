# lucky-picker
[![npm](https://img.shields.io/npm/v/lucky-picker.svg)](https://www.npmjs.com/package/lucky-picker) 
[![LICENSE MIT](https://img.shields.io/npm/l/lucky-picker.svg)](https://www.npmjs.com/package/lucky-picker) 

无限滚动随机选择器

## 功能点 Feature
* 无限滚动
* 可交互滑动及点击上下滚动
* 自定义滚动时间
* 自定义 Tween.js 滚动动效，详见[Tween.js动画算法使用示意实例](https://www.zhangxinxu.com/study/201612/how-to-use-tween-js.html)
* 支持自适应缩放及缩放基点位置

## 效果 Demo
### [示例](https://github.com/hollton/lucky-picker/blob/master/index.html)
### ![demo](https://github.com/hollton/lucky-picker/blob/master/assets/demo.png)

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
> config 容器配置

| 名称        | 说明                                                  |  类型         | 默认值     |
| ----------- | ---------------------------------------------------- | ------------- | --------- |
| el          | 选择器名或选择器 Dom，必需                             | string or Dom | -         |
| autoScale   | 是否设置自适应缩放，默认渲染出的组件宽高为 456px * 144px | boolean       | false     |
| scaleOrigin | 设置缩放基点，可选值同 transform-origin 属性           | string        | 'initial' |

> option 数据配置

| 名称       | 说明                 |  类型                                                    | 默认值 |
| --------- | -------------------- | -------------------------------------------------------- | ---- |
| wheel     | 数据，必需            | string or Dom                                            | -    |
| init      | 初始化完成回调        | function(scrollIns, rs)，scrollIns：组件实例；rs：选中数据 | -    |
| end       | start方法执行完成回调 | function(rs)，rs：选中数据                                | -    |
| getResult | 交互执行完成回调      | function(rs)，rs：选中数据，interactive 设置为 true 生效   | -    |

> option.wheel 数据

| 名称        | 说明                 |  类型           | 默认值 |
| ----------- | ------------------- | --------------- | ----- |
| data        | 数据项，必需         | object[]        | -     |
| selected    | 初始选择项          | number / string | -     |
| infinite    | 是否无限滚动        | boolean         | true  |
| interactive | 是否可交互滑动及点击 | boolean         | false |

> wheel.data 数据

| 名称    | 说明     |  类型           | 默认值 |
| ------- | ------- | --------------- | ----- |
| value   | 唯一标识 | number / string | -     |
| display | 展示内容 | string          | -     |

## 方法 function

| 名称                 | 说明                                    |
| ------------------- | --------------------------------------- |
| start(index, opt)   | 随机滚动选择执行                         |
| destroy()           | 销毁实例                                |
| appendItem(dataArr) | 插入数据，格式同创建实例 wheel.data       |
| removeItem(valArr)  | 删除数据，值类型为 wheel.data.value      |
| newItem(dataArr)    | 替换使用新数据，格式同创建实例 wheel.data |

> start 参数

| 名称   | 说明               |  类型  | 默认值 |
| ----- | ------------------ | ------ | ----- |
| index | 随机选择项序号      | number | 随机数 |
| opt   | 执行时间、动效等配置 | object | -    |

> opt

| 名称      | 说明                |  类型  | 默认值 |
| --------- | ------------------ | ------ | ----- |
| time      | 执行时间，单位毫秒ms | number | 5000 |
| animation | 执行动效，可选值详见[Tween.js动画算法使用示意实例](https://www.zhangxinxu.com/study/201612/how-to-use-tween-js.html) | string | 'Quad.easeInOut' |
