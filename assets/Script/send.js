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
        this.socket = UserInfo.socket;
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
            if(jsonObject.username != UserInfo.username){
                //把对手的信息显示出来
                self.showBoxLabel.string += jsonObject.username + ":" + jsonObject.text + "\n";
            }
            
        });
        //当点击准备按钮的时候将准备状态重置为true
        this.ready.on('mousedown',self.readClicked);
       
    },
    readClicked : function(){
        var self = this;
        self.isReady = true;
        var dataString = '{"username":' + '"' + UserInfo.username + '",' + '"roomID":' + '"' + SwitchScene.roomID + '"' + '}';
        cc.log("in ready function dataString is " + dataString);
        //将准备好的状态发送给服务器
        self.socket.emit('ready',dataString);
        //进入游戏界面
        cc.director.loadScene('pvpGame');
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
});
