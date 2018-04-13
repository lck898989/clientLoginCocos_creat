/*
 * @Author: mikey.zhaopeng 
 * @Date: 2018-04-11 09:03:25 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2018-04-13 12:55:35
 */
const link = require('link');
cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.socket = link.prototype.longLink;
        cc.log("in pipeicontroll socket is " + this.socket);
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
});
