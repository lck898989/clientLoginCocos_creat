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
        },
        //输入框对象
        infoLabel  : {
            default : null,
            type    : cc.Node,
        },
        //聊天信息框
        showBox : {
            default : null,
            type    : cc.Node,
        },
        //退出房间按钮
        backRoom  : {
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
        this.showBoxLabel = this.showBox.getChildByName("view").getChildByName("content").getChildByName("item").getComponent(cc.Label);
        this.showBoxLabel.fontSize = 35;
        //分数初始化为零
        this.score = 0;
        //重新连接
        this.socket.on("reconnect",function(msg){
            cc.log("in reconnect msg is " + msg);
        });
        //断开连接监听
        this.socket.on("disconnect",function(msg){
            cc.log("in disconnect function msg is " + msg);
        })
        self.myScore.getComponent(cc.Label).string = '0';
        self.rivalScore.getComponent(cc.Label).string = '0';
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
        var dataString = '{"username":' + '"' + UserInfo.username + '",' + '"roomID":' + '"' + SwitchScene.roomID + '",' + '"score":' + '"0"' + '}';
        this.socket.emit('time',dataString);
        //开启倒计时
        this.countDown();
        //如果是手机端的话是触摸事件
        if(cc.sys.os === cc.sys.OS_ANDROID){
            this.node.on('touchstart',function(){
                if(self.time >= 1){
                    //加分
                    self.score += 1;
                    //将自己的分数显示出来
                    self.myScore.getComponent(cc.Label).string = self.score;
                    if(UserInfo.username != null){
                        //将数据发送到服务器
                        var dataString = '{"username":' + '"' +UserInfo.username + '",' + '"roomID":' + '"' + SwitchScene.roomID + '",' + '"score":' + '"' + self.score + '"' + '}';
                        cc.log("dataString is "+dataString);
                        self.socket.emit('addscore',dataString);
                    }
                }
            }.bind(this));
        }else{
            //点击按钮的时候出发的监听事件
            this.node.on('mousedown',function(){
                if(self.time >= 1){
                    //加分
                    self.score += 1;
                    //将自己的分数显示出来
                    self.myScore.getComponent(cc.Label).string = self.score;
                    if(UserInfo.username != null){
                        //将数据发送到服务器
                        var dataString = '{"username":' + '"' +UserInfo.username + '",' + '"roomID":' + '"' + SwitchScene.roomID + '",' + '"score":' + '"' + self.score + '"' + '}';
                        cc.log("dataString is "+dataString);
                        self.socket.emit('addscore',dataString);
                    }
                }
            });
        }
        
        //监听服务器给发送的消息(对手的分数)
        this.socket.on('addscore',function(msg){
            cc.log("in addscore msg is " + msg);
            var jsonMessage;
            if(cc.sys.isNative){
                jsonMessage = JSON.parse(msg);
            }else{
                jsonMessage = msg;
            }
            if(jsonMessage.username != UserInfo.username){
                 //把分数提取出来显示
                var scoreMessage = jsonMessage.score;
                self.rivalScore.getComponent(cc.Label).string = scoreMessage;
            }
           
            //判断服务器给发送的消息
        });
        this.socket.on('sendresponse',function(msg){
            if(cc.sys.isNative){
                //获得jsonmessage
                var jsonObject = JSON.parse(msg);
            }else{
                jsonObject = msg;
            }
            console.log("in getMessage function msg is " + msg);
            console.log("stringjson is " + jsonObject);
            //如果是send节点就显示不是node节点就不显示
            //如果不是自己的名字的时候就显示相关信息
            if((jsonObject.username != UserInfo.username)){
                // self.showBoxLabel.horizontalAlign = cc.Label.HorizontalAlign.LEFT;
                if(self.showBoxLabel != null){     
                    //把对手的信息显示出来
                    self.showBoxLabel.string += jsonObject.username + ":" + jsonObject.text + "\n\n";
                }
            }
        });
        this.socket.on('leave',function(msg){
            if(cc.sys.isNative){
                var message = JSON.parse(msg);
            }else{
                message = msg;
            }
            if(message.username != UserInfo.username){
                if(self.showBoxLabel != null){
                    //如果不等于当前的用户的话进行提醒是否另一个人要退出房间
                    self.showBoxLabel.string += message.username + "离开了房间！！！" + '\n\n'; 
                   
                }
               
            }           
        })
        self.socket.on('time',function(msg){
            cc.log("in time function MSG is " + msg);
            var jsonMsg;
            if(cc.sys.isNative){
                jsonMsg = JSON.parse(msg);
            }else{
                jsonMsg = msg;
            }
            //服务端发送谁赢了的信息（名字，分数）
            cc.log("jsonMsg is " + jsonMsg);
            //对手的输赢状态
            var win = jsonMsg.win;
            cc.log("win is " + win);
        });

    },
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
    //聊天功能
    sendMessage : function(){
        cc.log("this node is " + this.node.name);
        //获得输入信息
        this.info = this.infoLabel.getComponent(cc.EditBox).string;
        var dataString = '{"username":' + '"' + UserInfo.username + '",' + '"message":' + '"' + this.info + '",' + '"roomID":' + '"' + SwitchScene.roomID + '"' + '}';
        cc.log(dataString);
        //如果是node节点就发送信息
        this.socket.emit('sendmessage',dataString);
        // this.showBoxLabel.horizontalAlign = cc.Label.HorizontalAlign.RIGHT;
        //先把自己的信息显示
        this.showBoxLabel.string += UserInfo.username + ":" + this.info + "\n\n";
        cc.log("showbox is " + this.showBoxLabel);
        cc.log("this is " + this);
    },
    //返回房间
    returnRoom : function(){
        var dataString = '{"username":' + '"' + UserInfo.username + '",' + '"roomID":' + '"' + SwitchScene.roomID + '"' + '}';
        this.socket.emit('leave',dataString);
        this.socket = null;
        cc.director.loadScene("ptype");
    },
    update (dt) {
        //显示时间
        this.timec.getComponent(cc.Label).string = this.time;
        //监听时间，如果时间等于零的话就停止所有计时器
        if(this.time < 1){
            //关闭所有的计时器
            this.unscheduleAllCallbacks();
            //禁用点击按钮
            this.node.getComponent(cc.Button).interactable = false;
        }
    },
});
