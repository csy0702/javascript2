function highlightRows(){
	if(!yc.isCompatible()){return false};
	var rows=document.getElementsByTagName("tr");
	for(var i=0;i<rows.length;i++){
		rows[i].onmouseover=function(){//鼠标移入是添加移入的样式，删除移出的样式
			yc.removeClassName(this,"mouseout");
			yc.addClassName( this,"mouseover");
		}
		rows[i].onmouseout=function(){//鼠标移入是添加移出的样式，删除移入的样式
			yc.removeClassName(this,"mouseover");
			yc.addClassName( this,"mouseout");
		}
		
	}
}

yc.addLoadEvent(highlightRows);
