
cc.Class({
    extends: cc.Component,

    properties: {
        firstBtn: {
            default: null,
            type: cc.Button
        },
        secondBtn: {
            default: null,
            type: cc.Button
        },
        firstScene: "",
        secondScene: "",
    },

    onLoad() {
        if (this.firstBtn !== null) {
            this.firstBtn.node.on("click", function () {
                this.switchScene(this.firstScene);
            }, this);
        }

        if (this.secondBtn !== null) {
            this.secondBtn.node.on("click", function () {
                this.switchScene(this.secondScene);
            }, this);
        }
    },

    switchScene: function (sceneName) {
        // 切换场景
        cc.director.loadScene(sceneName);
    },
});
