cc.Class({
    extends: cc.Component,

    properties: {
        //开始按钮
        begin : {
            default : null,
            type    : cc.Node,
        },
        //对手的分数
        rivalScore : {
            default : null,
            type    : cc.Node,
        },
        //我自己的分数
        myScore : {
            default : null,
            type    : cc.Node,
        },
        //显示时间的节点
        timec : {
            default : null,
            type    : cc.Node,
        }

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        var self = this;
        this.socket = UserInfo.socket;
        this.time = 10;
        //分数初始化为零
        this.score = 0;
        if(UserInfo.username != null){
            cc.find("Canvas/myself").getComponent(cc.Label).string = UserInfo.username;
        }
        //如果对手信息为空的话
        if(SwitchScene.rivalInfo != null){
            for(let i = 0; i< SwitchScene.rivalInfo.length;i++){
                //如果当前用户名等于切换场景时候保存的用户信息的话,显示对手信息
                 if(UserInfo.username != SwitchScene.rivalInfo[i].username){
                     //将对手信息显示出来
                    cc.find("Canvas/rival").getcomponent(cc.Label).string = SwitchScene.rivalInfo[i].username;
                 }
            }
            
        }
        //开始按钮监听事件开始
        this.begin.on('mousedown',function(){
            if(UserInfo.username != null){
                var dataString = '{"username":' + '"' + UserInfo.username + '",' + '"roomID":' + '"' + SwitchScene.roomID + '"' + '}';
                self.socket.emit('time',dataString);
                 //启动倒计时
                self.countDown();
            }
            // var dataString = '{"username":' + '"lck",' + '"roomID":' + '"0"' + '}';
            //     self.socket.emit('time',dataString);
            //      //启动倒计时
            //     self.countDown();
            
        });
        this.node.on('mousedown',function(){
            var self = this;
            //加分
            self.score += 1;
            //将自己的分数显示出来
            self.myScore.getComponent(cc.Label).string = self.score;
            if(UserInfo.username != null){
                //将数据发送到服务器
                var dataString = '{"username":' + '"' +UserInfo.username + '",' + '"roomID":' + '"' + SwitchScene.roomID + '",' + '"score":' + '"' + self.score + '"' + '}';
                self.socket.emit('add',dataString);
            }
        });
        //监听服务器给发送的消息
        this.socket.on('addScore',function(msg){
            cc.log("in socket msg is " + msg);
            //判断服务器给发送的消息
            if(msg === ''){
                
            }
        });
    },

    start () {

    },
    //倒计时
    countDown : function(){
        //计时器开始
        this.schedule(function(){
             this.time -= 1;
        },1)
    },
    update (dt) {
        //显示时间
        this.timec.getComponent(cc.Label).string = this.time;
        if(this.time < 1){
            //关闭所有的计时器
            this.unscheduleAllCallbacks();
        }
    },
});
