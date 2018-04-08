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
        }
    },

    onLoad () {
        var self = this;
        cc.log('Server is ' + Server.url);
        //当点击按钮的时候开始注册用户，获取用户名和密码
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
            xhr.open("POST", Server.url + '?username=' + self.username + '&password=' + self.password, true);
            //发送请求到服务器
            xhr.send();
        });
    },
    init:function(){

    },
    start () {

    },

    // update (dt) {},
});
