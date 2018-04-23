
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
        this.begin.node.on("click", this.beginGame, this);
        this.close.node.on("click", this.closeGame, this);
    },

    beginGame: function() {
        // 切换场景
        cc.director.loadScene(this.beginSceneName);
    },

    closeGame: function() {
        // 关闭游戏
        cc.director.loadScene(this.closeSceneName);
    },
});
