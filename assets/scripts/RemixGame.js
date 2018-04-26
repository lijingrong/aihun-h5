
cc.Class({
    extends: cc.Component,

    properties: {
        nextBtn: {
            default: null,
            type: cc.Button
        },
        loadNewScene: "",
    },

    onLoad() {
        if (this.nextBtn !== null) {
            this.nextBtn.node.on("click", function () {
                var Config = require("Config");
                var self = this;
                var url = Config.domain + "/aihun/isPartnerSharked";
                var params = "gameTeamId=" + Config.gameTeamId + "&userId=" + Config.uid;
                var request = cc.loader.getXMLHttpRequest();
                request.onreadystatechange = function () {
                    if (request.readyState == 4 && (request.status >= 200 && request.status < 400)) {
                        var response = JSON.parse(request.responseText);
                        if (response.code === 1) {
                            cc.director.loadScene(self.loadNewScene);
                        } else {
                            alert("您的搭档还没有成功摇出爱混，请耐心等待！");
                        }
                    }
                };
                request.open("POST", url, true);
                request.setRequestHeader("CONTENT-TYPE", "application/x-www-form-urlencoded");
                request.send(params);
            }, this);
        }
    },
});
