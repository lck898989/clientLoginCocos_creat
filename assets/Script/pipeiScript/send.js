cc.Class({
    extends: cc.Component,

    properties: {
        rival : {
            default : null,
            type    : cc.Node
        },
        infoLabel : {
            default : null,
            type    : cc.Node,
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.socket = UserInfo.socket;
    },

    start () {

    },
    sendMessage : function(){
        var dataString = '{"username":' + '"' + UserInfo.username + '",'+ '"tag":' + '"sendMessage"' +  '}'
        this.socket.emit('message',);
    },
    update (dt) {},
});
