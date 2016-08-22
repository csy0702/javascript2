//ie浏览器特有的

UserData={
	storageObject:null,//用来存储所有的键值对的对象，判断存不存在，不存在则初始化
	init:function(){  //初始化方法，因为存或取的时候一定要指定节点，要有行为
		if(!this.storageObject){
			this.storageObject=document.createElement("div");
			this.storageObject.addBehavior("#default#userData");//给节点指定行为
			this.storageObject.style.display="none";
			document.body.appendChild(this.storageObject);
		}
	},
	set:function(key,value){
		if(!this.storageObject){
			this.init();
		}
		this.storageObject.setAttribute( key,value);//对象中有数据
		this.storageObject.save("a");//将对象中的数据序列化到磁盘上，save（）中的参数a就是文件名
		return value;
	},
	get:function( key){
		if(!this.storageObject){
			this.init();
		}
		this.storageObject.load("a");//从磁盘上读取a这个文件，将a中的数据反序列化到节点div的userData中
		return this.storageObject.getAttribute(key);
	},
	del:function(key){
		if(!this.storageObject){
			this.init();
		}
		this.storageObject.removeAttribute(key);
		this.storageObject.save("a");//删除完div中的userData中的数据库，再覆盖a文件中的数据
	},
	isAvailable:function(){
		return ('\v'=='v');  //判断是否为ie浏览器  '\v'得到v
							//在其他的浏览器中，'\v'当成转义字符看，表示垂直制表符
	}
}
