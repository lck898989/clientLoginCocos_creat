//注册功能方法
const Server = require('Server');
cc.Class({
    extends: cc.Component,

    properties: {
        usernameInput : {
            default : null,
            type    : cc.EditBox,
        },
        passwordInput : {
            default : null,
            type    : cc.EditBox,
        },
        //提示消息显示框
        toastParent   : {
            default  : null,
            type     : cc.Node,
        }

    },

    onLoad () {
        var self = this;
        Server.type = 'POST';
        self.toastParent.active = false;
        //当点击按钮的时候开始注册用户，获取用户名和密码
        this.sendRequest();
    },
    sendRequest : function(){
        var self = this;
        self.username = self.usernameInput.string;
        self.password = self.passwordInput.string;
        this.node.on('mousedown',function(){
            //创建一个http请求
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
                    //服务器相应的条件是响应状态为200开始读取响应内容
                    var response = xhr.responseText;
                    console.log("response is " + response);
                    //将json字符串转换为json对象
                    try{
                        var message = JSON.parse(response);
                        console.log("message is " + message);
                        console.log("message is " + message.msg);
                    }catch(e){
                        console.log("转换为json对象失败");
                    }
                    
                    //将显示框的状态设置为激活状态然后显示服务端给发送的信息
                    self.toastParent.active = true;
                    //设置标签的值为后端传递进来的值
                    var label = self.toastParent.children[0].getComponent(cc.Label);
                    if(message != null){
                        label.string = message.msg;
                    }else{
                        label.string = response;
                    }
                    label.fontSize = 30;
                    label.scheduleOnce(function(){
                        //两秒钟后隐藏该显示框
                        self.toastParent.active = false;
                    },2);
                    //关闭所有的计时器
                    self.toastParent.getComponent(cc.Label).unscheduleAllAaCallbacks();
                }
            };
            cc.log("username is " + self.username);
            cc.log("password is " + self.password);
            
            cc.log("server's type is " + Server.type);
            xhr.open(Server.type, Server.url+'/register' + '?username=' + self.username + '&password=' + self.password, true);
            cc.log("url is " + Server.url+'/register' + '?username=' + self.username + '&password=' + self.password);
            //发送请求到服务器
            xhr.send();
        });
    },
    init:function(){

    },
    start () {

    },

    update (dt) {
        this.username = this.usernameInput.string;
        this.password = this.passwordInput.string;
    },
});
