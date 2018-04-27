
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
        this.singleBtn.node.on("click", function () {
            this.switchScene(this.singleScene);
        }, this);

        this.doubleBtn.node.on("click", function () {
            this.switchScene(this.doubleScene);
        }, this);

        this.descBtn.node.on("click", function () {
            this.switchScene(this.descScene);
        }, this);
    },

    switchScene: function (sceneName) {
        // 切换场景
        cc.director.loadScene(sceneName);
    },
});
