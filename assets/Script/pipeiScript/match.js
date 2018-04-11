/*
 * @Author: mikey.zhaopeng 
 * @Date: 2018-04-11 09:20:11 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2018-04-11 17:52:02
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
    },

    start () {

    },
    match : function(){
        this.countDown.active = true;
        //匹配中
        this.matchLabel.active = true;
        this.matchLabel.getComponent(cc.Label).string = "匹配中,请稍后..."
        if(this.timerStart === undefined || this.timerStart === false){
            this.timer();
            this.countDown.getComponent(cc.Label).string = this.time;
            var pvp = '{"username":' + '"' + UserInfo.username + '",' + '"tag":' + '"pvp"' + '}';
            cc.log("dataString is " +pvp);
            this.socket.emit('pvp',pvp);
            // var self = this;
            // //监听
            // this.socket.on('pvp',function(msg){
            //     //匹配成功
            //     self.matchLabel.getComponent(cc.Label).string = msg;
            //     var info = self.matchLabel.getComponent(cc.Label).string;
            //     //如果匹配成功的话就等待玩家确认是否跟该玩家匹配
            //     if(info === '匹配成功'){
            //         //将对手信息显示出来
            //         self.rival.children[0].getComponent(cc.Label).string = "用户信息"
            //         //再次确认是否要与对手匹配
            //         if(self.isOk === undefined){
            //             //等待玩家进行确认匹配
                        
            //         }else if(self.isOk){
            //             //向服务器发送确认匹配请求
            //             var pvp = '{"username":' + '"' + UserInfo.username + '",' + '"tag":' + '"pvp",' + '"code":' + '"1"' + '}';
            //             self.socket.emit('pvp',pvp);
            //             //进入房间
            //             cc.director.loadScene('matchedRoom');
            //         }
            //     }
            // });
        }
        
    },
    //确认匹配对手
    confirmRival : function(rival){
        this.isOk = true;
        var pvp = '{"username":' + '"' + UserInfo.username + '",' + '"tag":' + '"pvp"' + '}';
        this.socket.emit('pvp',pvp);
        //进入房间
        cc.director.loadScene('matchedRoom');
    },
    //生成一个计时器
    timer : function(){
        this.time = 30;
        this.timerStart = true;
        var self = this;
        this.schedule(function(){
            self.time -= 1;
            if(self.time < 0){
                self.matchLabel.getComponent(cc.Label).string = '匹配失败，时间已到'
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
        var dataString = '{"username":' + '"' + UserInfo.username + '",' + '"tag":' + '""' + '}';
        this.socket.emit('cancelmatch',dataString);
    },
    update (dt) {
        var self = this;
        
        // this.countDown.getComponent(cc.Label).string = this.time;
        this.socket.on('pvp',function(msg){
            console.log("msg is " + msg);
            //匹配成功
            var message = JSON.parse(msg);
            self.matchLabel.getComponent(cc.Label).string = message.msg;
            var info = self.matchLabel.getComponent(cc.Label).string;
            //如果匹配成功的话就等待玩家确认是否跟该玩家匹配
            if(info === '匹配成功'){
               
                self.countDown.active = false;
                self.timerStart = false;
                //将对手信息显示出来
                self.rival.children[0].getComponent(cc.Label).string = message.roomID;
                self.schedule(function(){
                   
                },2);
                //取消所有的计时器
                self.unscheduleAllCallbacks();
                //进入房间
                cc.director.loadScene('matchedRoom');
            }  
            self.socket.on('join',function(msg){
                console.log("in join event msg is " + msg);
                var message = JSON.parse(msg);
                console.log(message.username);
            });
        });
    },
});
