
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
        thirdBtn: {
            default: null,
            type: cc.Button
        },
        firstScene: "",
        secondScene: "",
        thirdScene: "",
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

        if (this.thirdBtn !== null) {
            this.thirdBtn.node.on("click", function () {
                this.switchScene(this.thirdScene);
            }, this);
        }
    },

    switchScene: function (sceneName) {
        // 切换场景
        cc.director.loadScene(sceneName);
    },
});
