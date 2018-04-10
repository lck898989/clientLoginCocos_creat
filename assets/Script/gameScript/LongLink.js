/*
 * @Author: mikey.zhaopeng 
 * @Date: 2018-04-09 14:34:22 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2018-04-10 10:53:33
 */

cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        
    },

    start () {
        
    },
    init : function(){
        this.longLink();
    },
    longLink : function(){
        // //长连接websocket
        // this.ws = new WebSocket("ws://192.168.1.175:3000");
        // this.ws.onopen = function(evt){
        //     console.log("evt is " + evt);
        // }
        // this.ws.onmessage = function(evt){
        //     console.log("response text msg " + evt.data);
        // }
        // this.ws.onerror = function(evt){
        //     console.log("send text fired an error");
        // }
        // this.ws.onClose = function(evt){
        //     console.log("关闭连接");
        // }
        // ws.addEventListener('open',function(evt){
        //     ws.send("hello 我是客户端");
        // });
        // ws.addEventListener('message',function(evt){
        //     console.log("message from Server",evt.data);
        // }),
        // setTimeout(function(){
        //     if(this.ws.readyState === WebSocket.OPEN){
        //         this.ws.send("Hello wobsocket,I'm a text message");
        //     }else{
        //         console.log("websocket instance wasn't ready...");
        //     }
        // },3);
        let self = this;
        if(cc.sys.isNative){
            window.io = SocketIO;
        }else{
            require('./socket.io');
        }
        cc.log("io is " + io);
        this.socket = io('http://192.168.1.153:3000');
        this.socket.on('conn',function(msg){
            //进入回调函数说明是连接成功的状态
            console.log("msg is " + msg);
            concosle.log("连接成功");
        });
    },
    update (dt) {},
});
