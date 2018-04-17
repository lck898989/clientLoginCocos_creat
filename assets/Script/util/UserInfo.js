window.UserInfo={
    username : null,
    password : null,
    score : 0,
    //创建单例的网络连接
    // socket : (function(){
    //        var longSockets;
    //        function getInstance(){
    //            if(longSockets === undefined){
    //                longSockets = new Linked().longlink;
    //                return longSockets;
    //            }else{
    //                return longSockets;
    //            }
    //        }
    //        function Linked(){
    //            this.longlink = io('http://192.168.1.115:3000');
    //             var self = this;
    //             this.longlink.on('conn',function(msg){
    //                 console.log("msg is " +JSON.stringify(msg));
    //             });
    //        }
    //     return getInstance();
    // })(),
    //匹配socket
    matchSocket : null,
    //房间聊天室socket
    roomSocket : null,
    //游戏场景socket
    gameSocket : null,
    
}