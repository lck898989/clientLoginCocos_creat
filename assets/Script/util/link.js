/*
 * @Author: mikey.zhaopeng 
 * @Date: 2018-04-11 09:32:29 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2018-04-13 09:17:56
 */
cc.Class({
    extends: cc.Component,

    properties: {
      
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.init();
    },
    init : function(){
        //长连接
        this.longLink = UserInfo.socket;
        var self = this;
        //监听事件
        this.longLink.on('conn',function(msg){
            
        });
    },
    //广播事件
    
    start () {

    },

    // update (dt) {},
});
