cc.Class({
    extends: cc.Component,

    properties: {
        spinBtn: {
            default: null,      // The default value will be used only when the component attachin                    // to a node for the first time
            type: cc.Button,     // optional, default is typeof default
            visible: true,      // optional, default is true
            displayName: 'SpinBtn', // optional
        },
        wheelSp: {
            default: null,
            type: cc.Sprite
        },
        maxSpeed: {
            default: 5,
            type: cc.Float,
            max: 15,
            min: 2,
        },
        duration: {
            default: 3,
            type: cc.Float,
            max: 5,
            min: 1,
            tooltip: "减速前旋转时间"
        },
        acc: {
            default: 0.1,
            type: cc.Float,
            max: 0.2,
            min: 0.01,
            tooltip: "加速度"
        },
        targetID: {
            default: 0,
            type: cc.Integer,
            max: 17,
            min: 0,
            tooltip: "指定结束时的齿轮"
        },
        springback: {
            default: false,
            tooltip: "旋转结束是否回弹"
        },
        effectAudio: {
            default: null,
            url: cc.AudioClip
        }
    },

    // use this for initialization
    onLoad() {
        var Config = require("Config");
        this.wheelState = 0;
        this.curSpeed = 0;
        this.spinTime = 0;                   //减速前旋转时间
        this.gearNum = 4;
        this.defaultAngle = 0;        //修正默认角度
        this.gearAngle = 360 / this.gearNum;   //每个齿轮的角度
        this.wheelSp.node.rotation = this.defaultAngle;
        this.finalAngle = 0;                 //最终结果指定的角度
        this.effectFlag = 0;                 //用于音效播放
        var self = this;
        var url = Config.domain + "/aihun/draw?userId=" + Config.uid;
        var request = cc.loader.getXMLHttpRequest();
        request.onreadystatechange = function () {
            if (request.readyState == 4 && (request.status >= 200 && request.status < 400)) {
                var response = JSON.parse(request.responseText);
                if (response.code === 1) {
                    cc.log(response.drawResult);
                    self.targetID = response.drawResult;
                } else {
                    self.targetID = 3;
                }
            } else {
                self.targetID = 3;
            }
        };
        request.open("GET", url, true);
        request.send(null);
        this.spinBtn.node.on(cc.Node.EventType.TOUCH_END, function (event) {
            cc.log("begin spin");
            if (this.wheelState !== 0) {
                return;
            }
            this.decAngle = 2 * 360;  // 减速旋转两圈
            this.wheelState = 1;
            this.curSpeed = 0;
            this.spinTime = 0;
            // var act = cc.rotateTo(10, 360*10);
            // this.wheelSp.node.runAction(act.easing(cc.easeSineInOut()));
        }.bind(this));
    },

    start: function () {
        // cc.log('....start');
    },

    caculateFinalAngle: function (targetID) {
        this.finalAngle = 360 - this.targetID * this.gearAngle + this.defaultAngle;
        if (this.springback) {
            this.finalAngle += this.gearAngle;
        }
    },
    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        if (this.wheelState === 0) {
            return;
        }
        // cc.log('......update');
        // cc.log('......state=%d',this.wheelState);

        // 播放音效有可能卡
        this.effectFlag += this.curSpeed;
        if (!cc.sys.isBrowser && this.effectFlag >= this.gearAngle) {
            if (this.audioID) {
                // cc.audioEngine.pauseEffect(this.audioID);
            }
            // this.audioID = cc.audioEngine.playEffect(this.effectAudio,false);
            this.audioID = cc.audioEngine.playEffect(cc.url.raw('resources/Sound/game_turntable.mp3'));
            this.effectFlag = 0;
        }

        if (this.wheelState == 1) {
            // cc.log('....加速,speed:' + this.curSpeed);
            this.spinTime += dt;
            this.wheelSp.node.rotation = this.wheelSp.node.rotation + this.curSpeed;
            if (this.curSpeed <= this.maxSpeed) {
                this.curSpeed += this.acc;
            }
            else {
                if (this.spinTime < this.duration) {
                    return;
                }
                // cc.log('....开始减速');
                //设置目标角度
                var Config = require("Config");
                this.finalAngle = Config.gearInfo[this.targetID];
                this.maxSpeed = this.curSpeed;
                if (this.springback) {
                    this.finalAngle += this.gearAngle;
                }
                this.wheelSp.node.rotation = this.finalAngle;
                this.wheelState = 2;
            }
        }
        else if (this.wheelState == 2) {
            // cc.log('......减速');
            var curRo = this.wheelSp.node.rotation; //应该等于finalAngle
            var hadRo = curRo - this.finalAngle;
            this.curSpeed = this.maxSpeed * ((this.decAngle - hadRo) / this.decAngle) + 0.2;
            this.wheelSp.node.rotation = curRo + this.curSpeed;

            if ((this.decAngle - hadRo) <= 0) {
                // cc.log('....停止');
                this.wheelState = 0;
                this.wheelSp.node.rotation = this.finalAngle;
                if (this.springback) {
                    //倒转一个齿轮
                    // var act = new cc.rotateBy(0.6, -this.gearAngle);
                    var act = cc.rotateBy(0.6, -this.gearAngle);
                    var seq = cc.sequence(cc.delayTime(0.2), act, cc.callFunc(this.showRes, this));
                    this.wheelSp.node.runAction(seq);
                }
                else {
                    this.showRes();
                }
            }
        }
    },
    showRes: function () {
        if (this.targetID === 0) {
            cc.director.loadScene("firstPrize");
        } else if (this.targetID === 1) {
            cc.director.loadScene("secondPrize");
        } else if (this.targetID === 2) {
            cc.director.loadScene("thirdPrize");
        } else {
            cc.director.loadScene("prizelessA");
        }
    }
});
