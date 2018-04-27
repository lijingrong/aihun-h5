
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
        var self = this;
        this.current = cc.audioEngine.play(this.audio, true, 1);
        this.node.on("click",function(event){
            self.clickMusicBtn();
        });
    },

    start () {

    },
    onDestroy: function () {
        cc.audioEngine.stop(this.current);
    },

    stopMusic:function(){
        cc.audioEngine.stop(this.current);
    },
    playMusic:function(){
        this.current = cc.audioEngine.play(this.audio, true, 1);
    },
    clickMusicBtn:function(){
        var Config = require("Config");
        if(Config.isOpenSpeeker){
            this.stopMusic();
            Config.isOpenSpeeker=false;
            var self = this;
            cc.loader.loadRes("closeMusic", cc.SpriteFrame, function (err, spriteFrame) {
                self.node.getComponent(cc.Sprite).spriteFrame = spriteFrame;
            });
        }else{
            this.playMusic();
            Config.isOpenSpeeker=true;
        }
    }
    // update (dt) {},
});
