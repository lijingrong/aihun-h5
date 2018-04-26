cc.Class({
    extends: cc.Component,

    properties: {
        time: 1, // 倒计时间隔时间
        loadNewScene: ""
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        var Config = require("Config");
        var url = Config.domain + "/aihun/getQRCode";
        var self = this;
        var request = cc.loader.getXMLHttpRequest();
        var params = "userId=" + Config.uid;
        request.onreadystatechange = function () {
            if (request.readyState == 4 && (request.status >= 200 && request.status < 400)) {
                var response = JSON.parse(request.responseText);
                Config.isSingle = 0;
                Config.gameTeamId = response.gameTeamId;
                cc.loader.load(response.imgUrl, function (err, texture) {
                    var frame = new cc.SpriteFrame(texture);
                    self.node.getComponent(cc.Sprite).spriteFrame = frame;
                });
            }
        };
        request.open("POST", url, true);
        request.setRequestHeader("CONTENT-TYPE", "application/x-www-form-urlencoded");
        request.send(params);

        // 每秒请求后端，判断B用户扫码成功，并跳转游戏场景
        this.callback = function () {
            var _self = this;
            var _url = Config.domain + "/aihun/isFollowerJoin";
            var _request = cc.loader.getXMLHttpRequest();
            var _params = "gameTeamId=" + Config.gameTeamId;
            _request.onreadystatechange = function () {
                if (_request.readyState == 4 && (_request.status >= 200 && _request.status < 400)) {
                    var _response = JSON.parse(_request.responseText);
                    if (_response.code === 1) {
                            _self.unschedule(_self.callback);
                            cc.director.loadScene(_self.loadNewScene);
                    }
                }
            };
            _request.open("POST", _url, true);
            _request.setRequestHeader("CONTENT-TYPE", "application/x-www-form-urlencoded");
            _request.send(_params);
        };
        this.schedule(this.callback, this.time);
    },

    start() {

    },

    // update (dt) {},
});
