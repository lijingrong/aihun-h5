
cc.Class({
    extends: cc.Component,

    properties: {
        duration: 0,
        angle: 0,
    },

    onLoad () {
        var shakeAction = cc.sequence(
            cc.rotateTo(this.duration, this.angle),
            cc.rotateTo(this.duration, -1 * this.angle),
        );
        
        this.node.runAction(cc.repeatForever(shakeAction));  // 重复晃动        
    },

    start () {

    },

    // update (dt) {},
});
