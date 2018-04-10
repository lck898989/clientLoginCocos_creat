/*
 * @Author: mikey.zhaopeng 
 * @Date: 2018-04-09 09:19:52 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2018-04-10 10:34:12
 */

const begin = require("begin");
const gameButton = require("gameButton");
const rankList = require("rankList");
const back = require("back");
const longLink = require("LongLink");
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
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        //获得长连接对象
        cc.log("长连接longLink is " + longLink);
        this.socket = longLink.prototype.socket;
        longLink.init();
        var startCom = begin.prototype;
        startCom.init();
        var gameButtonCom = gameButton.prototype;
        gameButtonCom.init();
        var rankCom = rankList.prototype;
        rankCom.init();
        cc.log("rankcom is " + rankCom);
        //获取组件对应的节点
        var rank = this.node.getChildByName('rank');
        rank.active = false;
        var backCom = back.prototype;
        backCom.init();
    },

    start () {

    },

    update (dt) {
        
    },
});
