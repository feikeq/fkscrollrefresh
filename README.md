# fkscrollrefresh
FKScrollRefresh滚动刷新jQuery下拉刷新上拉加载操作插件


var FK_ScrollR = $('body').FKScrollRefresh({
	// 常规设置
		mode: 'all', // first：位于顶部的下拉刷新或或左侧右拉刷新   last: 位于底部的上拉刷新或右侧的左拉刷新 
		slideSelector: '', //指定子元素的对象
 
 
		//wrapperClass: 'fk-scrollRefresh', //主框架类名


		//鼠标设置
		//mouseWheel:true, //是否支持滚轮
		//wheelThreshold:2, //灵敏度阀值

		// 触摸设置
		swipeThreshold: 50, //高度阀值px
		preventDefaultSwipeY: true, //上下拉

		headText: '你可以下拉刷新', //提示文字
		footerText:'你可以上拉刷新', //提示文字
		refreshIni:'你可以释放刷新', //提示文字
		refreshNow:'哈哈正在刷新....', //提示文字
		refreshOk:'太棒了！刷新成功', //提示文字

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
