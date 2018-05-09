
cc.Class({
    extends: cc.Component,

    properties: {
        time: 1, // 倒计时间隔时间
        loadNewScene: ""
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        var self = this;
        var Config = require("Config");
        Config.uid = this.getParam("userId");
        this.callback = function () {
            var uid = this.getParam("uid");
            if (uid === null) {
                cc.director.loadScene(self.loadNewScene);
            } else {
                //ajax 实现
                var url = Config.domain + "/aihun/getGameTeam?uid=" + uid + "&userId=" + Config.uid;
                var request = cc.loader.getXMLHttpRequest();
                request.onreadystatechange = function () {
                    if (request.readyState == 4 && (request.status >= 200 && request.status < 400)) {
                        var response = JSON.parse(request.responseText);
                        if (response.code === 1) {
                            Config.isFollower = 1;
                            Config.isSingle = 0;
                            Config.gameTeamId = response.data.id;
                            cc.director.loadScene("teaBeginGame");
                        } else {
                            // 切换场景
                            cc.director.loadScene(self.loadNewScene);
                        }
                    }
                };
                request.open("GET", url, true);
                request.send(null);
                
                //websock实现
                // var socket = new SockJS('/aihun-websocket');
                // var stompClient = Stomp.over(socket);
                // stompClient.connect({}, function (frame) {
                //     stompClient.send("/app/buildGameTeam", {}, JSON.stringify({'uid': uid,'userId':Config.uid}));
                //     stompClient.subscribe('/topic/pushGameTeam', function (greeting) {
                //         var result = JSON.parse(greeting.body);
                //         if(result.code===1){
                //             console.log('code ======:'+result.code);
                //             Config.isFollower = 1;
                //             Config.isSingle = 0;
                //             Config.gameTeamId = result.data.id;
                //             if (stompClient !== null) {
                //                 stompClient.disconnect();
                //             }
                //             cc.director.loadScene("teaBeginGame");
                //         }else{
                //             if (stompClient !== null) {
                //                 stompClient.disconnect();
                //             }
                //             cc.director.loadScene(self.loadNewScene);
                //         }

                //     });
                // });

            }
        };
        this.schedule(this.callback, this.time);
    },

    start() {

    },

    // update (dt) {},

    getParam: function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]); return null;
    }

});
