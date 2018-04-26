
cc.Class({
    extends: cc.Component,

    properties: {
        audio: {
            url: cc.AudioClip,
            default: null
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.current = cc.audioEngine.play(this.audio, false, 1);
    },

    start () {

    },
    onDestroy: function () {
        cc.audioEngine.stop(this.current);
    }
    // update (dt) {},
});
