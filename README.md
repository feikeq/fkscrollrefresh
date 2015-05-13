# fkscrollrefresh 1.2
FKScrollRefresh滚动刷新jQuery下拉刷新上拉加载操作插件


```html
var FK_ScrollR = $('body').FKScrollRefresh({

 // 常规设置
        mode: 'all', // first：位于顶部的下拉刷新或或左侧右拉刷新   last: 位于底部的上拉刷新或右侧的左拉刷新 all:同时支持上下拉刷新动作
        slideSelector: '', //指定子元素的对象[一般不用指定]

        wrapperClass: 'fk-scrollRefresh', //主框架类名


        //鼠标设置
        mouseWheel:true, //是否支持滚轮[默认false]
        wheelThreshold:2, //灵敏度阀值[默认2]

        // 触摸设置
        swipeThreshold: 50, //高度阀值px [默认50]
        preventDefaultSwipeY: true, //上下拉 [默认true]

        headText: '下拉刷新', //提示文字
        footerText:'上拉刷新', //提示文字
        refreshIni:'释放刷新', //提示文字
        refreshNow:'正在刷新....', //提示文字
        refreshOk:'刷新成功', //提示文字
        

		//替换默认的加载图片和上下拉图
		imgRefresh:'res/refresh.png',
		imgScroll:'res/arrow.png',

	 
	// 激活动作
	onScrollAct: function(obj,status){
 
		//this.onRefreshStop(); //关闭刷新提示
		console.log(obj);
		alert('你的操作是'+status+' 当前页DOM对象输出在控制台！');

		console.log('关闭提示层: FK_ScrollR.onRefreshStop() ;');

	} 
});

 
console.log('查看FKScrollRefresh对象：')
console.log(FK_ScrollR);
