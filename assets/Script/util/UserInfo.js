window.UserInfo={
    username : null,
    password : null,
    score : 0,
    //创建单例的网络连接
    socket : (function(){
           var longSockets;
           function getInstance(){
               if(longSockets === undefined){
                   longSockets = new Linked().longlink;
                   return longSockets;
               }else{
                   return longSockets;
               }
           }
           function Linked(){
                if(cc.sys.isNative){
                    window.io = SocketIO;
                }else{
                    if(io === undefined){
                        require('socket.io');
                    }
                }
                this.longlink = io('http://localhost:3000');
                var self = this;
                this.longlink.on('conn',function(msg){
                    console.log("msg is " +JSON.stringify(msg));
                });
           }
        return getInstance();
    })(),
    
}