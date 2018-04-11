/*
 * @Author: mikey.zhaopeng 
 * @Date: 2018-04-08 16:51:27 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2018-04-11 11:18:48
 */

var begin = require('begin');
var Global = require('Global');
const link = require('link');
cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.time = 0;
        //获得长连接的脚本对象的socket
        // this.socket = game.prototype.socket;
        // this.socket.on('conn',function(msg){
        //     //进入回调函数说明是连接成功的状态
        //     console.log("msg is " + msg);
        //     concosle.log("连接成功");
        // });
        this.init();
        var longLinkCom = link.prototype;
        this.socket = UserInfo.socket;
        cc.log("in gameButton socket is " + this.socket);
    },
    init(){
        this.begin = begin.prototype;
        //最好成绩
        this.bestScore = 0;
        cc.log("init gameButtons");
    },
    //主按钮
    mainButton : function(){
        cc.log("isStart is " + Global.isStart);
            if(Global.isStart && this.time < 10){
                //开始一个计时器
                if(!this.isOpen){
                    this.beginTimer();
                }
                UserInfo.score += 1;
                this.scoreText = this.node.parent.getChildByName('bestScore');
                this.scoreText.getComponent(cc.Label).string = UserInfo.score;
                cc.log("score is " + UserInfo.score);
                
                if(time === 9){
                    alert("十秒时间到");
                    var dataString = '{"username":' + '"' + UserInfo.username + '",' +'"score":' +'"' + UserInfo.score + '",' + '"tag":' + '"score"' + '}';
                    console.log(dataString);
                    this.socket.emit('sendData',dataString);
                }
                
            }else{
                // this.bestScore = this.score;
                //将最好成绩存储起来
                //将当前分数发给服务器
                // var sendData = '{"username:"' + '"' + Global.user.username  + '",' + "score:"+ '"' + this.score + '"}';
                // //向服务器发送广播
                // this.socket.emit('senddata',sendData);
                Global.isStart = false;
                //如果从缓存中取出来的数据是undefined的就将当前分数存进去
                if(cc.sys.localStorage.getItem("best") === undefined){
                    cc.sys.localStorage.setItem("best",UserInfo.score);
                }else{
                    this.bestScore = cc.sys.localStorage.getItem("best");
                }
                if(UserInfo.score > this.bestScore){
                    this.bestScore = UserInfo.score;
                    cc.sys.localStorage.setItem("best", this.bestScore);
                }
                //取消所有计时器
                this.endjishiqi();
                this.isOpen = false;
                // this.scoreText.getComponent(cc.Label).string = " " + this.score + "十秒时间到" 
            }
    },
    start () {

    },
    beginTimer : function(){
        this.isOpen = true;
        //开始一个计时器
        this.schedule(function(){
            this.time += 1;
        },1);
    },
    endjishiqi : function(){
        this.unscheduleAllCallbacks();
    },
    update (dt) {
    },
});
