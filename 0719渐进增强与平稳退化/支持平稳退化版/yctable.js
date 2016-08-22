//库：  放置一些内置函数的扩展（String,Array,Object）
//放一些自定义的函数，这些函数为了不与别的库冲突，定义到一个明明空间（对象）中；

(function(){
//--------------- 给window 添加了一个命名空间 --------------------------------------- 
	if(!window.yc){
		//window.yc={};
		window['yc']={};
	}
	//window.yc.$=$;
	
//	window.yc.prototype={
//		$:function(id){
//			return document.getElementById("id");
//		}
//	}
//===============================================================================


//--------------------------浏览器能力检测-------------------------------------------------
	//判断浏览器是否兼容这个库：浏览器能力检测        (===)  值和类型都要相等
	function isCompatible(  other){
		if(  other===false||  !Array.prototype.push  || !Object.hasOwnProperty  ||!document.createElement  || ! document.getElementsByTagName){
			return false;
		}
		return true;
	}
	window['yc']['isCompatible']=isCompatible;
	
	
//===============================================================================


//----------------获取 页面元素的操作  ---------------------------------------------------
	//<div id="a">   <div id="b">
	//$("ddd")   var array=$("a","b" )
	//如果参数是一个字符串，则返回一个对象
	//如果参数是多个字符串，则返回一个数组
	
	//封装id
	function $(){
		var elements=[];
		//查找作为参数提供的所有元素
		for(var i=0;i<arguments.length;i++){
			var element=arguments[i];
			if( typeof element=='string'){
				//如果这个元素是一个string，则表明这是一个id
				element=document.getElementById(element);
			}
			if(arguments.length==1){
				return element;
			}
			
			elements.push(element);
		}
		return elements;
	}
	window['yc']['$']=$;
	
	
	//封装类名
	//classname:要找的类名   tag：要找的标签
	function getElementsByClassName( className,tag,parent){
		parent=parent||document;//判断有没有父节点，没有就是整个页面
		if(!(parent=$(parent))  ){return false;}//判断传入的这个父节点是不是一个正确的id名，而不是随便乱传的
		//查看所有匹配的标签
		var allTags=(tag=="*"&&parent.all)? parent.all: parent.getElementsByTagName(tag);
		
		//创建一个正则表达式，来判断classname是否正确     ^a ||  a
		var regex=new RegExp("(^|\\s)"+className+"(\\s|$)");
		
		//查找每一个元素
		var matchingElements=[];
		for( var i=0;i<allTags.length;i++){
			var element=allTags[i];//只取到的是页面匹配的标签
				//alert(element);
			//alert(element.className);
			if( regex.test(  element.className)  ){  // regex.test(字符串) 返回真假        只要匹配到了就返回，不会往下继续执行                    element.className是得到匹配的标签名字
				matchingElements.push(element);
			}
			
		}
		return matchingElements;
	}
	window['yc']['getElementsByClassName']=getElementsByClassName;
	
//===============================================================================================	






//------------------------跨浏览器的事件对象---------------------------------------


	//注：添加事件时用的函数必须与删除时用的函数要是同一个函数
	//重复调用匿名函数其实是将函数实例化了，为两个不同的函数，而添加删除事件时必须是同一个函数，
	//移出监听事件不能使用匿名函数
	//node :节点  ("show"--id名)   type:事件类型（'click'）   listener：监听器函数(移除时不能用匿名函数，不然就删除不了这个监听事件)
	function addEvent( node,type,listener){
		if( !isCompatible()){return false;}
		if( !( node=$(node)) ){return false;}
		//w3c加事件的方法
		if( node.addEventListener  ){//ff
			node.addEventListener(type,listener,false);
			return true;
		}else if( node.attachEvent){
			//ie事件
			node['e'+type+listener]=listener;
			node[type+listener]=function(){
				node['e'+type+listener](window.event);
				//listener(window.event);
			}
			node.attachEvent('on'+type,node[type+listener]);
			return true;
			
		}
		return false;
	}
	window['yc']['addEvent']=addEvent;
	
	/*
	页面加载事件   当我有几个加载事件的时候不会覆盖之前的
	*/
	function addLoadEvent( func){
		var oldOnLoad=window.onload;
		if( typeof window.onload!='function'){
			window.onload=func;
		}else{
			window.onload=function(){
				oldOnLoad();
				func();
				
			}
		}
	}
	window['yc']['addLoadEvent']=addLoadEvent;
	
	
	//移出事件
	function removeEvent( node,type,listener){
		if( !( node=$(node)) ){return false;}
		//w3c加事件的方法
		if( node.removeEventListener  ){
			node.removeEventListener(type,listener,false);
			return true;
		}else if( node.detachEvent){
			//ie事件
			node.detachEvent('on'+type,node[type+listener]);
			node[type+listener]=null;
			return true;
			
		}
		return false;
	}
	window['yc']['removeEvent']=removeEvent;
	
	
	//事件对象
	function getEvent(event){
		return event?  event:window.event;
	}
	window['yc']['getEvent']=getEvent;
	//事件目标
	function getTarget(event){
		return event.target||event.srcElement;
	}
	window['yc']['getTarget']=getTarget;
	
	//阻止浏览器的默认行为
	function preventDefault(event){
		if(event.preventDefault){
			event.preventDefault();
		}else{
			event.returnValue=false;
		}
	}
	window['yc']['preventDefault']=preventDefault;
	
	//取消事件捕获和冒泡
	
	function stopPropagation(event){
		if(event.stopPropagation){
			event.stopPropagation();
		}else{
			event.cancelable=true;
		}
	}
	window['yc']['stopPropagation']=stopPropagation;
//================================================================================
	


//----------------------DOM中的节点操作补充-------------------------------------
	
	//给参考节点后面加入一个节点,
	//node ：要插入的节点     referenceNode：参考节点
	function insertAfter(  node,  referenceNode){
		if(  !(node=$(node)) ){return false;}
		if(  !(referenceNode=$(referenceNode)) ){return false;}
		var parent=referenceNode.parentNode;	//参考节点的父节点
		if( parent.lastChild==referenceNode){ //判断当前节点referenceNode是最后一个节点
			parent.appendChild( node);
		}else{
			parent.insertBefore(  node,referenceNode.nextSibling);
		}
	}
	
	window['yc']['insertAfter']=insertAfter;
	
	//删除节点下的所有子节点
	
	function removeChildren(parent){
		if( !( parent=$(parent)) ){return false;}
		while( parent.firstChild){
			parent.removeChild(  parent.firstChild);
		}
		//返回父元素，以实现连缀
		return parent;
	}
	window['yc']['removeChildren']=removeChildren;
	
	
	//在一个父节点的第一个子节点前面添加一个新节点
	function prependChild( parent, newChild){
		if( !(parent=$( parent)) ){return false;}
		if( !( newChild=$(newChild)) ){ return false;}
		if(parent.firstChild){//查看parent节点下是否有子节点，如果有一个子节点，就在子节点前面添加
			parent.insertBefore( newChild, parent.firstChild);
		}else{
			//如果没有子节点就直接添加
			parent.appendChild( newChild);
		}
		return parent;
	}
	window['yc']['prependChild']=prependChild;
	
	
//==================================================================================


//--------------------界面显示效果操作----------------------------------------------
	//封装开关显示隐藏效果
	//node:节点id号      value:block/none
	function toggleDisplay( node ,value){
		if(  !(node=$(node)) ){return false; }
		if( node.style.display !='none'){
			node.style.display='none';
		}else{
			node.style.display=value || '';
		}
		return true;
	}
	
	window['yc']['toggleDisplay']=toggleDisplay;
	
	
	
//==================================================================================
	
	
	
	//模板替换     str:模板文字中包含{属性名}
	//  o:是对象  ，格式{属性名：值}
	//以o对象中对象的属性名的值来替换str模板
	function supplant(  str,o){
		
		return str.replace(/{([a-z]*)}/g,
						//alert(a+"\t"+b);  //a:{border}
						function (a,b){
							var r=o[b];
							return r;
						}
		)
						
	}
	window['yc']['supplant']=supplant;
	
	
/*=======================================================================================*/	
	//升级版的eval
	function parseJSON( str,filter ){
		var result=eval( "("+str+")" );
		if( filter!=null&& typeof( filter )=='function' ){
			for ( var i in result) {
				result[i]=filter( i,result[i] );
			}
		}
		return result;
	}
	window['yc']['parseJSON']=parseJSON;
	
/*====================================================================================*/	
	//把一个对象转为json字符串
	/*扩展全局的     window.Object,prototype=xxx
	 * 需求：给Object类的prototype添加一个功能	toJSAONString()将属性的值以JSON格式输出
	 *return ;返回json字符串*/
	function toJSONStringStu(obj){
		var result='"{';
		for(var key in obj){
			if(typeof obj[key]!='function'){
				result+='"'+key+'":"'+obj[key]+'",';
			}
		}
		return result.substring(0,result.length-1)+'}"';//substring 截取字符串中介于两个指定下标之间的字符。
	}
	window['yc']['toJSONStringStu']=toJSONStringStu;
	
//===================================================================================

/*/////////////////////////////////////////////////////////////////////////
--------------样式操作表.1--设置样式规则（设置行内样式）-----------------------
////////////////////////////////////////////////////////////////////////////
*/
//将word-word转换为 wordWord
	function camelize(  s){//  正则匹配得到的结果是[-w,w]  strMatch=-w   p1=w
		return s.replace( /-(\w)/g,function( strMatch,p1){
			return p1.toUpperCase();//toUpperCase()变成大写字母
		});
	}
	window['yc']['camelize']=camelize;
	
//将wordWord转换为word-word
	function uncamelize( s,sep){ // 正则匹配得到的结果是[dW,d,W]  match=dW   p1=d   p2=W
		sep=sep||'-';
		return s.replace( /([a-z])([A-Z])/g,function( match,p1,p2){
													return p1+sep+p2.toLowerCase();
		});									//toLowerCase()变成小写字母
	}
	window['yc']['uncamelize']=uncamelize;
	
	
	

//通过id修改单个元素的样式
	function setStyleById( element,styles){
		if(!(element=$(element))){return false;}
		
		//遍历styles对象的属性，并应用每个属性    property相当于attribute 
		for( property in styles){
			if( !styles.hasOwnProperty(property)){//hasOwnProperty()判断一个对象中是否有这个属性,如果没有这个属性则跳过下面的操作进行下一轮循环
				continue;
			}
			if( element.style.setProperty){
				//setProperty("background-color" )
				//DOM2样式规范       null表示索引		setProperty("color","red",null)		
				element.style.setProperty(uncamelize(property,'-'),styles[property],null);
			}else{
				//备用方法 element.style.backgroudColor="red"
				element.style[ camelize( property) ]=styles[property];
			}
		}
		return true;
	}
	window['yc']['setStyle']=setStyleById;
	window['yc']['setStyleById']=setStyleById;
	
//根据标签名来设置样式
	/*
	 tagname:标签名
	 styles：样式对象  {"color":"red"}
	 parent：父标签的id （可写可不写，不写的话就是页面中所有的这个标签名设置）
	 */
	function setStylesByTagName( tagname,  styles, parent){
		parent=$(parent)||document;
		var elements=parent.getElementsByTagName(tagname);
		for(var i=0;i<elements.length;i++){
			setStyleById(  elements[i], styles);
		}
	}
	
	window['yc']['setStylesByTagName']=setStylesByTagName;
	
//通过类名修改多个元素的样式
/*
	 tag:标签名
	 styles：样式对象  {"color":"red"}
	 parent：父标签的id 
	 className:标签上的类名
	 */
	function setStylesByClassName( parent, tag,className,styles){
		if(!(parent=$(parent))){return false;}
		var elements=getElementsByClassName(className,tag,parent)
		for(var i=0;i<elements.length;i++){
			setStyleById(elements[i],styles);
		}
		return true;
	}
	window['yc']['setStylesByClassName']=setStylesByClassName;
	

/*/////////////////////////////////////////////////////////////////////////
--------------样式操作表.2--基于className切换样式-------------------------------
////////////////////////////////////////////////////////////////////////////
*/
//取得元素中类名是数组
	function getClassNames(element){
		if(!(element=$(element))){return false;}
		//用一个空格替换多个空格，split(' ')是在每个空格字符处进行分割  this is=>this,is
		return element.className.replace(/\s+/,' ').split(' ');
	}
	window['yc']['getClassNames']=getClassNames;
	
//检查元素中是否存在某个类	
	function hasClassName( element,className){
		if(!(element=$(element))){return false;}
		var classes=getClassNames(element);
		for(var i=0;i<classes.length;i++){
			if(classes[i]===className){
				return true;
			}
		}
		return false;
	}
	window['yc']['hasClassName']=hasClassName;
	
//为元素添加类

	function addClassName( element,className){
		if(!(element=$(element))){return false;}
		var space=element.className?' ':'';
		element.className+=space+className;
		return true;
		
	}
	window['yc']['addClassName']=addClassName;
	
//从元素中删除类
	function removeClassName( element,className){
		if(!(element=$(element))){return false;}
		//先获取所有的类
		var classes=getClassNames(element);
		//循环遍历数组删除匹配的项
		//因为从数组中删除项会使数组变短，所有要反向删除
		var length=classes.length
		var a=0;
		for(var i=length-1 ; i>=0;i--){
			if( classes[i]===className){
				delete(classes[i]);
				a++;
			}
		}
		element.className=classes.join(' ');
		//判断删除是否成功
		return ( a>0? true:false );
	}
	window['yc']['removeClassName']=removeClassName;
	
	
/*/////////////////////////////////////////////////////////////////////////
--------------样式操作表.3--更大范围更改，切换样式表-------------------------------
////////////////////////////////////////////////////////////////////////////
*/
/*
 	通过URL取得包含在所有样式表中的数组
	样式表的url就是href   media：
	目标设备类型 screen/print.
*/
	function getStyleSheets(url,media){
		var sheets=[];
		for ( var i=0;i<document.styleSheets.length;i++) {
			
			if ( document.styleSheets[i].href ){
				continue;
			}
			if ( url && document.styleSheets[i].href.indexOf(url)==-1 ) {
				continue;
			}
			if ( media ) {
				//规范化meida字符串
				media=media.replace(/,\s/,',');//把空格去掉
				var sheetMedia;
				if ( document.styleSheets[i].media.mediaText ) {
					//dom
					sheetMedia=document.styleSheets[i].media.mediaText.repeat(/,\s*/,',');
					//safari会增加额外的逗号和空格
					sheetMedia=document.styleSheets[i].media.replace(/,\s*/,'');
				}else{
					//ie
					sheetMedia=document.styleSheets[i].media.replace(/,\s/,',');
				}
				//如果media不匹配，则跳过
				if( media!=sheetMedia ){
					continue;
				}
			}
			sheets.push( document.styleSheets[i] );
		}
		return sheets;
	}
	window['yc']['getStyleSheets']=getStyleSheets;

	
	//添加样式表   但是不会立马起作用，会有一个时间缓冲
	function addStyleSheet(url,media){
		media=media||'screen';
		var link=document.createElement("link");
		link.rel="stylesheet";
		link.type="text/css";
		link.href=url;
		link.media=media;
		
		document.getElementsByTagName("head")[0].appendChild(link);
		
	}
	window['yc']['addStyleSheet']=addStyleSheet;

	//移除样式表
	
	function removeStyleSheet(url,media){
		var styles=getStyleSheets(url,media);
		for(var i=0;i<styles.length;i++){
			//获得link或style节点  ie用styleSheet. owningElement   W3C用styleSheet.ownerNode
			var node=styles[i].ownerNode||styles[i].owningElement;
			//禁用样式表
			styles[i].disabled=true;
			//移除节点
			node.parentNode.removeChild( node);
			
		}
	}

	window['yc']['removeStyleSheet']=removeStyleSheet;



/*/////////////////////////////////////////////////////////////////////////
--------------样式操作表.4--添加样式规则-------------------------------
////////////////////////////////////////////////////////////////////////////
*/
/*
 添加样式规则	
*/

	function addCSSRule( selector,styles,index,url,media){
		var declaration='';
		//根据styles参数（样式对象）构建声明字符串
		for( property in styles){
			if(!styles.hasOwnProperty(property)){
				continue;
			}				//属性                    属性值
			declaration+=property+":"+styles[property]+";" ;
			
		}
		//根据url和media获取样式表
		var styleSheets=getStyleSheets(url,media);
		var newIndex;
		//循环所有满足条件的样式表，并添加样式规则
		for( var i=0;i<styleSheets.length;i++){
			//添加样式规则
			if(styleSheets[i].insertRule){//w3c  ->cssRules
				//计算规则添加的索引位置  w3c默认它的长度为最后一个位置
				newIndex=(index>=0? index:styleSheets[i].cssRules.length);
				//DOM样式规则添加的方法  insertRule(rule,index);
				styleSheets[i].insertRule( selector+"{"+declaration+"}",newIndex);
			}else if( styleSheets[i].addRule){//ie中认为规则列表最后一项为-1； 
				newIndex=(index>=0? index:-1)
				//ie样式规则添加的方法  addRule(selector,style[,index]);
				styleSheets[i].addRule(selector,declaration,newIndex);
				
			}
		}
	}

	window['yc']['addCSSRule']=addCSSRule;


/*
 编辑修改样式规则  yc.editCSSRule('.test',{'font-size':12px});
 */
	function editCSSRule( selector,styles,url,media){
		var styleSheets=getStyleSheets(url,media);
		
		for(var i=0;i<styleSheets.length;i++){
			var rules=styleSheets[i].cssRules||styleSheets[i].rules;
			if(!rules){
				continue;
			}
			//ie默认选择器使用大写故转换为大写的形式，
			selector=selector.toUpperCase();
			for( var j=0;j<rules.length;j++){
				//判断取到的选择器转换为大写与传入的选择器转换为大写是否相等
				if( rules[j].selectorText.toUpperCase()==selector){
					for(property in styles){
						if( !styles.hasOwnProperty(property)){
							continue;
						}
						//将这条规则设为新样式
						//DOM中   添加规则属性要转换为大写       style.backgroundColor="red";
						rules[j].style[camelize(property)]=styles[property];
					}
					
				}
			}
		}
	}

	window['yc']['editCSSRule']=editCSSRule;
/*
取得一个元素的最终计算样式(比如这个标签有行内样式，内部样式，外部样式，看最终实用的是那个计算样式)
 */
	function getStyle(element,property){
		if(!(element=$(element))||!property){return false;}
		var value=element.style[camelize(property)];
		if(!value){
			if(document.defaultView && document.defaultView.getComputedStyle){//w3c
				var css=document.defaultView.getComputedStyle(element,null);//取出element这个元素的所有计算样式
				value=css?css.getPropertyCSSValue( property):null;
			}else if( element.currentStyle){//ie
				value=element.currentStyle[camelize(property)];
			}
		}
		return value='auto'?'':value;
	}
	window['yc']['getStyle']=getStyle;
	window['yc']['getStyleById']=getStyle;




//=====================================================================================	
})();


//----------------------------------------用于全局的------------------------------------

//基于全局对象原型的继承
Object.prototype.toJSONStringTea=function(){
	var jsonstr=[];
	for (var i in this) {
		if ( this.hasOwnProperty(i) ) {
			jsonstr.push('\"'+i+'\":\"'+this[i]+'\"');
		}
		
	}
	var r=jsonstr.join(',\n');
	r="{"+r+"}";
	return r;
}

Array.prototype.toJSONStringTea=function(){
	var arr=[];
	for ( var i=0;i<this.length;i++) {
		arr[i]=( this[i]!=null )? this[i].toJSONStringTea():"null";
	}
	return '['+arr.join(",")+']';
}
Boolean.prototype.toJSONStringTea=function(){return this}
Function.prototype.toJSONStringTea=function(){return this}
Number.prototype.toJSONStringTea=function(){return this}
RegExp.prototype.toJSONStringTea=function(){return this}