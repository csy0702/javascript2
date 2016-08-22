function ShowQuestions(questions){
			this.que=questions;
		}
		var timer;
		ShowQuestions.prototype={
			showque:function(){
				var ques=yc.$("questions");
				//插入剩余时间的div
				var timebox=document.createElement("div");
				timebox.innerHTML="剩余时间(单位 s)：";
				var time=document.createElement("span");
				timebox.appendChild(time);
				var settime=new Date().getTime()+20000;
				timer=setInterval(function(){//给剩余时间设定一个定时器，保证实时更新
					var innertime=parseInt((settime-new Date().getTime())/1000);
					if(innertime==0){
						clearInterval(timer);
						submit( timer );
					}
					time.innerHTML=innertime;
				},50);
				document.body.insertBefore(timebox,ques);


				//插入所有的题目
				for(var i=0;i<this.getTolal();i++){
					var num=document.createElement("span");
					num.id="q"+i;
					num.innerHTML=this.que[i][0]+"、";
					ques.appendChild(num);
					var question=document.createElement("span");
					question.innerHTML=this.que[i][1];
					ques.appendChild(question);
					var options=document.createElement("p");//当前题目的选项
					for(var j=0;j<4;j++){
						var inp=document.createElement("input");
						inp.type="radio";
						inp.name="ans"+i;
						inp.value=j+1;

						var ans=document.createElement("span");
						ans.innerHTML="&#"+(65+j)+";、"+this.que[i][2+j];
	
						options.appendChild(inp);
						options.appendChild(ans);
					}
					ques.appendChild(options);
					ques.appendChild(document.createElement("hr"));
				}

				var btn=document.createElement("input");
				btn.type="button";
				btn.value="提交试卷";
				btn.onclick=submit;
				ques.appendChild(btn);
			},
			getTolal:function(){
				return this.que.length;
			}
		}

		function submit(){
			//取消计时器
			clearInterval(timer);

			//取消页面中所有input元素的操作
			var allinput=document.getElementsByTagName("INPUT");
			for( var i=0;i<allinput.length;i++){
				allinput[i].disabled=true;
			}

			var ans=[];
			for(var i=0;i<allque.que.length;i++){
				var num="ans"+i;
				var answer=document.getElementsByName(num);
				var flag=true;
				for(var j=0;j<answer.length;j++){
					if(answer[j].checked){
						ans.push(answer[j].value);
						flag=false; //表明用户选择了答案
					}
				}
				//当前这一题用户没有选择答案，则将 ars数组中对应的位置设置为0
				if(flag){
					ans.push("0");
				}
			}
			
		var score=0;
		for(var i=0;i<allque.que.length;i++){
			if(ans[i]==allque.que[i][6]){
					score+=10;
			}
		}
		//console.log(score);
		var newpage="submit.html#"+(allque.que.length*10)+"_"+score;
		window.open(newpage,"new window","width=300,height=300");
		close();
	
		
	}
	//往数据库中插入数据
		var sqlhelper=new SqlHelper("Questions",2);
		//创建表
		var queFields={"num":"int not null primary key","que":"text","opt1":"text","opt2":"text","opt3":"text","opt4":"text","ans":"int"};
		sqlhelper.createTable("question",queFields);
		//在splite中一次插入多条数据的语法：insert into tablename(fields) values(  value1,value2,....)
		sql1="insert into question(num ,que, opt1,opt2,opt3,opt4,ans) values( 1,'中国的首都？','北京','长沙','上海','重庆',1)";
		sql2="insert into question(num ,que, opt1,opt2,opt3,opt4,ans) values( 2,'湖南的省会？','北京','长沙','上海','重庆',2)";
		sqlhelper.exesql(sql1);
		sqlhelper.exesql(sql2);	
		
	var ansarr=new Array(2);//存用户选的答案
	for(var i=0;i<ansarr.length;i++){
		ansarr[i]=0;
	}
	//创建一个表用来存放选择的每项答案
	var ansFields={"num":"int not null primary key","answer":"text"};
	 sqlhelper.createTable("answer",ansFields);
	//1,   0
	sqlhelper.exesql("insert into answer (num,answer) values( 1,'"+ansarr.join()+"')")
	var que=[
			[1,"中国的首都？","北京","长沙","上海","重庆","1"],
			[2,"湖南的省会？","岳阳","长沙","衡阳","株洲","2"],
			[3,"湖南位于中国的？","北部","西部","南部","东部","3"],
			[4,"下列哪个是沿海城市？","北京","浙江","厦门","成都","3"],
			[5,"下列哪个是沿海城市？","北京","浙江","厦门","成都","3"],
			
		];
	var allque=new ShowQuestions(que);		
	allque.showque();	
		