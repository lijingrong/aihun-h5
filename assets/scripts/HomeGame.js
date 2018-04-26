
cc.Class({
    extends: cc.Component,

    properties: {
        speeker: {
            default: null,
            type: cc.Node
        },
        // openSpeekerSpriteFrame: {
        //     default: null,
        //     type: cc.SpriteFrame
        // },
        // closeSpeekerSpriteFrame: {
        //     default: null,
        //     type: cc.SpriteFrame
        // },
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
        speekerBtn: {
            default: null,
            type: cc.Button
        },
        singleScene: "",
        doubleScene: "",
        descScene: "",
    },

    onLoad() {
        this.singleBtn.node.on("click", function () {
            this.switchScene(this.singleScene);
        }, this);

        this.doubleBtn.node.on("click", function () {
            this.switchScene(this.doubleScene);
        }, this);

        this.descBtn.node.on("click", function () {
            this.switchScene(this.descScene);
        }, this);

        this.speekerBtn.node.on("click", this.switchSpeeker, this);
    },

    switchScene: function (sceneName) {
        // 切换场景
        cc.director.loadScene(sceneName);
    },

    switchSpeeker: function () {
        var Config = require("Config");
        // 切换喇叭图标
        if (Config.isOpenSpeeker) {
            // this.speeker.SpriteFrame = this.closeSpeekerSpriteFrame;
            Config.isOpenSpeeker = false;
            // 关闭声音
        } else {
            // this.speeker.SpriteFrame = this.openSpeekerSpriteFrame;
            Config.isOpenSpeeker = true;
            // 打开声音
        }
    },
});
