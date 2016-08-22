function prepareSlibeShow(){
	if(!yc.isCompatible()){return false;}
	if(!yc.$("linklist")){return false;}
	if(!yc.$("preview")){return false;}
	//为图片应用样式
	var preview=yc.$("preview");
	preview.style.position="absolute";
	preview.style.left="0px";
	preview.style.top="0px";
	//取得列表中所有的链接
	var list=yc.$("linklist");
	var links=list.getElementsByTagName("a");
	
//	//方案一
//	links[0].onmouseover=function(){
//		yc.moveElement("preview",-100,0,10);
//	}
//	links[1].onmouseover=function(){
//		yc.moveElement("preview",-200,0,10);
//	}
//	links[2].onmouseover=function(){
//		yc.moveElement("preview",-300,0,10);
//	}
	
//	//为每一个link绑定事件--方案二
//	for(var i=0;i<links.length;i++){
//		links[i].index=i+1;
//		yc.addEvent( links[i],'mouseover',function(){
//			yc.moveElement("preview",this.index*(-100),0,10);
//		});
//	}
	
	//闭包
	for(var i=0;i<links.length;i++){
		(function(index){
			yc.addEvent( links[index],'mouseover',function(){
				yc.moveElement("preview",(index+1)*-100, 0,5  );
			});
		})(i);
		
	}
}


yc.addLoadEvent(prepareSlibeShow);