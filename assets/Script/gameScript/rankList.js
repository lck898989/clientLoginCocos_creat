/*
 * @Author: mikey.zhaopeng 
 * @Date: 2018-04-11 08:52:22 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2018-04-17 14:32:19
 */
const mainButton = require('gameButton');
cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
        rankBang : {
            default : null,
            type    : cc.Node,
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        cc.log("score is " + this.score);
        cc.log("in rankList Global's username is " + UserInfo.username);
    },
    init(){
        cc.log("init randList");
        this.count = 0;
    },
    //排名
    randListEvent : function(){
            cc.log("this.score is " + UserInfo.score);
            cc.log("username is " + UserInfo.username);
            var dataString = '{"username":' + '"' + UserInfo.username + '",' +'"score":' +'"' + UserInfo.score + '",' + '"tag":' + '"rank"' + '}';
            console.log(dataString);
            this.socket.emit('sendData',dataString);
            var self = this;
            this.socket.on('sendData',function(msg){
                console.log("msg is " + msg);
                self.RandMsg = msg;
                var msg = JSON.parse(msg);
                cc.log("type is " + typeof msg);
                var length = msg.length;
                cc.log("数组的长度为：" +length);
                self.showRankList(msg,self);
            });
            this.rankBang.active = true;
    },
    //显示排名
    showRankList : function(msg,who){
        cc.log("in showRankList msg is " + msg);
        if(msg instanceof Array){
            //取得数组的长度
            var length = msg.length;
            cc.log("数组的长度为：" +length);
            for(let i = 0;i < length;i++){
                //填写有户名
                who.rankBang.getChildByName('username'+i).getComponent(cc.Label).string = msg[i].username;
                //填写分数
                who.rankBang.getChildByName('score'+i).getComponent(cc.Label).string = msg[i].score;
            }
        }

    },
    start () {

    },

    update (dt) {
        
    },
});
