// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        var Config = require("Config");
        var url = Config.domain+"/aihun/getQRCode";
        var self = this;
        var request = cc.loader.getXMLHttpRequest();
        var params = "uid=uid";
        cc.log(Config.test);
        Config.test=2;
        request.onreadystatechange = function () {
            if (request.readyState == 4 && (request.status >= 200 && request.status < 400)) {
                var response = JSON.parse(request.responseText);
                cc.log(response.imgUrl);
                cc.loader.load(response.imgUrl,function (err, texture) {
                    var frame=new cc.SpriteFrame(texture);
                    self.node.getComponent(cc.Sprite).spriteFrame=frame;
                    cc.log(Config.test);
               });
            }
        };
        request.open("POST", url, true);
        request.setRequestHeader("CONTENT-TYPE","application/x-www-form-urlencoded");
        request.send(params);
    },

    start () {

    },

    // update (dt) {},
});
