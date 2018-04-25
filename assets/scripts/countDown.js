
cc.Class({
    extends: cc.Component,

    properties: {
        time: 1, // 倒计时间隔时间
        loadNewScene: ""
    },

    onLoad () {
        this.callback = function () {
            // 切换场景
            cc.director.loadScene(this.loadNewScene);
        };
        this.schedule(this.callback, this.time);
    },

});
