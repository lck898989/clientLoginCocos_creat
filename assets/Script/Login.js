
/*
 * @Author: mikey.zhaopeng 
 * @Date: 2018-04-06 21:08:52 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2018-04-08 09:57:00
 */
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
        }
    },
    onLoad () {
        cc.log("in login.js this.node is " + this.node);
        cc.log("in login.js socket is " + this.socket);
        var self =this;
        //如果点击登录按钮的话进行登录
        this.node.on('mousedown',function(){
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
                    //服务器相应的条件是响应状态为200开始读取响应内容
                    var response = xhr.responseText;
                    console.log("response is " + response);
                    //将json字符串转换为json对象
                    var message = JSON.parse(response);
                    console.log("message is " + message);
                    console.log("message is " + message.msg);
                }
            };
            cc.log("username is " + self.username);
            cc.log("password is " + self.password);
            xhr.open("GET", 'http://localhost:8888?username=' + self.username + '&password=' + self.password, true);
            
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
    },
});
