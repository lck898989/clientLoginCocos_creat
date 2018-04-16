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
        // //滚动条
        // scroll : {
        //     default : null,
        //     type    : cc.Scrollbar,
        // }
        showBox : {
            default : null,
            type    : cc.Node,
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.messageCount = 0;
        //自己是否已经准备
        this.isReady = false;
        //别人是否已经准备
        this.otherIsReady = false;
        this.socket = UserInfo.socket;
        cc.log("in load socke is " + this.socket);
        this.isReady = false;
        var self = this;
        //准备好的玩家个数（除了自己）
        this.readyCount = 0;
        this.showBoxLabel = this.showBox.getChildByName("view").getChildByName("content").getChildByName("item").getComponent(cc.Label);
        cc.log("showBox is " + this.showBoxLabel);
        this.showBoxLabel.fontSize = 35;
        cc.log("showBoxLabel is " + this.showBoxLabel);
        cc.log("infoLabel is " + this.infoLabel);
        cc.log("this is " + this);
        cc.log("infoLabel is " + this.infoLabel.getComponent(cc.EditBox).string);
        cc.log("users is " + SwitchScene.rivalInfo);
        this.userFromRoom = [];
        if(SwitchScene.rivalInfo != null){
            for(let i = 0;i < SwitchScene.rivalInfo.length; i++){
                if(UserInfo.username === SwitchScene.rivalInfo[i].username){
                    this.rivalInfo = SwitchScene.rivalInfo[i];
                    this.rival.getComponent(cc.Label).string = this.rivalInfo.username;
                }else{
                    //将这个房间的其他用户全部push到一个数组中去
                    this.userFromRoom.push(SwitchScene.rivalInfo[i]);
                }
            }
        }
        cc.log("this.node's name is " + this.node.name);
        this.socket.on('sendmessage',function(msg){
                console.log("in getMessage function msg is " + msg);
                var stringjson =JSON.stringify(msg);
                var jsonObject = JSON.parse(stringjson);
                cc.log("stringjson is " + stringjson);
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
        //监听准备事件
        this.socket.on('ready',function(msg){
            //如果当前节点是ready节点的话进行准备，不是ready节点上一边去
            if(self.node.name === 'ready'){
                cc.log("msg is " + msg);
                //将字符串转换为json对象
                var jsonMessage = JSON.parse(msg);
                cc.log("jsonMessage is " + jsonMessage);
                if(jsonMessage != null){
                    //遍历房间的其他人
                    cc.log("self.userFromRoom.length is " + self.userFromRoom.length);
                    for(let i = 0;i < self.userFromRoom.length;i++){
                        cc.log("in room's user is " + self.userFromRoom[i].username);
                         if((jsonMessage.user === self.userFromRoom[i].username)){
                             self.readyCount++;
                         }
                    }
                    cc.log(self.readyCount);
                    if(self.readyCount === self.userFromRoom.length){
                       //说明其他人已经准备好了
                       self.otherIsReady = true;
                    }
                }
                //如果对手已经准备好了一起进入游戏
                if(self.otherIsReady && self.isReady){
                    //如果另外一个对手也已经准备好了就一起进入场景
                    cc.director.loadScene("pvpGame");
                }
            }
           
        });
        //监听用户离开房间事件
        this.socket.on('leave',function(msg){
            cc.log("msg is " + msg);
            if(msg.username != UserInfo.username){
                if(self.showBoxLabel != null){
                    //如果不等于当前的用户的话进行提醒是否另一个人要退出房间
                    self.showBoxLabel.string += msg.username + "离开了房间！！！" + '\n\n'; 
                }
               
            }           
        });
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
        //如果是node节点就发送信息
            this.socket.emit('sendmessage',dataString);
            // this.showBoxLabel.horizontalAlign = cc.Label.HorizontalAlign.RIGHT;
            //先把自己的信息显示
            this.showBoxLabel.string += UserInfo.username + ":" + this.info + "\n\n";
            cc.log("showbox is " + this.showBoxLabel);
            cc.log("this is " + this);
        
    },
    readClicked : function(){
           cc.log("in readClicked function node's name is " + this.node.name);
        //如果当前节点是ready节点的话进行相关信息的发送
            this.isReady = true;
            cc.log(UserInfo.socket);
            var dataString = '{"username":' + '"' + UserInfo.username + '",' + '"roomID":' + '"' + SwitchScene.roomID + '"' + '}';
            cc.log("in ready function dataString is " + dataString);
            cc.log("in readClicked socket is " + this.socket);
            if(this.node.name === 'ready'){
                 //将准备好的状态发送给服务器
                UserInfo.socket.emit('ready',dataString);
            }
    },
    logOut : function(){
        var dataString = '{"username":' + '"' + UserInfo.username + '",' + '"roomID":' + '"' + SwitchScene.roomID + '"' + '}';
        this.socket.emit('leave',dataString);
        //如果是自己登出房间的话切换场景
        cc.director.loadScene('inTheMatch');
        this.showBoxLabel.string = '';
        this.socket.on('disconnect');
    },
    update (dt) {
        
    },
    
});
