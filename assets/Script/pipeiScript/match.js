/*
 * @Author: mikey.zhaopeng 
 * @Date: 2018-04-11 09:20:11 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2018-04-13 15:16:02
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
        //不显示正在匹配
        this.matchLabel.active = false;
        this.socket = UserInfo.socket;
        cc.log("in match socket is " + this.socket);
        this.countDown.active = false;    
        this.isPiPei = false;
    },

    start () {

    },
    match : function(){
        this.countDown.active = true;
        //匹配中
        this.matchLabel.active = true;
        this.matchLabel.getComponent(cc.Label).string = "匹配中,请稍后...";
        if(this.timerStart === undefined || this.timerStart === false){
            this.timer();
            this.countDown.getComponent(cc.Label).string = this.time;
            var pvp = '{"username":' + '"' + UserInfo.username + '",' + '"tag":' + '"pvp",' +  '"score":' + '"0"' + '}';
            cc.log("dataString is " +pvp);
            this.socket.emit('pvp',pvp);
            var self = this;
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
    listenPVP : function(){
        if(this.isPiPei){
            //如果已经匹配了退出
            return;
        }else{
            var self = this;
            var re = self.matchLabel.getComponent(cc.Label).string
            if(re != '匹配成功'){
                    //监听服务器发来的数据
                this.socket.on('pvp',function(msg){
                    console.log("msg is " + msg);
                    //匹配成功
                    try{
                        var message = JSON.parse(msg);
                        SwitchScene.roomID = message.roomID;
                        SwitchScene.rivalInfo = [];
                        SwitchScene.rivalInfo.push(message.user1);
                        SwitchScene.rivalInfo.push(message.user2);
                        self.matchLabel.getComponent(cc.Label).string = message.msg;
                    }catch(e){
                        self.matchLabel.getComponent(cc.Label).string = msg;
                    }
                    
                });
                
            }else{
                this.isPiPei = true;
                self.schedule(function(){
                        
                },2);
                //取消所有的计时器
                self.unscheduleAllCallbacks();
                //进入房间
                cc.director.loadScene('matchedRoom');
                return;
            }
        }
        
            
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
        this.listenPVP();
    },
});
