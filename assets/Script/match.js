/*
 * @Author: mikey.zhaopeng 
 * @Date: 2018-04-11 09:20:11 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2018-04-18 17:37:28
 */
cc.Class({
    extends: cc.Component,

    properties: {
        matchLabel : {
            default : null,
            type    : cc.Node,
        },
        countDown : {
            default :null,
            type    : cc.Node,
        },
        rival     : {
            default : null,
            type    : cc.Node,
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        var self = this;
        cc.log(this.rival.getComponent(cc.Label));
        //显示自己的信息
        this.rival.getComponent(cc.Label).string = UserInfo.username;
        //不显示正在匹配
        this.matchLabel.active = false;
        cc.log("connect status is " + UserInfo.socket.connected);
        cc.log("socket's id is " + UserInfo.socket.id);
        if(UserInfo.socket.connected === false){
            cc.log('--------------------------------')
            UserInfo.socket.io.open();
            UserInfo.socket = io.connect("ws://192.168.1.153:3000",{'force new connection': true,"autoConnect": true});
            cc.log("connect is " + UserInfo.socket.connected);
        }
        this.socket = UserInfo.socket;
        
        cc.log("in match socket is " + this.socket + "and status is " + this.socket.connected);
        this.countDown.active = false;    
        this.isPiPei = false;
        cc.log("***********************监听匹配事件*************************");
        cc.log("self.matchLabel is " + self.matchLabel);
        //监听匹配事件
        this.socket.on('pvp',function(msg){
            if(cc.sys.isNative){
                console.log("***************小米*****************");
                console.log("在安卓平台msg is " + msg);
                try{
                    var message = JSON.parse(msg);
                    if(message.msg === '匹配成功'){
                        SwitchScene.roomID = message.roomID;
                        SwitchScene.rivalInfo = [];
                        SwitchScene.rivalInfo.push(message.user1);
                        SwitchScene.rivalInfo.push(message.user2);
                        cc.director.loadScene("matchedRoom");
                    }
                }catch(e){

                }
            }else{
              
                if(msg.msg === '匹配成功'){
                    SwitchScene.roomID = msg.roomID;
                    SwitchScene.rivalInfo = [];
                    SwitchScene.rivalInfo.push(msg.user1);
                    SwitchScene.rivalInfo.push(msg.user2);
                    cc.director.loadScene("matchedRoom");
                }
            }
            // cc.log("adadfadfadfadfdddddd" + " " + this.node);
            // console.log("msg is " + msg);
            // //匹配成功
            // try{
            // var message = JSON.parse(msg);
            // cc.log("message is " + message);
            // self.matchLabel.getComponent(cc.Label).string = message.msg;
            
        });
    },

    start () {

    },
    match : function(){
        this.countDown.active = true;
        //匹配中
        this.matchLabel.active = true;
        if(this.timerStart === undefined || this.timerStart === false){
            this.timer();
            this.countDown.getComponent(cc.Label).string = this.time;
            var pvp = '{"username":' + '"' + UserInfo.username + '",' + '"tag":' + '"pvp",' +  '"score":' + '"0"' + '}';
            cc.log("dataString is " +pvp);
            this.socket.emit('pvp',pvp);
        }
    },
    //确认匹配对手
    confirmRival : function(rival){
        // this.isOk = true;
        // var pvp = '{"username":' + '"' + UserInfo.username + '",' + '"tag":' + '"pvp"' + '}';
        // this.socket.emit('pvp',pvp);
        // //进入房间
        // cc.director.loadScene('matchedRoom');
    },
    //生成一个计时器
    timer : function(){
        this.time = 30;
        this.timerStart = true;
        var self = this;
        this.schedule(function(){
            self.time -= 1;
            if(self.time < 0){
                self.matchLabel.getComponent(cc.Label).string = '匹配失败，时间已到';
                //取消计时器
                self.unscheduleAllCallbacks();
                self.countDown.active = false;
                self.timerStart = false;
                return;
            }
            cc.log("time is " + self.time);
            self.countDown.getComponent(cc.Label).string = self.time;
            var res = self.matchLabel.getComponent(cc.Label).string;
            //如果计时期间玩家取消了匹配的话将相应计时器和标记重置
            if(res === '取消匹配'){
                self.unscheduleAllCallbacks();
                this.timerStart = false;
            }
        },1);
       
    },
   
    //取消匹配
    cancelMatch : function(){
        //取消计时器
        this.unscheduleAllCallbacks();
        this.timerStart = false;
        //不再显示计时器
        this.countDown.active = false;
        this.matchLabel.getComponent(cc.Label).string = "取消匹配";
        var dataString = '{"username":' + '"' + UserInfo.username + '",' + '"tag":' + '"cancel"' + '}';
        this.socket.emit('cancel',dataString);
        this.socket.on('cancel',function(msg){
             console.log("in cancelMatch msg is " + msg);
        });
    },
    update (dt) {

    },
});
