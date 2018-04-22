
cc.Class({
    extends: cc.Component,

    properties: {
        switchSceneName: ""
    },

    onLoad () {
        this.callback = function () {
            // 切换场景
            cc.director.loadScene(this.switchSceneName);
        };
        this.schedule(this.callback, 1);
    },

});
