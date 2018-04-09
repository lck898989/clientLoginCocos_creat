// Learn cc.Class:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/class/index.html
// Learn Attribute:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/reference/attributes/index.html
// Learn life-cycle callbacks:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/life-cycle-callbacks/index.html

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
        this.ServerLink = "http://192.168.1.175:3000/";
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
                        self.overAndStoreUser(label,response);
                    }
               
                    //关闭所有的计时器
                    label.unscheduleAllAaCallbacks();
                }
            };    
            cc.log("username is " + self.username);
            cc.log("password is " + self.password);
            cc.log("serverLink is " + this.ServerLink);
            xhr.open("POST", this.ServerLink + '?username=' + self.username + '&password=' + self.password);
            // xhr.setRequestHeader("Access-Control-Allow-Origin","*");
            // JSON.stringify()
            xhr.send();
    },
    overAndStoreUser : function(label,message){
        var self = this;
        if(message instanceof String){
            label.string = message;
        }else{
            if(message.msg === '信息正确'){
                this.scheduleOnce(function(){
                    //把相应的用户信息保存起来，初始化全局变量
                    UserInfo.user.username = self.username;
                    UserInfo.user.password = self.password;
                    //登录成功后2s自动进入游戏
                    cc.director.loadScene("game");
                },2);
            }else if(message.msg === '注册成功'){
                label.string = message.msg
            }
        }
        
        
       
    },
    loginEvent : function(){
        this.eventCheck(this.loginEvent.name)
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
                this.operation = 'register';
                cc.log("asdfa");
                break;
            case 'enterEvent':
                this.operation = 'enter';
                break;       
        }
        this.sendRequest(this.operation);
        this.ServerLink = "http://192.168.1.175:3000/";
    },
    update(){
        this.username = this.usernameInput.string;
        this.password = this.passwordInput.string;
    }
});
