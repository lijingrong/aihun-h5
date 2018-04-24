
var Global = require("Global");
var Config = require("Config");

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
        Global.openSpeeker = true;

        this.singleBtn.node.on("click", function () {
            this.switchScene(this.singleScene);
            Global.gameType = Config.doubleGame;
        }, this);

        this.doubleBtn.node.on("click", function () {
            this.switchScene(this.doubleScene);
            Global.gameType = Config.doubleGame;
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
        
        // 切换喇叭图标
        if (Global.openSpeeker) {
            // this.speeker.SpriteFrame = this.closeSpeekerSpriteFrame;
            Global.openSpeeker = false;
            // 关闭声音
        } else {
            // this.speeker.SpriteFrame = this.openSpeekerSpriteFrame;
            Global.openSpeeker = true;
            // 打开声音
        }
    },
});
