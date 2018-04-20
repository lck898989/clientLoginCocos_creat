/*
 * @Author: mikey.zhaopeng 
 * @Date: 2018-04-11 09:03:25 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2018-04-20 17:33:42
 */
cc.Class({
    extends: cc.Component,

    properties: {
        netTip : {
            default : null,
            type    : cc.Node,
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.netTip.active = false;
        this.socket = UserInfo.socket;
        this.socket.on('reconnect',function(msg){
            this.netTip.color = cc.Color.GREEN;
            console.log("重新连接的次数 is " + msg);
            this.netTip.getComponent(cc.Label).string = '你已经重新连接网络!!!';
            this.scheduleOnce(function(){
                this.netTip.active = false;
            },2);
        }.bind(this));
        //如果socket为null的话重新创建一个socket
        if(UserInfo.socket === null){
            UserInfo.socket = window.io.connect(serverHost.host,{'force new connection': true});
            UserInfo.socket.on('conn',function(msg){
                cc.log("msg is " + msg);
            });
        }
        //服务器断开连接给服务端发送的事件
        this.socket.on('disconnect',function(msg){
            this.netTip.color = cc.Color.RED;
            cc.log(msg);
            this.netTip.active = true;
            this.netTip.getComponent(cc.Label).string = '您已经断开连接,待重新连接!!!!';
        }.bind(this));
        // //客户端自己监听网络是否连接
        // if(!this.socket.connected){
        //     cc.log("socket is " + this.socket);
        //     this.netTip.active = true;
        //     cc.log("网络已经断开");
        //     this.scheduleOnce(function(){
        //         this.netTip.getComponent(cc.Label).string = '网络已经断开';
        //     },1)
            
        // }
    },

    start () {

    },
    //单机版
    pveController : function(){
        cc.director.loadScene('game');
    },
    //联网
    pvpController : function(){
        cc.director.loadScene("inTheMatch");
        // var pvp = '{"username":' + '"' + UserInfo.username + '",' + '"tag":' + '"pvp"' + '}';
        // UserInfo.socket().emit('pvp',pvp);
    },
    update (dt) {
       
    },
    onDestroy(){
        this.unscheduleAllCallbacks();
    }
});
