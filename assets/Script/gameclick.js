/***
 * 
 * 进入游戏逻辑
 * 
 */
cc.Class({
    extends: cc.Component,

    properties: {
       
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        //点击该按钮的时候进入另外一个场景
        this.node.on('mousedown',function(){
            cc.director.loadScene('game');
        });
    },

    start () {

    },

    update (dt) {},
});
