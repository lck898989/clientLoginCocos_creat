cc.Class({
    extends: cc.Component,
    properties: {
        // defaults, set visually when attaching this script to the Canvas
        text: 'Hello, World!'
    },

    // use this for initialization
    onLoad: function () {
        let self = this;
        // self.label.string = self.text;
        //链接到服务器,初始化socket
        
        
        
    },
    init : function(){
        this.socket = this.networkConnect();
        cc.log("socket is " + this.socket + " in the Network");
    },
    networkConnect : function(){
        if(cc.sys.isNative){
            window.io = SocketIO;
        }else{
            //如果将SocketIo设置为插件脚本的话window.io自动能够访问到io变量
            require("SocketIo");
        }
        var socket = io("http://localhost:3000");
        cc.log("io is " + window.io);
        cc.log("socket is " + socket);
        socket.on('connected',function(msg){
              console.log("客户端已经链接上");
              console.log(msg);
        })
        //将这个socket返回
        return socket;
    },
    // called every frame
    update: function (dt) {

    },
});
