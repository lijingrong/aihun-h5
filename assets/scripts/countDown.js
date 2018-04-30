
cc.Class({
    extends: cc.Component,

    properties: {
        audio: {
            default: null,
            url: cc.AudioClip,
        },
        time: 1, // 倒计时间隔时间
        loadNewScene: ""
    },

    onLoad () {
        if (this.audio !== null) {
            this.didi = cc.audioEngine.play(this.audio, true, 1);
        }

        this.countDown = function () {
            cc.director.loadScene(this.loadNewScene);
        };
        this.schedule(this.countDown, this.time);
    },

    onDestroy: function () {
        cc.audioEngine.stop(this.didi);
    }
});
