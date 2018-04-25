
cc.Class({
    extends: cc.Component,

    properties: {
        time: 1, // 倒计时间隔时间
        loadNewScene: ""
    },

    onLoad () {
        var self = this;
        this.callback = function () {
            var request = cc.loader.getXMLHttpRequest();
            var Config = require("Config");
            var url = Config.domain+"/getGameTeam?uid="+this.getParam("uid");
            console.log(this.getParam("uid"));
            cc.log(Config.isSingle);
            request.onreadystatechange = function () {
                if (request.readyState == 4 && (request.status >= 200 && request.status < 400)) {
                    var response = JSON.parse(request.responseText);
                    if(response.code===1){
                        Config.isFollower=1;
                        Config.uid=response.followId;
                        cc.director.loadScene("teaBeginGame");
                    }else{
                        // 切换场景
                        Config.uid=response.uid;
                        cc.director.loadScene(self.loadNewScene);
                    }
                }
            };
            request.open("GET", url, true);
            request.send(null);
            
        };
        this.schedule(this.callback, this.time);
    },

    getParam:function(name){
        var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if(r!=null)return  unescape(r[2]); return null;
    }

});
