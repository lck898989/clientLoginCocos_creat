/*
 * @Author: mikey.zhaopeng 
 * @Date: 2018-04-10 12:35:47 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2018-04-10 16:32:55
 */
const serverHost = require("Host");
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
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.operation = '';
        this.ServerLink = serverHost.host;
        this.toastParent.active = false;
        cc.log("node is " +this.node.name);
    },

    start () {

    },
    sendRequest : function(operation){
        cc.log("this.operation is " + this.operation);
        this.ServerLink += operation;
        var self =this;
        // self.username = self.usernameInput.string;
        // self.password = self.passwordInput.string;
        //如果点击登录按钮的话进行登录
            var xhr = new XMLHttpRequest();
            //将label给准备好
            var label = self.toastParent.children[0].getComponent(cc.Label);
            cc.log("label is " + label);
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
                    //服务器相应的条件是响应状态为200开始读取响应内容
                    var response = xhr.responseText;
                    console.log("response is " + response);
                    try{
                        //将json字符串转换为json对象
                        var message = JSON.parse(response);
                        console.log("message is " + message);
                        console.log("message is " + message.msg);
                        self.toastParent.active = true;
                        self.overAndStoreUser(label,message);
                    }catch(e){
                        console.log("转换为json对象出错");
                        //如果不是json对象的话当做字符串处理
                        //将显示框的状态设置为激活状态然后显示服务端给发送的信息
                        self.toastParent.active = true;
                        //设置字体大小
                        label.fontSize = 30;
                        //显示框中显示从服务器传来的数据
                        label.string = response;
                        //存储用户信息
                        self.overAndStoreUser(label,response);
                    }
               
                    
                }
            };    
            cc.log("username is " + self.username);
            cc.log("password is " + self.password);
            cc.log("serverLink is " + this.ServerLink);
            xhr.open("POST", this.ServerLink);
            // xhr.setRequestHeader("Access-Control-Allow-Origin","*");
            // JSON.stringify()
            // + '?username=' + self.username + '&password=' + self.password
            //JSON.stringify({'username':'adsf','password':'asd'})
            cc.log('{"username":' + '"' + self.username + '",' + '"password"' + ":" + '"' + self.password + '",' + '"tag"' + ":" + '"' + operation + '"}');
            xhr.send('{"username":' + '"' + self.username + '",' + '"password"' + ":" + '"' + self.password + '",' + '"tag"' + ":" + '"' + operation + '"}');
            // xhr.send();
    },
    overAndStoreUser : function(label,message){
        var self = this;
        if(message instanceof String){
            //message是一个字符串对象
           this.showEditBox(message,label);
        }else{
            //message是一个JSON对象
          this.showEditBox(message.msg,label);
        }
    },
    showEditBox : function(message,label){
        var self = this;
        //该message就是一个字符串类型的数据
        if(message === '登录成功'){
            this.scheduleOnce(function(){
                //把相应的用户信息保存起来，初始化全局变量
                
                //登录成功后2s自动进入游戏
                cc.director.loadScene("game");
            },1);
            // this.unscheduleAllCallbacks();
            UserInfo.username = self.username;
            UserInfo.password = self.password;
            cc.log("userInfo's username is " + UserInfo.username);
            cc.log("userInfo's password is " + UserInfo.password);
        }
        label.string = message;

    },
    loginEvent : function(){
        this.eventCheck(this.loginEvent.name);
    },
    registerEvent : function(){
       this.eventCheck(this.registerEvent.name);
    },
    enterEvent : function(){
        this.eventCheck(this.enterEvent.name);
    },
    eventCheck(functionName){
        switch(functionName){
            case 'loginEvent':
               this.operation = 'login';
               break;
            case 'registerEvent':
                this.operation = 'regist';
                cc.log("asdfa");
                break;
            case 'enterEvent':
                this.operation = 'enter';
                break;     
        }
        this.sendRequest(this.operation);
        this.ServerLink = serverHost.host;
    },
    update(){
        this.username = this.usernameInput.string;
        this.password = this.passwordInput.string;
    },
    onDestroy(){
        this.unscheduleAllCallbacks();
    }
});
