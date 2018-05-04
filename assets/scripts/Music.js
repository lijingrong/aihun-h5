
cc.Class({
    extends: cc.Component,

    properties: {
        audio: {
            url: cc.AudioClip,
            default: null
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        var self = this;
        if (cc.sys.os === cc.sys.OS_ANDROID) {
            this.playMusic();
        } else {
            cc.audioEngine.play(this.audio, false, 0);
        }
        this.node.on("click", function (event) {
            self.clickMusicBtn();
        });
    },

    start() {

    },
    onDestroy: function () {
        cc.audioEngine.stop(this.current);
    },

    stopMusic: function () {
        cc.audioEngine.stop(this.current);
        var audio = document.getElementById("musicAudio");
        if (audio) {
            audio.pause();
        }
    },

    playMusic: function () {
        this.current = cc.audioEngine.play(this.audio, true, 1);
    },

    clickMusicBtn: function () {
        var Config = require("Config");
        var self = this;
        if (Config.isOpenSpeeker) {
            this.stopMusic();
            Config.isOpenSpeeker = false;
            cc.loader.loadRes("closeMusic", cc.SpriteFrame, function (err, spriteFrame) {
                self.node.getComponent(cc.Sprite).spriteFrame = spriteFrame;
            });
        } else {
            this.playMusic();
            cc.loader.loadRes("openMusic", cc.SpriteFrame, function (err, spriteFrame) {
                self.node.getComponent(cc.Sprite).spriteFrame = spriteFrame;
            });
            Config.isOpenSpeeker = true;
        }
    }
    // update (dt) {},
});
