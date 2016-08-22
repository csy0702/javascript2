/*
	myReady(function(){
		document.getElementsByTagName("p")[0].style.color="red";
	} )
*/
		function myReady(fn){
		
				//对于现代浏览器   我们就用addEventListener
				if(document.addEventListener){
					document.addEventListener("DOMready",fn,false);
					//		DOMready （事件名）       fn   （事件触发的回调函数）    false  （ 事件是否在捕获事件冒泡阶段）
				}else{
					//自己模拟的
					IEContentLoaded();
				}
			
			
			function IEContentLoaded(fn){
				
				var isdone=false;
				
				//保证只执行一次
				function ainit(){
					if(!isdone){
						isdone=true;
						fn();
					}
				}
				//函数的自调用
				(function(){
					//doscroll方法
					//这里相当于一个循环，catch中设置延迟，就是为了延迟它不报错，
					try{
						//如果DOM没有加载完，调用doscroll会报错
						document.documentElement.doScroll("left");
					}catch(e){
						//出错，表示DOM树没有加载完，   延迟再试一次   调用延迟    直接跳过    callee（延迟回调）  
						setTimeout(arguments.callee,10);
						return;
					}
					//doscroll没有报错，那么DOM树就加载完毕，就会调用ainit()
					ainit();
					
				})();
				
				//监听document的加载状态
				document.onreadystatechange=function(){
					if(document.readyState=="complete"){
						//说明DOM加载完毕
						ainit();
					}
				}
			}
		}
		
myReady(function(){
				document.getElementsByTagName("p")[0].style.color="red";
} )