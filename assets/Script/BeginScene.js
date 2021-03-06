/*
 * @Author: mikey.zhaopeng 
 * @Date: 2018-04-10 12:35:47 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2018-04-20 16:59:08
 */
const serverHost = require("Host");
cc.Class({
    extends: cc.Component,

    properties: {
         //用户名输入框的引用
         usernameInput : {
            default : null,
            type    : cc.Node,
        },
        passwordInput : {
            default : null,
            type    : cc.Node,
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
        this.username = this.usernameInput.getComponent(cc.EditBox).string;
        this.password = this.passwordInput.getComponent(cc.EditBox).string;
        cc.log("username is " + this.username);
        cc.log("password is " + this.password);
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
            xhr.ontimeout = function(e){
                console.error("Timeout!!");
            }
            // xhr.setRequestHeader("Access-Control-Allow-Origin","*");
            // JSON.stringify()
            // + '?username=' + self.username + '&password=' + self.password
            //JSON.stringify({'username':'adsf','password':'asd'})
            cc.log('{"username":' + '"' + self.username + '",' + '"password":' + '"' + self.password + '",' + '"tag"' + ":" + '"' + operation + '"}');
            xhr.send('{"username":' + '"' + self.username + '",' + '"password":' + '"' + self.password + '",' + '"tag"' + ":" + '"' + operation + '"}');
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
                // UserInfo.matchModeSocket = io('ws://192.168.1.153:3000');
                if(cc.sys.isNative){
                    cc.log("该平台是android平台");
                    //调用java代码进行socket的连接
                    UserInfo.socket = window.io.connect(serverHost.host,{'force new connection': true});
                    UserInfo.socket.on('conn',function(msg){
                        cc.log("msg is " + JSON.stringify(msg));
                    })
                    
                }else{
                    UserInfo.socket  = io.connect(serverHost.host,{'force new connection' : true});
                    UserInfo.socket.on('conn',function(msg){
                        cc.log("msg is " + JSON.stringify(msg));
                        console.log("msg is " + JSON.stringify(msg));
                    });
                }
                //登录成功后2s自动进入游戏
                cc.director.loadScene("ptype");
                UserInfo.socket.on('disconnect',function(msg){
                    cc.log("in d" + msg);
                });
                //关闭重新连接监听
                UserInfo.socket.on('reconnect',function(msg){
                    UserInfo.listenCount++;
                    cc.log("listenCount is " + UserInfo.listenCount);
                    cc.log("in BeginScene msg is " + msg);
                });
            },1);
            // this.unscheduleAllCallbacks();
            UserInfo.username = self.username;
            UserInfo.password = self.password;
            cc.log("userInfo's username is " + UserInfo.username);
            cc.log("userInfo's password is " + UserInfo.password);
            // //开启长连接
            // UserInfo.socket();
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
        
    },
    onDestroy(){
        this.unscheduleAllCallbacks();
    }
});
