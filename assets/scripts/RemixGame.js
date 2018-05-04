
cc.Class({
    extends: cc.Component,

    properties: {
        nextBtn: {
            default: null,
            type: cc.Button
        },
        prizeScene: "",
        time: 0,
        restartScene: "",   // 重新玩场景
        promptScene: "",  // 提示场景
    },

    onLoad() {
        var Config = require("Config");

        if (this.nextBtn !== null) {
            this.nextBtn.node.on("click", function () {
                cc.log("123456");
                var self = this;
                var url = Config.domain + "/aihun/isPartnerSharked";
                var params = "gameTeamId=" + Config.gameTeamId + "&userId=" + Config.uid;
                var request = cc.loader.getXMLHttpRequest();
                request.onreadystatechange = function () {
                    if (request.readyState == 4 && (request.status >= 200 && request.status < 400)) {
                        var response = JSON.parse(request.responseText);
                        if (response.code === 1) {
                            cc.director.loadScene(self.prizeScene);
                        } else {
                            cc.director.loadScene(self.promptScene);
                        }
                    }
                };
                request.open("POST", url, true);
                request.setRequestHeader("CONTENT-TYPE", "application/x-www-form-urlencoded");
                request.send(params);
            }, this);
        }

        // 每秒请求后端，判断搭档是否游戏失败，失败跳转到重新开始场景
        this.countDown = function () {
            var _self = this;
            var _url = Config.domain + "/aihun/getGameStatus?gameTeamId=" + Config.gameTeamId + "&userId=" + Config.uid;
            var _request = cc.loader.getXMLHttpRequest();
            _request.onreadystatechange = function () {
                if (_request.readyState == 4 && (_request.status >= 200 && _request.status < 400)) {
                    var _response = JSON.parse(_request.responseText);
                    if (_response.code === 1) {
                        _self.unschedule(_self.countDown);
                    } else if (_response.code === 0) {
                        _self.unschedule(_self.countDown);
                        cc.director.loadScene(_self.restartScene);
                    }
                }
            };
            _request.open("GET", _url, true);
            _request.send();
        };
        this.schedule(this.countDown, this.time);
    },
});
