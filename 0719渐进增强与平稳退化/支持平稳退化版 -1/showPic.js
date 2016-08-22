//优点：将img和p从HTML中删除，由dom来动态创建和管理
function preparePlaceHolder(){
	if(!yc.isCompatible()){return false;}
	if( !yc.$('imagegallery')){return false;}
	var placeholder=document.createElement("img");
	placeholder.src="placeholder.png";
	placeholder.id="placeholder";
	placeholder.alt="图片浏览";
	
	var description=document.createElement("p");
	description.id="description";
	
	var desctext=document.createTextNode("请选择一张图片");
	description.appendChild(desctext);
	
	var gallery=yc.$("imagegallery");
	yc.insertAfter(placeholder,gallery);
	yc.insertAfter(description,placeholder)
}

function showPic( whichPic){
	//如果不存在placeholder，则无法显示图片，程序无法运行，
	//对图片进行替换
	if( !yc.$('placeholder')){return false;}
	var source=whichPic.getAttribute("href");//得到图片的地址
	var placeholder=yc.$("placeholder");
	if(placeholder.nodeName !="IMG"){return false;}
	
	placeholder.src=source;
	//如果description不存在，则不显示，
	//对文本进行替换
	if(yc.$("description")){
		//判断a标签中的标题存在，如果存在，就为这个，不存在就为空
		var text=whichPic.getAttribute("title")? whichPic.getAttribute("title"):"";
		var description=yc.$("description");
		if(description.firstChild.nodeType==3){//判断是不是文本节点
			description.firstChild.nodeValue=text;
		}
	}
	
	return true;
}
//这个函数用于做浏览器的测试和检测，这样js代码不再依赖于那些没有保证的假设，可以保证js代码可以平稳退化
function preparePic(){
	if(!yc.isCompatible()){return false;}
	//在页面上指定了容器的ul，这样就可以通过js一次性的给所有的a元素加上事件
	if(!yc.$("imagegallery")){return false;}
	var gallery=yc.$("imagegallery");
	var links=gallery.getElementsByTagName("a");
	for( var i=0;i<links.length;i++){
		links[i].onclick=function(){
			//this  ->links[i]
			return showPic(this)? false:true;//只有这个onclick绑定的函数返回值是false，才不会运行<a href="">
		}
	}
}

yc.addLoadEvent(preparePlaceHolder);
yc.addLoadEvent(preparePic);
