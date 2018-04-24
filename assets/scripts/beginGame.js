
cc.Class({
    extends: cc.Component,

    properties: {
        begin: {
            default: null,
            type: cc.Button
        },
        close: {
            default: null,
            type: cc.Button
        },
        beginSceneName: "",
        closeSceneName: "",
    },

    onLoad () {
        this.begin.node.on("click", function () {
            this.switchScene(this.beginSceneName);
        }, this);
        this.close.node.on("click", function () {
            this.switchScene(this.closeSceneName);
        }, this);
    },
    
    switchScene: function (sceneName) {
        // 切换场景
        cc.director.loadScene(sceneName);
    },
});
