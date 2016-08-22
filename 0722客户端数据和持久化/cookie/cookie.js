cookies={
	set:function( key,value,minsToExpire){//minsToExpire过期时间(天为单位)
		var expires="";
		if( minsToExpire){
			var data=new Date();//客户端时间
			data.setTime(  data.getTime()+( minsToExpire*60*1000) );
			expires="expires="+data.toGMTString();//expirez=Sat,14 Mar 2009  17:45:33  GMT
		}
		//cookie 存的时候，键何值都要编码
		/*
		 key: "a  b"=>encodeURIComponent=>  "a%20b"		
		 /:表示当前网站下的所有页面
		*/
		
		document.cookie=encodeURIComponent( key)+"="+encodeURIComponent( value)+";"+expires+";path=/";
		return value;
	},
	get:function(key){
		//var nameCompare=key+"=";
		var cookieArr=document.cookie.split(";");//name=a%20b;expires=xxx;path=/
		for( var i=0;i<cookieArr.length;i++){
			var a=cookieArr[i].split("=");//a=>{"name","a%20"}
			var currentKey=decodeURIComponent(a[0]);
			if( key==currentKey  || " "+currentKey){
				return decodeURIComponent( a[1]);//取值，decodeURIComponent解码
			}
		}
		return null;
	},
	//判断浏览器是否禁用了cookie
	isAvailable:function(){
		return (this.set('cookieTest','1')==this.get('cookieTest'));
	},
	//如果要删除cookie，只需要将expire设置为一个当前时间之前的过去时间即可
	del:function(){
		this.set( key,"",-1);
	}
}
