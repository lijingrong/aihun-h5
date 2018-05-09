
cc.Class({
    extends: cc.Component,

    properties: {
        singleBtn: {
            default: null,
            type: cc.Button
        },
        doubleBtn: {
            default: null,
            type: cc.Button
        },
        descBtn: {
            default: null,
            type: cc.Button
        },
        singleScene: "",
        doubleScene: "",
        descScene: "",
    },

    onLoad() {
        var Config = require("Config");
        if (this.singleBtn !== null) {
            this.singleBtn.node.on("click", function () {
                Config.isSingle = 1;
                Config.isFollower = 0;
                this.switchScene(this.singleScene);
            }, this);
        }
        
        if (this.doubleBtn !== null) {
            this.doubleBtn.node.on("click", function () {
                Config.isFollower = 0;
                this.switchScene(this.doubleScene);
            }, this);
        }
        
        if (this.descBtn !== null) {
            this.descBtn.node.on("click", function () {
                this.switchScene(this.descScene);
            }, this);
        }
    },

    switchScene: function (sceneName) {
        // 切换场景
        cc.director.loadScene(sceneName);
    },
});
