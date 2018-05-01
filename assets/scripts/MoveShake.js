
cc.Class({
    extends: cc.Component,

    properties: {
        duration: 0,
        distance: 0,
    },

    onLoad () {
        var x = this.node.x;
        var shakeAction = cc.sequence(
            cc.moveTo(this.duration, x + this.distance, this.node.y),
            cc.moveTo(this.duration, x, this.node.y),
        );
        
        this.node.runAction(cc.repeatForever(shakeAction));  // 重复晃动
    },

    start () {

    },

    // update (dt) {},
});
