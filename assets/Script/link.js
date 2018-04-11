/*
 * @Author: mikey.zhaopeng 
 * @Date: 2018-04-11 09:32:29 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2018-04-11 13:58:45
 */
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
        this.init();
    },
    init : function(){
        this.longLink = UserInfo.socket;
        var self = this;
        this.longLink.on('conn',function(msg){
            
        });
    },
    //广播事件
    
    start () {

    },

    // update (dt) {},
});
