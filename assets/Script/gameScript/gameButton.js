/*
 * @Author: mikey.zhaopeng 
 * @Date: 2018-04-08 16:51:27 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2018-04-10 11:07:39
 */

var begin = require('begin');
var Global = require('Global');
const longLink = require('LongLink');
cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.time = 0;
        //获得长连接的脚本对象的socket
        this.socket = longLink.prototype.socket;
        cc.log("in gameButton's socket is " + this.socket);
    },
    init(){
        this.begin = begin.prototype;
        //得分
        this.score = 0;
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
                this.score += 1;
                this.scoreText = this.node.parent.getChildByName('bestScore');
                this.scoreText.getComponent(cc.Label).string = this.score;
            }else{
                alert("十秒时间到");
                // this.bestScore = this.score;
                //将最好成绩存储起来
                //将当前分数发给服务器
                var sendData = '{"username:"' + '"' + Global.user.username  + '",' + "score:"+ '"' + this.score + '"}';
                this.socket.emit('senddata',sendData);
                Global.isStart = false;
                if(cc.sys.localStorage.getItem("best") === undefined){
                    cc.sys.localStorage.setItem("best",this.score);
                }else{
                    this.bestScore = cc.sys.localStorage.getItem("best");
                }
                if(this.score > this.bestScore){
                    this.bestScore = this.score;
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
        // if(Global.isStart){
        //     this.beginTime();
        //     if(this.time >10){
        //         Global.isStart = false;
        //     }
        // } 
        if(this.time < 10){
            cc.log("this.time is " + this.time);
        }
    },
});
