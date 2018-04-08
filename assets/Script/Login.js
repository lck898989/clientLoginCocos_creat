
/*
 * @Author: mikey.zhaopeng 
 * @Date: 2018-04-06 21:08:52 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2018-04-08 17:25:26
 */
const Server = require('Server');
const Network = require('Network');
cc.Class({
    extends: cc.Component,

    properties: {
        //用户名输入框的引用
        usernameInput : {
            default : null,
            type    : cc.EditBox,
        },
        passwordInput : {
            default : null,
            type    : cc.EditBox,
        },
        //提示消息框
        toastParent   : {
            default : null,
            type    : cc.Node,
        }
    },
    onLoad () {
        cc.log("in login.js this.node is " + this.node);
        cc.log("in login.js socket is " + this.socket);
        cc.log("server is " + Server.url);
        Server.type = 'GET';
        //刚开始的时候不显示提示框
        this.toastParent.active = false;
        this.sendRequest();
    },
    sendRequest : function(){
        var self =this;
        // self.username = self.usernameInput.string;
        // self.password = self.passwordInput.string;
        
        //如果点击登录按钮的话进行登录
        this.node.on('mousedown',function(){
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
                        console.log("转换为json对象出错");
                    }
                    //将显示框的状态设置为激活状态然后显示服务端给发送的信息
                    self.toastParent.active = true;
                    //获得显示框的label然后设置它的字体等等一些属性
                    var label = self.toastParent.children[0].getComponent(cc.Label);
                    //设置字体大小
                    label.fontSize = 30;
                    //显示框中显示从服务器传来的数据
                    label.string = response;
                    //2秒后不让这个显示框再进行显示
                    label.scheduleOnce(function(){
                        //两秒钟后隐藏该显示框
                        self.toastParent.active = false;
                    },2);
                    //关闭所有的计时器
                    label.unscheduleAllAaCallbacks();
                }
            };
            cc.log("username is " + self.username);
            cc.log("password is " + self.password);
            xhr.open(Server.type, Server.url + '/login?username=' + self.username + '&password=' + self.password, true);
            
            // xhr.setRequestHeader("Access-Control-Allow-Origin","*");
            // JSON.stringify()
            xhr.send();
        });
    },
    init : function(){
        //获取网络状态
        this.network = Network.prototype;
        //获取socket
        this.socket = this.network.socket;
        cc.log("socket is " + this.socket);
        if((this.usernameInput != undefined) && (this.passwordInput != undefined)){
            this.username = this.usernameInput.string;
            this.password = this.passwordInput.string;
        }
        
    },
    start () {

    },

    update (dt) {
        this.username = this.usernameInput.string;
        this.password = this.passwordInput.string;
        // cc.log("this.username is " + this.username);
        // this.sendRequest();
    },
});
