const Global = require("Global");
const serverHost = require("Host");
cc.Class({
    extends: cc.Component,

    properties: {
        bestScore : {
             default : null,
             type : cc.Node,
        },
        rankList : {
            default : null,
            type    : cc.Node,
        },
        timeLabel : {
            default : null,
            type    : cc.Node,
        }
    },
    onLoad () {
        var self =this;
        this.time = 10;
        this.scoreLabel = this.bestScore.getComponent(cc.Label);
        //刚加载场景的时候不显示排行榜
        this.rankList.active = false;
        //获得长连接
        this.socket = UserInfo.socket;
        this.socket.on('sendData',function(msg){
            if(cc.sys.isNative){
                msg = JSON.parse(msg);
            }
            cc.log("msg is " +msg);
            self.showRankList(msg,self);
        });
        cc.log("socket is " + this.socket);
    },
    mainButtonEvent : function(){
        if(Global.isStart && this.time > 0){
                //开始一个计时器 
                if(!this.isOpen){
                    this.beginTimer();
                }
                UserInfo.score += 1;
                //显示分数
                this.scoreLabel.string = UserInfo.score;
                cc.log("score is " + UserInfo.score);
                if(this.time === 0){
                    Global.isStart = false;
                    var dataString = '{"username":' + '"' + UserInfo.username + '",' +'"score":' +'"' + UserInfo.score + '",' + '"tag":' + '"score"' + '}';
                    console.log(dataString);
                    this.socket.emit("sendData",dataString);
                   
                }
            }else{
                Global.isStart = false;
                //如果从缓存中取出来的数据是undefined的就将当前分数存进去
                if(cc.sys.localStorage.getItem("best") === undefined){
                    cc.sys.localStorage.setItem("best",UserInfo.score);
                }else{
                    this.bestScore = cc.sys.localStorage.getItem("best");
                }
                if(UserInfo.score > this.bestScore){
                    this.bestScore = UserInfo.score;
                    cc.sys.localStorage.setItem("best", this.bestScore);
                }
                //取消所有计时器
                this.isOpen = false;
                // this.scoreText.getComponent(cc.Label).string = " " + this.score + "十秒时间到" 
            }
    },
    //开始计时
    beginTimer : function(){
        if(this.time <= 0 && Global.isStart){
            UserInfo.score = 0;
            this.scoreLabel.string = UserInfo.score;
            //重置时间数字
            this.time = 10;
            this.timeLabel.getComponent(cc.Label).string = this.time;
        }
        this.isOpen = true;
        this.schedule(function(){
            this.time--;
            if(this.time <= 0){
                this.isOpen = false;
                //关闭计时器
                this.unscheduleAllCallbacks();
            }
            //显示时间
            this.timeLabel.getComponent(cc.Label).string = this.time;
        },1);
    },
    //排行事件
    rankEvent : function(){
        if(this.time === 0){
            var self = this;
            //显示排行榜
            this.rankList.active = true;
            cc.log("this.score is " + UserInfo.score);
            cc.log("username is " + UserInfo.username);
            var dataString = '{"username":' + '"' + UserInfo.username + '",' +'"score":' +'"' + UserInfo.score + '",' + '"tag":' + '"rank"' + '}';
            console.log(dataString);
            this.socket.emit('sendData',dataString);
        }
    },
    //显示排名
    showRankList : function(msg,who){
       var message = msg;
        cc.log("in showRankList msg is " + msg);
        if(message instanceof Array){
            //取得数组的长度
            var length = message.length;
            cc.log("数组的长度为：" +length);
            for(let i = 0;i < length;i++){
                //填写用户名
                who.rankList.getChildByName('username'+i).getComponent(cc.Label).string = message[i].name;
                //填写分数
                who.rankList.getChildByName('score'+i).getComponent(cc.Label).string = message[i].score;
            }
        }

    },
    //开始按钮
    startEvent : function(){
        Global.isStart = true;
        if(!this.isOpen){
            this.beginTimer();
        }
    },
    //返回事件
    backEvent : function(){
        //加载匹配类型场景
        cc.director.loadScene("ptype");
    },
    start () {

    },

    update (dt) {},
});
