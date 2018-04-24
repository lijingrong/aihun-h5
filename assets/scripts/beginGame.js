
cc.Class({
    extends: cc.Component,

    properties: {
        beginBtn: {
            default: null,
            type: cc.Button
        },
        closeBtn: {
            default: null,
            type: cc.Button
        },
        beginScene: "",
        closeScene: "",
    },

    onLoad () {
        this.beginBtn.node.on("click", function () {
            this.switchScene(this.beginScene);
        }, this);
        this.closeBtn.node.on("click", function () {
            this.switchScene(this.closeScene);
        }, this);
    },
    
    switchScene: function (sceneName) {
        // 切换场景
        cc.director.loadScene(sceneName);
    },
});
