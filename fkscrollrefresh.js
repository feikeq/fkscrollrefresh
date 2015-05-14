/*! FKScrollRefresh v1.2 | FeikeWrold | www.fk68.net */
// 创建一个闭包 相当于 var jq = function($){}; jq(jQuery); //把Jquery当参传入 兼容jQuery操作符'$'和'jQuery '
(function($) {
    var defaults = {
        // 常规设置
        mode:"all",
        // first：位于顶部的下拉刷新或或左侧右拉刷新   last: 位于底部的上拉刷新或右侧的左拉刷新 all:同时支持上下拉刷新动作
        slideSelector:"",
        //指定子元素的对象[一般不用指定]
        wrapperClass:"fk-scrollRefresh",
        //主框架类名
        //鼠标设置
        mouseWheel:true,
        //是否支持滚轮[默认false]
        wheelThreshold:2,
        //灵敏度阀值[默认2]
        // 触摸设置
        swipeThreshold:50,
        //高度阀值px [默认50]
        preventDefaultSwipeY:true,
        //上下拉 [默认true]
        headText:"下拉刷新",
        //提示文字
        footerText:"上拉刷新",
        //提示文字
        refreshIni:"释放刷新",
        //提示文字
        refreshNow:"正在刷新....",
        //提示文字
        refreshOk:"刷新成功",
        //提示文字
        imgRefresh:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAaCAMAAAB1owf/AAAAM1BMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACjBUbJAAAAEHRSTlMA3z/vny9Pj28fr39fv88PqUI94gAAAKJJREFUKM99klsShCAMBCc8BBXduf9pFxHZQLH2J82QFAmmrFAsTpgRtwDhVOfChkSyhRwHohYSTCbc4eMnbERlK+pTalzCP8KzkJCRW+iIPVKNJMxwpGCKJXcM7OU2SQNNrYCVpB+NeTUvr0EmHYS//QrppiLWCumwzGxNeEtKvdH/qX2aWtlF4iUCCifHyblWcCCoYUW9IUa1v3dbpfCY8AU1WAzsQu60BgAAAABJRU5ErkJggg==",
        imgScroll:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAgBAMAAAAVss41AAAAHlBMVEUAAAAzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzOYOQtZAAAACXRSTlMA8DBcoEDbiyDW1p4HAAAAfElEQVQY09XRKxLCQBBF0VcBgUzh4mAHY3FYJChwWByWXRA+Sd3dpjuZqa4sIde9PrI1dm6TooZaEbyXvDaXsqqrdOCZ14sk+E1rDbWAo+Cjk58ejvA34q69oy2jdqeqgR46YCsZ5ozkaGUyDAp0CkxS4FelW5C1KjT/2AARalofLH+YhgAAAABJRU5ErkJggg==",
        // 激活动作达到刷新条件时回调(提示层动画对象,触发对象的mode模式上拉或下拉)
        onScrollAct:function() {},
        // 停止刷新关闭提示层
        onRefreshStop:function() {}
    };
    // 插件的定义    
    $.fn.FKScrollRefresh = function(options) {
        if (this.length == 0) return this;
        //支持设置多个元素
        if (this.length > 1) {
            this.each(function() {
                $(this).FKScrollRefresh(options);
            });
            return this;
        }
        //创建一个命名空间可以在插件的使用
        var slider = {};
        //设置相对像的翻页元素
        var el = this;
        // 浏览器窗口的大小
        var windowWidth = $(window).width();
        var windowHeight = $(window).height();
        /**
         * 初始化插件设置
         */
        var init = function() {
            //缺省值与用户自定义选项值合并
            slider.settings = $.extend({}, defaults, options);
            // 保存滑块的当前状态（如果当前动画，工作是真的）
            slider.working = false;
            // 保存 el 元素 
            slider.viewport = el;
            // 执行所有的DOM和CSS修改
            start();
        };
        /**
         * 开始slider
         */
        var start = function() {
            // 加载完成onScrollLoad 回调callback  
            //slider.settings.onScrollLoad();
            // 完全初始完毕
            slider.initialized = true;
            // 设置触摸事件
            initTouch();
            //鼠标滚轮
            if (slider.settings.mouseWheel) initMouseWheel();
        };
        /**
         * 初始化鼠标滚轮事件
         */
        var initMouseWheel = function() {
            // 初始化对象到座标到结果集
            slider.mousewheel = {
                up:0,
                down:0
            };
            //绑定事件
            slider.viewport.bind("mousewheel", MouseWheelHandler);
        };
        var MouseWheelHandler = function(e) {
            if (slider.working) {
                return;
            }
            /* 时间差 */
            if (slider.startedAt) {
                var now = new Date(), tmp = now.getTime() - slider.startedAt.getTime();
                //如果大于300毫秒则重新计数
                if (now.getTime() - slider.startedAt.getTime() > 300) {
                    slider.mousewheel = {
                        up:0,
                        down:0
                    };
                    slider.working = false;
                }
            }
            slider.startedAt = new Date();
            /* 时间差 */
            var scroll_Top = slider.viewport.scrollTop();
            //滚动高度
            var contentH = slider.viewport[0].scrollHeight;
            //内容高度
            var sliderH;
            //可见高度
            if (slider.viewport.selector == "body") {
                sliderH = windowHeight;
            } else {
                sliderH = slider.viewport.height();
            }
            var scroll_Bot = contentH - sliderH - scroll_Top;
            //底部高度
            slider.scroll_Top = scroll_Top;
            slider.scroll_Bot = scroll_Bot;
            slider.Content_H = contentH;
            /*console.log('滚动高度:'+scroll_Top +' , 内容高度:'+ contentH+' , '+ '可见高度'+sliderH);
            console.log(slider.scroll_Top +'|'+ slider.scroll_Bot);
*/
            if (slider.scroll_Top == 0 || slider.scroll_Bot == 0) {
                slider.rotINT_stop = false;
                var imgScroll_1 = '<div class="imgScroll" style="width:5%; display: inline-block;"><img src="' + slider.settings.imgRefresh + '"  style="vertical-align:middle; width:100%;" /></div>';
                var txtScroll_1 = '<span class="txtScroll" style="margin-left: 20px; color:#333;">' + slider.settings.refreshNow + "</span>";
                var html_1 = '<div style="width:100%;height:' + slider.settings.swipeThreshold + "px;margin: 0;padding: 0;border: 0;background: #eee;text-align: center;font-size: 1em;overflow: hidden;line-height: " + slider.settings.swipeThreshold + 'px;" class="' + slider.settings.wrapperClass + '">' + imgScroll_1 + txtScroll_1 + "</div>";
                e = window.event || e;
                var delta = Math.max(-1, Math.min(1, e.wheelDelta || -e.deltaY || -e.detail));
                if (delta < 0) {
                    if (slider.settings.mode == "first") return;
                    slider.mousewheel.up += delta;
                    //console.log('up' +slider.mousewheel.up);
                    if (Math.abs(slider.mousewheel.up) > slider.settings.wheelThreshold) {
                        slider.working = true;
                        if (slider.scroll_Bot == 0) slider.viewport.append(html_1);
                        if (slider.viewport.selector == "body") {
                            $("body").scrollTop(99999);
                        } else {
                            slider.viewport.scrollTop(99999);
                        }
                        slider.viewtips = slider.viewport.find("." + slider.settings.wrapperClass);
                        slider.imgScroll = slider.viewtips.find(".imgScroll");
                        slider.txtScroll = slider.viewtips.find(".txtScroll");
                        slider.txtScroll.data("txthtm", slider.txtScroll.html());
                        //保存原文字提示
                        onGoAjax(slider.viewtips, "last");
                    }
                } else {
                    if (slider.settings.mode == "last") return;
                    slider.mousewheel.down += delta;
                    //console.log('down:' + slider.mousewheel.down);
                    if (Math.abs(slider.mousewheel.down) > slider.settings.wheelThreshold) {
                        slider.working = true;
                        if (slider.scroll_Top == 0) slider.viewport.prepend(html_1);
                        slider.viewtips = slider.viewport.find("." + slider.settings.wrapperClass);
                        slider.imgScroll = slider.viewtips.find(".imgScroll");
                        slider.txtScroll = slider.viewtips.find(".txtScroll");
                        slider.txtScroll.data("txthtm", slider.txtScroll.html());
                        //保存原文字提示
                        onGoAjax(slider.viewtips, "first");
                    }
                }
            }
        };
        /**
         * 初始化触摸事件
         */
        var initTouch = function() {
            // 初始化对象到座标到结果集
            slider.touch = {
                start:{
                    x:0,
                    y:0
                },
                end:{
                    x:0,
                    y:0
                }
            };
            //绑定touchstart事件
            slider.viewport.bind("touchstart", onTouchStart);
        };
        /**
         * 事件处理程序”touchstart”
         */
        var onTouchStart = function(e) {
            if (slider.working) {
                return;
            }
            var scroll_Top = slider.viewport.scrollTop();
            //滚动高度
            var contentH = slider.viewport[0].scrollHeight;
            //内容高度
            var sliderH;
            //可见高度
            if (slider.viewport.selector == "body") {
                sliderH = windowHeight;
            } else {
                sliderH = slider.viewport.height();
            }
            var scroll_Bot = contentH - sliderH - scroll_Top;
            //底部高度
            slider.scroll_Top = scroll_Top;
            slider.scroll_Bot = scroll_Bot;
            slider.Content_H = contentH;
            /*
            console.log('滚动高度:'+scroll_Top +' , 内容高度:'+ contentH+' , '+ '可见高度'+sliderH);
            console.log(slider.scroll_Top +'|'+ slider.scroll_Bot);
*/
            if (slider.scroll_Top == 0 || slider.scroll_Bot == 0) {
                slider.rotINT_stop = false;
                var orig = e.originalEvent;
                // 记录开始的x，y坐标
                /*slider.touch.start.x = orig.changedTouches[0].pageX;
                slider.touch.start.y = orig.changedTouches[0].pageY;*/
                slider.touch.start.x = orig.changedTouches[0].screenX;
                slider.touch.start.y = orig.changedTouches[0].screenY;
                var imgScroll_1 = '<div class="imgScroll" style="width:5%; display: inline-block;"><img src="' + slider.settings.imgScroll + '"  style="vertical-align:middle; width:100%;" /></div>';
                var txtScroll_1 = '<span class="txtScroll" style="margin-left: 20px; color:#333;">' + slider.settings.headText + "</span>";
                var imgScroll_2 = '<div class="imgScroll" style="width:5%;display: inline-block;"><img src="' + slider.settings.imgScroll + '"  style="vertical-align:middle;width:100%;-webkit-transform: rotate(180deg); transform: rotate(180deg); " /></div>';
                var txtScroll_2 = '<span class="txtScroll" style="margin-left: 20px; color:#333;">' + slider.settings.footerText + "</span>";
                var html_1 = '<div style="width:100%;height:0;margin: 0;padding: 0;border: 0;background: #eee;text-align: center;font-size: 1em;overflow: hidden;line-height: ' + slider.settings.swipeThreshold + 'px;" class="' + slider.settings.wrapperClass + '">' + imgScroll_1 + txtScroll_1 + "</div>";
                var html_2 = '<div style="width:100%;height:0;margin: 0;padding: 0;border: 0;background: #eee;text-align: center;font-size: 1em;overflow: hidden;line-height: ' + slider.settings.swipeThreshold + 'px;" class="' + slider.settings.wrapperClass + '">' + imgScroll_2 + txtScroll_2 + "</div>";
                if (slider.scroll_Top == 0) {
                    slider.viewport.prepend(html_1);
                    slider.viewtips = slider.viewport.find("." + slider.settings.wrapperClass + ":first");
                } else if (slider.scroll_Bot == 0) {
                    slider.viewport.append(html_2);
                    slider.viewtips = slider.viewport.find("." + slider.settings.wrapperClass + ":last");
                }
                // 绑定“touchmove”事件到viewport元素
                slider.viewport.bind("touchmove", onTouchMove);
                // 绑定“touchend”事件到viewport元素
                slider.viewport.bind("touchend", onTouchEnd);
            }
        };
        /**
         *事件处理程序”touchmove”
         */
        var onTouchMove = function(e) {
            var orig = e.originalEvent;
            // 计算X轴Y轴的偏移量
            /*var xMovement = orig.changedTouches[0].pageX - slider.touch.start.x;
            var yMovement = orig.changedTouches[0].pageY - slider.touch.start.y;*/
            //不能用鼠示在元素上的位置，应该要在屏幕上的位置，因为元素会跟着动。
            var xMovement = orig.changedTouches[0].screenX - slider.touch.start.x;
            var yMovement = orig.changedTouches[0].screenY - slider.touch.start.y;
            var params;
            //console.log('yMovement:'+yMovement + ' orig.changedTouches[0].pageY:' +orig.changedTouches[0].pageY); //debug 
            // 如果是Y操作方式，Y轴滑动比X多将不做操作
            if (slider.settings.preventDefaultSwipeY) {
                params = yMovement;
            } else {
                params = xMovement;
            }
            /*
            1.首选在 onTouchStart 时判断滚动条顶部或底部是否到0值，到了就绑定接下onTouchMove、onTouchEnd事件准备出提示！
            2.在 onTouchMove 事件里判断手指方向，如果是正数说明是往前，如果是负数说明是往后
            3.知道前后再进行元素的选择
             */
            if (params < 0) {
                if (slider.settings.mode == "first") return;
                ////事件里判断手指方向，如果是负数说明是往后
                if (slider.scroll_Bot != 0) return;
            } else {
                if (slider.settings.mode == "last") return;
                //事件里判断手指方向，如果是正数说明是往前
                if (slider.scroll_Top != 0) return;
            }
            e.preventDefault();
            //如果正在动画就不进行操作
            if (!slider.working) slider.viewtips.show();
            //显示提示层
            slider.working = true;
            //console.log('params:'+params); //出现这行说明开始绑定事件成功 
            slider.params = Math.abs(params);
            //偏移值
            slider.viewtips.height(slider.params);
            //拖动时逐帧显示动画效果
            //slider.viewport.css('-webkit-transform','translateY('+params+'px)'); //用这方法最后关闭提示不好做动画
            slider.viewport.css("margin-top", params + "px");
            /* var scroll_Top = R_obj.scrollTop(); //滚动高度

            if(params < 0){
                //R_obj.scrollTop( scroll_Top - params );
            }
             */
            //到达阀值进行提示的下一步动画
            if (slider.params > slider.settings.swipeThreshold) {
                //console.log('1slider.scroll_Act:' + slider.scroll_Act );
                if (!slider.scroll_Act) {
                    //保存数据
                    slider.imgScroll = slider.viewtips.find(".imgScroll");
                    slider.txtScroll = slider.viewtips.find(".txtScroll");
                    slider.txtScroll.data("txthtm", slider.txtScroll.html());
                    //保存原文字提示
                    slider.scroll_Act = true;
                    //console.log('2slider.scroll_Act');
                    slider.clear_rotate = true;
                    //停止之前的动画
                    rotateDIV(slider.imgScroll, 180, 0);
                    slider.txtScroll.html(slider.settings.refreshIni);
                }
            } else {
                if (slider.scroll_Act) {
                    slider.clear_rotate = true;
                    //停止之前的动画
                    rotateDIV(slider.imgScroll, 0, 180);
                    slider.scroll_Act = false;
                    var tmp_txt = slider.txtScroll.data("txthtm");
                    //还原数据
                    slider.txtScroll.html(tmp_txt);
                }
            }
        };
        /**
         * 转动 rot设置为180就转半圈停止，设置为360就转一圈停止，rot设置361就永远不停止 
         */
        var rotateDIV = function(obj, rot, form) {
            /*
            几种状态：
            1. slider.clear_rotate　清除之前动画强行新的动画
            2. slider.rotINT_stop　 强行停止动画
             */
            if (slider.clear_rotate) {
                clearInterval(slider.rotINT);
            }
            ////停止之前的动画
            slider.clear_rotate = false;
            //去掉１状态
            var rotNUM = form || 0;
            ////计时器
            slider.rotINT = setInterval(function() {
                if (rot > rotNUM) {
                    rotNUM += 10;
                } else {
                    rotNUM -= 10;
                }
                //console.log('slider_stop:'+slider.rotINT_stop);
                if (slider.rotINT_stop) {
                    rotNUM = 0;
                    clearInterval(slider.rotINT);
                }
                obj.css({
                    "-webkit-transform":"rotate(" + rotNUM + "deg)",
                    "-moz-transform":"rotate(" + rotNUM + "deg)",
                    transform:"rotate(" + rotNUM + "deg)"
                });
                if (rotNUM == rot) {
                    clearInterval(slider.rotINT);
                }
                if (rotNUM == 360 || rotNUM == -360) rotNUM = 0;
            }, 10);
        };
        /**
         * 事件处理程序”touchend”
         */
        var onTouchEnd = function(e) {
            // 移处touchmove事件绑定
            slider.viewport.unbind("touchmove", onTouchMove);
            // 移处touchend事件绑定
            slider.viewport.unbind("touchend", onTouchEnd);
            slider.working = false;
            var orig = e.originalEvent;
            // 保存结束的X，Y位置
            /*slider.touch.end.x = orig.changedTouches[0].pageX;
            slider.touch.end.y = orig.changedTouches[0].pageY;*/
            slider.touch.end.x = orig.changedTouches[0].screenX;
            slider.touch.end.y = orig.changedTouches[0].screenY;
            var distance = 0;
            // 计算滑动的绝对距离
            if (slider.settings.preventDefaultSwipeY) {
                distance = slider.touch.end.y - slider.touch.start.y;
            } else {
                distance = slider.touch.end.x - slider.touch.start.x;
            }
            //console.log('onTouchEnd:'+distance);
            if (distance < 0) {
                if (slider.settings.mode == "first") return;
                if (slider.scroll_Bot != 0) return;
            } else {
                if (slider.settings.mode == "last") return;
                if (slider.scroll_Top != 0) return;
            }
            // 检查是否达到阈值距离
            if (Math.abs(distance) > slider.settings.swipeThreshold) {
                slider.viewtips.height(slider.settings.swipeThreshold);
                //固定高度
                slider.working = true;
                //负数向后 正数向前
                distance < 0 ? onGoAjax(slider.viewtips, "last") :onGoAjax(slider.viewtips, "first");
            } else {
                // 还原当前页动画
                slider.clear_rotate = true;
                //停止之前的动画
                // rotateDIV(slider.imgScroll,180);
                slider.viewtips.slideUp(200, function() {
                    var tmp_viewtips = slider.viewport.find("." + slider.settings.wrapperClass);
                    tmp_viewtips.remove();
                });
                // /*这里使用text-indent属性来触发动画，是因为我们这里没有文字，所以使用text-indent而不会影响到元素的样式效果，这里也可以用font-size等*/
                // slider.viewport.animate({ height: 0 }, { 
                //     step: function(now,fx) { 
                //         $(this).css('-webkit-transform','translateY('+now+'px)'); 
                //     }, 
                //     duration:2000//'slow' 
                // }
                // ,'linear'
                // ); 
                slider.viewport.animate({
                    "margin-top":"0px"
                }, 200);
            }
        };
        /**
         * 事件处理程序 
         */
        var onGoAjax = function(obj, status) {
            if (slider.settings.mode == "first" && status == "last") return;
            if (slider.settings.mode == "last" && status == "first") return;
            slider.settings.onRefreshStop = el.onRefreshStop;
            slider.imgScroll.find("img").attr("src", slider.settings.imgRefresh);
            slider.txtScroll.html(slider.settings.refreshNow);
            slider.clear_rotate = true;
            ////停止之前的动画
            rotateDIV(slider.imgScroll, 361);
            //永久转动
            //  回调callback
            slider.settings.onScrollAct(obj, status);
        };
        /**
         * ===================================================================================
         * = 公共方法
         * ===================================================================================
         */
        /**
         * 停止刷新
         */
        el.onRefreshStop = function() {
            //例： testing.onRefreshStop();
            slider.rotINT_stop = true;
            slider.working = false;
            if (slider.txtScroll) slider.txtScroll.html(slider.settings.refreshOk);
            if (slider.viewtips) slider.viewtips.slideUp(200, function() {
                var tmp_viewtips = slider.viewport.find("." + slider.settings.wrapperClass);
                tmp_viewtips.remove();
            });
            slider.viewport.animate({
                "margin-top":"0px"
            }, 200);
        };
        init();
        //初始化
        // 返回当前jQuery对象
        return this;
    };
})(jQuery);
