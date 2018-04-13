cc.Class({
    extends: cc.Component,

    properties: {
        rival : {
            default : null,
            type    : cc.Node
        },
        infoLabel : {
            default : null,
            type    : cc.Node,
        },
        //准备按钮
        ready : {
            default : null,
            type    : cc.Node,            
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.messageCount = 0;
        this.socket = UserInfo.socket;
        cc.log("in load socke is " + this.socket);
        this.isReady = false;
        this.showBoxLabel = cc.find("Canvas/show/view/content/item").getComponent(cc.Label);
        cc.log("showBoxLabel is " + this.showBoxLabel);
        cc.log("infoLabel is " + this.infoLabel);
        cc.log("this is " + this);
        cc.log("infoLabel is " + this.infoLabel.getComponent(cc.EditBox).string);
        cc.log("users is " + SwitchScene.rivalInfo);
        for(let i = 0;i < SwitchScene.rivalInfo.length; i++){
            if(UserInfo.username === SwitchScene.rivalInfo[i].username){
                this.rivalInfo = SwitchScene.rivalInfo[i];
                this.rival.getComponent(cc.Label).string = this.rivalInfo.username;
            }
        }
        var self = this;
        this.socket.on('sendmessage',function(msg){
            console.log("in getMessage function msg is " + msg);
            var stringjson =JSON.stringify(msg);
            var jsonObject = JSON.parse(stringjson);
            cc.log("stringjson is " + stringjson);
            //如果不是自己的名字的时候就显示相关信息
            if((jsonObject.username != UserInfo.username)){
                //把对手的信息显示出来
                self.showBoxLabel.string += jsonObject.username + ":" + jsonObject.text + "\n";
            }
            
        });
        //当点击准备按钮的时候将准备状态重置为true
        this.ready.on('mousedown',self.readClicked);
        //监听准备事件
        this.socket.on('ready',function(msg){
            cc.log("msg is " + msg);
            //将字符串转换为json对象
            var jsonMessage = JSON.parse(msg);
            if(jsonMessage.user === UserInfo.username){
                self.myselfMessage = jsonMessage.msg;
            }
            if(jsonMessage.user != UserInfo.username){
                self.otherUser = jsonMessage.user;
            }
            cc.log("jsonMessage is " + jsonMessage);
            if(jsonMessage != null){
                //如果对手已经准备好了一起进入游戏
                if((self.otherUser != UserInfo.username)){
                    //同时自己也准备好了
                    if(self.myselfMessage === '用户以准备'){
                         //如果另外一个对手也已经准备好了就一起进入场景
                        cc.director.loadScene("pvpGame");
                    }
                }
            }
            
        })
    },
    //拼接字符串方法
    concatString : function(stringArr){
        var concatStr = '{';
        for(let i = 0;i < stringArr.length;i++){
            if(i === stringArr.length - 1){
                concatStr += '"' + stringArr[i] + '":' + '"' + stringArr[i] + '"' + '}';
            }
            concatStr += '"' + stringArr[i] + '":' + '"' + stringArr[i] + '",';
        }
    },
    start () {

    },
    sendMessage : function(){
       //获得输入信息
        this.info = this.infoLabel.getComponent(cc.EditBox).string;
        var dataString = '{"username":' + '"' + UserInfo.username + '",' + '"message":' + '"' + this.info + '",' + '"roomID":' + '"' + SwitchScene.roomID + '"' + '}';
        cc.log(dataString);
        this.socket.emit('sendmessage',dataString);
        //先把自己的信息显示
        this.showBoxLabel.string += UserInfo.username + ":" + this.info + "\n";
        cc.log("showbox is " + this.showBoxLabel);
        cc.log("this is " + this);
    },
    
    update (dt) {
        
    },
    readClicked : function(){
        this.isReady = true;
        cc.log(UserInfo.socket);
        var dataString = '{"username":' + '"' + UserInfo.username + '",' + '"roomID":' + '"' + SwitchScene.roomID + '"' + '}';
        cc.log("in ready function dataString is " + dataString);
        cc.log("in readClicked socket is " + this.socket);
        //将准备好的状态发送给服务器
        UserInfo.socket.emit('ready',dataString);
        // //进入游戏界面
        // cc.director.loadScene('pvpGame');
    },
});
