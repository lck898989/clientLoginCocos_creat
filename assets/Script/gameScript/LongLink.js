/*
 * @Author: mikey.zhaopeng 
 * @Date: 2018-04-09 14:34:22 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2018-04-09 14:53:04
 */

cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        
    },

    start () {
        this.longLink();
    },
    longLink : function(){
        //长连接
        this.ws = new WebSocket("ws://192.168.1.175:3000");
        this.ws.onopen = function(evt){
            console.log("evt is " + evt);
        }
        this.ws.onmessage = function(evt){
            console.log("response text msg " + evt.data);
        }
        this.ws.onerror = function(evt){
            console.log("send text fired an error");
        }
        this.ws.onClose = function(evt){
            console.log("关闭连接");
        }
        ws.addEventListener('open',function(evt){
            ws.send("hello 我是客户端");
        });
        ws.addEventListener('message',function(evt){
            console.log("message from Server",evt.data);
        }),
        setTimeout(function(){
            if(this.ws.readyState === WebSocket.OPEN){
                this.ws.send("Hello wobsocket,I'm a text message");
            }else{
                console.log("websocket instance wasn't ready...");
            }
        },3);
    },
    update (dt) {},
});
