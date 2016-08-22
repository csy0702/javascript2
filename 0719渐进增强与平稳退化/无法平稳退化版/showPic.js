function showPic( whichPic,source){
	var placeholder=yc.$("placeholder");
	placeholder.src=source;
	var text=whichPic.getAttribute("title");
	var description=yc.$("description");
	description.firstChild.nodeValue=text;
}
//这个版本的案列，如果浏览器不支持js或者禁用了浏览器，则<a href="#" onclick="showPic(this,'1.jpg');return false;" title="桃花">桃花</a>  因为href的值为#，页面不会显示图片，而我们的目标是全显示