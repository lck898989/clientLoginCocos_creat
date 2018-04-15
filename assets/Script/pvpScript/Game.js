cc.Class({
    extends: cc.Component,

    properties: {
        //对手的分数
        rivalScore : {
            default : null,
            type    : cc.Node,
        },
        //我自己的分数
        myScore : {
            default : null,
            type    : cc.Node,
        },
        //显示时间的节点
        timec : {
            default : null,
            type    : cc.Node,
        }

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        var self = this;
        this.socket = UserInfo.socket;
        this.socket.emit('time')
        this.time = 10;
        //分数初始化为零
        this.score = 0;
        if(UserInfo.username != null){
            //获得自己的信息
            cc.find("Canvas/myself").getComponent(cc.Label).string = UserInfo.username;
        }
        //如果对手信息为空的话
        if(SwitchScene.rivalInfo != null){
            for(let i = 0; i< SwitchScene.rivalInfo.length;i++){
                //如果当前用户名等于切换场景时候保存的用户信息的话,显示对手信息
                 if(UserInfo.username != SwitchScene.rivalInfo[i].username){
                     //将对手信息显示出来
                    cc.find("Canvas/rival").getComponent(cc.Label).string = SwitchScene.rivalInfo[i].username;
                 }
            }
        }
        //开始按钮监听事件开始
        // this.begin.on('mousedown',function(){
        //     if(UserInfo.username != null){
        //         var dataString = '{"username":' + '"' + UserInfo.username + '",' + '"roomID":' + '"' + SwitchScene.roomID + '"' + '}';
        //         self.socket.emit('time',dataString);
        //          //启动倒计时
        //         self.countDown();
        //     }
        // });
        var dataString = '{"username":' + '"' + UserInfo.username + '",' + '"roomID":' + '"' + SwitchScene.roomID + '",' + '"score":' + '"0"' + '}';
        this.socket.emit('time',dataString);
        //开启倒计时
        this.countDown();
        //点击按钮的时候出发的监听事件
        this.node.on('mousedown',function(){
            //加分
            self.score += 1;
            //将自己的分数显示出来
            self.myScore.getComponent(cc.Label).string = self.score;
            if(UserInfo.username != null){
                //将数据发送到服务器
                var dataString = '{"username":' + '"' +UserInfo.username + '",' + '"roomID":' + '"' + SwitchScene.roomID + '",' + '"score":' + '"' + self.score + '"' + '}';
                self.socket.emit('addscore',dataString);
            }
        });
        //监听服务器给发送的消息(对手的分数)
        this.socket.on('addscore',function(msg){
            cc.log("in socket function's msg is " + msg);
            var jsonMessage = JSON.parse(msg);
            if(jsonMessage.username != UserInfo.username){
                 //把分数提取出来显示
                var scoreMessage = jsonMessage.score;
                self.rivalScore.getComponent(cc.Label).string = scoreMessage;
            }
           
            //判断服务器给发送的消息
        });
        // var stringarr = [];
        // stringarr.push('username,lck');
        // stringarr.push('password,adasd');
        // cc.log(this.concatString(stringarr));
        //将一个json对象转换为一个json字符串
        // var jsonString = JSON.stringify({"username":"asdf","asdf":"adsad"});
        // cc.log(jsonString);
        self.socket.on('time',function(msg){
            //服务端发送谁赢了的信息（名字，分数）
            cc.log("msg is " + msg);
            var jsonMsg = JSON.parse(msg);
            //对手的输赢状态
            var win = jsonMsg.win;
            cc.log("win is " + win);
            var shibai = jsonMsg.shibai;
            cc.log("shibai is  " + shibai);
        });

    },
    // concatString : function(stringArr){
    //     var concatStr = '{';
    //     for(let i = 0;i < stringArr.length;i++){
    //         var
    //     }
        
    //     return concatStr;
    // },
    start () {

    },
    
    //倒计时
    countDown : function(){
        var self = this;
        //计时器开始
        this.schedule(function(){
             self.time -= 1;
             //如果时间等于零的时候向服务器发送时间到信息
             if(self.time === 0){
                 var endString = 'game over'
                 //发送游戏结束广播
                 self.socket.emit('end',endString);
             }
        },1);
    },
    update (dt) {
        //显示时间
        this.timec.getComponent(cc.Label).string = this.time;
        //监听时间，如果时间等于零的话就停止所有计时器
        if(this.time < 1){
            //关闭所有的计时器
            this.unscheduleAllCallbacks();
            //将结果信息显示出来
            this.timec.getComponent(cc.Label).string = this.resultName;
        }
    },
});
