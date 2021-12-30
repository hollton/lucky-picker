/**
 * lucky-picker
 */
import './js/tween'
import './js/animation'
import './css/index.less'

var deepClone = function (obj, newObj = []) {
    for (let key in obj) {
        if (typeof obj[key] == 'object') {
            newObj[key] = (obj[key].constructor === Array) ? [] : {}
            deepClone(obj[key], newObj[key]);
        } else {
            newObj[key] = obj[key]
        }
    }
    return newObj;
}

var LuckyPicker = function (_config = {}, _option = {}) {
    var elContainer = typeof _config.el === 'string' ? document.querySelector(_config.el) : _config.el;
    if(!elContainer) {
        console.error('can not find required parameter el')
        return null
    }
    const {wheel = {}, ...restOption} = _option
    const {data = [], ...restWheel} = wheel
    if(!data.length) {
        console.error('can not find required parameter wheel.data')
        return null
    }
    let option = {
        wheel: {
            infinite: true,
            ...restWheel,
            data: deepClone(data)
        },
        init: function () {},
        getResult: function () {},
        end: function () {},
        ...restOption
    }
    var wrapClassName = 'p-scroll-wrap';
    var self = this;
    var rows = 5;
    var itemHeight = 34;
    var itemSize2d = 9;
    var itemSize3d = 9;
    var scroll3dAngle = 360 / (itemSize3d * 2);
    var rs = {
        result: []
    };

    // 缩放比例（width >=1，height > 0）
    function setScale(node){
        var wrapBox = {
            width: 456,
            height: 144
        }
        if(node && _config.autoScale) {
            var [scaleWidth, scaleHeight] = [elContainer.clientWidth / wrapBox.width, elContainer.clientHeight / wrapBox.height];
            var scaleWidthSize = Math.max(Math.min(scaleWidth, scaleHeight), 1);
            var scaleMinSize = Math.min(scaleWidthSize, scaleHeight)
            var scaleHeightSize = scaleMinSize >= 1 ? scaleMinSize : scaleHeight;
            node.style['transform'] = `scale(${scaleWidthSize}, ${scaleHeightSize})`;
            if(_config.scaleOrigin) {
                node.style['transform-origin'] = _config.scaleOrigin
            }
        }
    }

    function getselectedIdx(wheel) {
        var index = 0;
        for (var i = 0; i < wheel.data.length; i++) {
            if (wheel.data[i].value == wheel.selected) {
                index = i;
                break;
            } else {
                index = 0;
            }
        }
        return index;
    }

    function generateItems(wheel, start, end, is3d) {
        var data = wheel.data;
        var html = '',
            value,
            display,
            len = data.length,
            infinite = wheel.infinite,
            selectedIdx = getselectedIdx(wheel);

        //选中的位置
        start += selectedIdx;
        end += selectedIdx;

        for (var i = start; i <= end; i++) {
            var idx = (i < 0 ? len + (i % len) : i) % len;
            value = data[idx].value;
            display = data[idx].display;

            if (is3d) {
                var deg = 0;
                var show = "list-item";
                deg = -(i - selectedIdx) * scroll3dAngle % 360;

                if (!infinite) {
                    if (i < 0 || i > (len - 1)) {
                        show = "none"
                    } else {
                        show = "list-item"
                    }
                }
                html += '<li data-index="' + i + '" data-val="' + value + '" style="transform:rotateX(' + deg + 'deg) translateZ(' + (itemHeight * rows / 2) + 'px); display: ' + show + '">' + display + '</li>';
            } else {
                var opacity = 1;
                if (!infinite) {
                    if (i < 0 || i > (len - 1)) {
                        opacity = 0
                    } else {
                        opacity = 1
                    }
                }
                html += '<li data-index="' + i + '" data-val="' + value + '" style="opacity: ' + opacity + '">' + display + '</li>';
            }
        }
        return html;
    }

    function createEl(wheel) {
        var html = '';
        html += '<div class="p-select-main">'+
                    '<div class="p-select-body">'+
                        '<div class="p-select-line"><span class="triangle triangle-right"></span><span class="triangle triangle-left"></span></div>'+
                            '<div class="p-select-item">'+
                                '<div class="p-select-col">'+
                                    '<div class="p-select-list" style="transform: translateZ(' + (itemHeight * rows / 2 +3) + 'px)">'+
                                        '<ul class="p-select-ul">'+
                                            generateItems(wheel, -itemSize2d, itemSize2d, false)+
                                        '</ul>'+
                                    '</div>'+
                                '<ul class="p-select-wheel">'+
                            generateItems(wheel, -itemSize3d, itemSize3d, true)+
                        '</ul>'+
                    '</div>'+
                '</div>'+
            '</div>'+
        '</div>';

        var node = document.createElement("div");
        node.className = wrapClassName;
        node.innerHTML = html;
        elContainer.appendChild(node)
    }

    function snap(pos) {
        var pos = Math.round(pos),
            n1 = Math.round(pos % itemHeight),
            n2 = itemHeight / 2;

        if (Math.abs(n1) < n2) {
            return pos - n1;
        } else {
            return pos - n1 + (pos > 0 ? itemHeight : -itemHeight);
        }
    }

    function getVal(pos, data, infinite, selectedIdx) {
        var len = data.length,
            index = (Math.round(-pos / itemHeight) - itemSize2d + selectedIdx) % len,
            index = index < 0 ? len + index : index,
            dataIndex = Math.round(-pos / itemHeight) - itemSize2d + selectedIdx,
            result = {
                value: data[index].value,
                display: data[index].display,
                dataIndex: dataIndex
            };
        return result;
    }

    function getPosition(el) {
        var style = getComputedStyle(el),
            matrix,
            pref = ['t', 'webkitT', 'MozT', 'OT', 'msT'],
            px;
        for (var i = 0; i < pref.length; i++) {
            var v = pref[i];
            if (style[v + 'ransform'] !== undefined) {
                matrix = style[v + 'ransform'];
                break;
            }
        }

        matrix = matrix.split(')')[0].split(', ');
        px = Number(matrix[13] || matrix[5]);
        return px;
    }

    function isPC() {
        var ua = navigator.userAgent;
        return /Windows|Mac\ OS\ X\ /ig.test(ua);
    }

    function destroy() {
        rs = {
            result: []
        };
        var wrapDom = document.querySelector('.' + wrapClassName);
        wrapDom && wrapDom.remove();
        window.removeEventListener('resize', setScale);
    }

    this.Scroll = function (el, wheel, index) {
        this.el = el;
        this.wheel = wheel;
        this.index = index;
        this.opt = {
            data: this.wheel.data,
            scrollEl2d: el.querySelector('.p-select-ul'),
            item2d: el.querySelectorAll('.p-select-ul li'),
            scrollY: -itemHeight * itemSize2d,
            marginTop: 0,
            dataLen: this.wheel.data.length,
            lastY: 1,
            moveY: 0,
            current: 0,
            infinite: this.wheel.infinite,
            rotateX: 0,
            selectedIdx: getselectedIdx(wheel),
            transTimer: null,
            scrollTimer: null,
            clickDown: false,
            inertia: true,
            interactive: this.wheel.interactive
        };
        this.opt.scrollEl3d = el.querySelector('.p-select-wheel');
        this.opt.item3d = el.querySelectorAll('.p-select-wheel li');
        this.defaultScrollY = this.opt.scrollY;
        this.init();
    };

    this.Scroll.prototype = {
        init: function () {
            this.Run(0, this.opt.scrollY);
            if(!this.opt.interactive) {
                return
            }
            if (isPC()) {
                this.el.addEventListener('mousedown', this.touchStart.bind(this), false);
                document.addEventListener('mousemove', this.touchMove.bind(this), false);
                document.addEventListener('mouseup', this.touchEnd.bind(this), false);
            } else {
                this.el.addEventListener('touchstart', this.touchStart.bind(this), false);
                this.el.addEventListener('touchmove', this.touchMove.bind(this), false);
                this.el.addEventListener('touchend', this.touchEnd.bind(this), false);
                this.el.addEventListener('touchcancel', this.touchEnd.bind(this), false);
            }

            this.itemClick(this.opt.item3d);
        },
        start: function(index, opt){
            opt = {
                time: 5000,
                animation: 'Quad.easeInOut',
                ...opt
            }
            var wheelData = this.wheel.data || []
            index = parseInt(index)
            if(!(index >= 0 && index < wheelData.length)) {
                index = Math.random() * wheelData.length >> 0;
            }
            var self = this
            var targetIndex = wheelData.length * 5 + index
            if(wheelData.length <= 1) { // 只有1人
                var interval = 200, minInterval = 100, step = 10,timer,time = 0,canCalc = true;
                var timeoutFn = function(){
                    if(canCalc && interval > minInterval){
                        interval -= step;
                    } else {
                        canCalc = false;
                        interval += step;
                    }
                    
                    time += interval
                    timer = setTimeout(function(){
                        if(time >= opt.time) {
                            clearTimeout(timer)
                            option.end(wheelData[index])
                        } else {
                            self.cusTouch(1)
                            timeoutFn()
                        }
                    }, interval)
                }
                timeoutFn()
            } else {
                var lastIdx
                Math.animation(0, targetIndex, opt.time, opt.animation, function(i){
                    var dataIndex = parseInt(i) % wheelData.length
                    if(lastIdx === dataIndex) {
                        return
                    }
                    lastIdx = dataIndex
                    self.scrollTo(wheelData[dataIndex].value,0)
                    if(targetIndex === i) {
                        option.end(wheelData[dataIndex])
                    }
                });
            }
        },
        destroy: destroy,
        itemClick: function (itemObj) {
            var self = this;
            for (var i = 0; i < itemObj.length; i++) {
                itemObj[i].addEventListener('click', function (e) {
                    var curIdx = Number(e.target.dataset.index);
                    var lastIdx = rs.result[self.index].dataIndex;
                    var diff = curIdx - lastIdx;
                    self.cusTouch(diff);
                }, false)
            }
        },
        Run: function (interval, pos) {
            if (interval == 0) {
                this.opt.scrollEl2d.style.webkitTransition = "none";
                this.opt.scrollEl3d.style.webkitTransition = "none";
            } else {
                this.opt.scrollEl2d.style.webkitTransition = "transform cubic-bezier(0.190, 1.000, 0.220, 1.000) " + interval + "ms";
                this.opt.scrollEl3d.style.webkitTransition = "transform cubic-bezier(0.190, 1.000, 0.220, 1.000) " + interval + "ms";
            }
            this.opt.scrollEl2d.style.webkitTransform = "translate3d(0," + pos + "px, 0)";
            pos = Math.round(-(pos * (scroll3dAngle / itemHeight)) - 180);
            this.opt.scrollEl3d.style.webkitTransform = "rotateX(" + pos + "deg) translate3d(0,0,0)";
        },
        scrollDone: function () {
            clearInterval(this.opt.scrollTimer);
            clearTimeout(this.opt.transTimer);
        },
        onMove: function (pos, cusDiff) {
            var self = this,
                pos = pos || getPosition(this.opt.scrollEl2d),
                index = Math.round(-pos / itemHeight) - itemSize2d,
                diff = index - this.opt.current;

            if (cusDiff != undefined || diff) {
                this.opt.current = index;

                //2D
                for (var i = 0; i < this.opt.item2d.length; i++) {
                    var item = this.opt.item2d[i];
                    var index = Number(item.getAttribute("data-index")) + diff,
                        len = self.opt.dataLen,
                        idx = (index < 0 ? len + (index % len) : index) % len,
                        val = self.opt.data[idx].value,
                        display = self.opt.data[idx].display;

                    if (!self.opt.infinite) {
                        if (index < 0 || index > (len - 1)) {
                            item.style.opacity = "0"
                        } else {
                            item.style.opacity = "1"
                        }
                    }

                    item.setAttribute("data-index", index);
                    item.setAttribute("data-val", val);
                    item.innerText = display;
                }

                for (var i = 0; i < this.opt.item3d.length; i++) {
                    var item = this.opt.item3d[i];
                    var index = Number(item.getAttribute("data-index")) + diff,
                        len = self.opt.dataLen,
                        idx = (index < 0 ? len + (index % len) : index) % len,
                        val = self.opt.data[idx].value,
                        deg = -(index - self.opt.selectedIdx) * scroll3dAngle,
                        display = self.opt.data[idx].display;
                    if (!self.opt.infinite) {
                        if (index < 0 || index > (len - 1)) {
                            item.style.display = "none"
                        } else {
                            item.style.display = "list-item"
                        }
                    }
                    item.setAttribute("data-index", index);
                    item.setAttribute("data-val", val);
                    item.setAttribute("data-idx", idx);
                    item.innerText = display;
                    item.style.webkitTransform = "rotateX(" + deg + "deg) translateZ(" + (itemHeight * rows / 2) + "px)";
                }

                //2d margin-top
                this.opt.marginTop += diff * itemHeight;
                this.opt.scrollEl2d.style.marginTop = this.opt.marginTop + "px";
            }
        },
        touchStart: function (e) {
            if (e.type == 'touchstart') {
                this.opt.startY = e.targetTouches["0"].clientY;
            } else {
                this.opt.startY = e.clientY;
                this.opt.clickDown = true;
            }
            this.opt.startTime = new Date();
        },
        touchMove: function (e) {
            if (e.type == 'touchmove') {
                e.preventDefault();
                for (var i = 0; i < e.targetTouches.length; i++) {
                    this.opt.curY = e.targetTouches[i].clientY;
                }
            } else {
                if (this.opt.clickDown) {
                    this.opt.curY = e.clientY;
                } else {
                    return false;
                }
            }

            this.opt.moveY = this.opt.curY - this.opt.startY;
            this.opt.distance = this.opt.scrollY + this.opt.moveY;

            if (this.opt.curY < this.opt.lastY) {
                //move up
                this.opt.direction = 1;
            } else if (this.opt.curY > this.opt.lastY) {
                //move down
                this.opt.direction = -1;
            }

            if (this.opt.direction) {
                this.onMove();
                this.opt.lastY = this.opt.curY;
                this.Run(0, this.opt.distance);
            }
        },
        touchEnd: function (e) {
            if (e.type == 'touchend') {
                this.opt.lastY = e.changedTouches["0"].clientY;
            } else {
                if (this.opt.clickDown) {
                    this.opt.lastY = e.clientY;
                    this.opt.clickDown = false;
                } else {
                    return false;
                }
            }
            this.opt.endTime = new Date();

            var self = this,
                interval = this.opt.endTime - this.opt.startTime,
                speed = 500,
                addPos = 0;

            //模拟惯性
            if (this.opt.inertia && interval !== 0 && interval < 300) {
                speed = Math.abs(this.opt.moveY / interval);
                speed = Math.round(speed * 1000);
                addPos = speed / 3 * (this.opt.moveY < 0 ? -1 : 1);
                speed = speed < 500 ? 500 : speed;
            } else {
                addPos = this.opt.moveY;
                this.opt.inertia = true
            }

            this.opt.scrollY += snap(addPos);
            this.opt.moveY = 0;

            clearInterval(this.opt.scrollTimer);
            this.opt.scrollTimer = setInterval(function () {
                self.onMove();
            }, 100);


            clearTimeout(this.opt.transTimer);
            this.opt.transTimer = setTimeout(function () {
                self.onMove();
                self.scrollDone();
            }, speed);

            //非无限滚动阈值
            if (!this.opt.infinite) {
                var maxScroll = this.opt.selectedIdx * itemHeight - itemHeight * itemSize2d;
                var minScroll = this.opt.selectedIdx * itemHeight - itemHeight * (this.opt.dataLen - 1) - itemHeight * itemSize2d;
                if (this.opt.scrollY > maxScroll) {
                    this.opt.scrollY = maxScroll;
                } else if (this.opt.scrollY < minScroll) {
                    this.opt.scrollY = minScroll;
                }
            }

            this.Run(speed, this.opt.scrollY);

            var res = getVal(this.opt.scrollY, this.opt.data, this.opt.infinite, this.opt.selectedIdx);
            rs.result[this.index] = res;
            option.getResult(rs);
        },
        cusTouch: function (diff) {
            this.opt.inertia = false;
            var e1 = {
                clientY: 0,
                targetTouches: [{clientY: 0}],
                type: "click"
            };
            var e2 = {
                clientY: -itemHeight * diff,
                targetTouches: [{clientY: -itemHeight * diff}],
                type: "click"
            };
            var e3 = {
                clientY: -itemHeight * diff,
                changedTouches: [{clientY: -itemHeight * diff}],
                type: "click"
            };
            this.touchStart(e1)
            this.touchMove(e2);
            this.touchEnd(e3);
        },
        scrollTo: function (val, interval) {
            this.wheel.selected = val;
            var selectedIdx = getselectedIdx(this.wheel);
            var diff = this.opt.selectedIdx - selectedIdx;
            this.opt.scrollY = this.defaultScrollY + diff * itemHeight;
            this.Run(interval, this.opt.scrollY);
            this.onMove(this.opt.scrollY, true);
        },
        removeItem: function (valArr) {
            var data = this.opt.data,
                resultVal = rs.result[this.index].value,
                removeLen = 0,
                moveEnd = false;

            for (var i = 0; i < data.length; i++) {
                for (var j = 0; j < valArr.length; j++) {
                    if (data[i].value == valArr[j]) {
                        //移除
                        data.splice(i--, 1);
                        removeLen++;
                    } else {
                        if (valArr[j] == resultVal) {
                            moveEnd = true;
                        }
                    }
                }
            }

            if (moveEnd) {
                rs.result[this.index] = {
                    value: data[data.length - 1].value,
                    display: data[data.length - 1].display
                }

            }
            this.opt.dataLen = data.length;
            this.scrollTo(rs.result[this.index].value, 0);
        },
        appendItem: function (dataArr) {
            var data = this.opt.data;

            //去重
            for (var i = 0; i < data.length; i++) {
                for (var j = 0; j < dataArr.length; j++) {
                    if (data[i].value == dataArr[j].value) {
                        dataArr.splice(j--, 1)
                    }
                }
            }

            //添加
            for (var i = 0; i < dataArr.length; i++) {
                data.push(dataArr[i]);
            }

            this.opt.dataLen = data.length;
            this.scrollTo(rs.result[this.index].value, 0);
        },
        newItem: function (dataArr) {
            var data = this.opt.data;
            data.length = 0;
            for (var i = 0; i < dataArr.length; i++) {
                data.push(dataArr[i]);
            }
            this.opt.dataLen = data.length;
            this.scrollTo(rs.result[this.index].value, 0);
        }
    };

    function init(wheel) {
        destroy()
        //创建DOM
        createEl(wheel);
        var wrapDom = document.querySelector('.' + wrapClassName);
        setTimeout(() => {
            setScale(wrapDom)
        });
        wrapDom.addEventListener('touchmove', function (e) {
            e.preventDefault()
        }, false);
        window.addEventListener('resize', function(){
            setScale(wrapDom)
        })
        var el = document.querySelector(".p-select-item");
        var scroll = new self.Scroll(el, wheel, 0);
        //初始结果
        var res = getVal(scroll.opt.scrollY, scroll.opt.data, scroll.opt.infinite, scroll.opt.selectedIdx);
        rs.result.push(res);
        //传出初始结果
        option.init(scroll, rs);
        return scroll;
    }

    return init(option.wheel)
};

export default LuckyPicker;
module.exports = LuckyPicker;