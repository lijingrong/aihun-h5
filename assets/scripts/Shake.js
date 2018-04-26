
cc.Class({
    extends: cc.Component,

    properties: {
        loadNewScene: "",
        shakeThreshold: 0,  // 摇动达到的临界值
    },

    onLoad() {
        // 重力感应
        this._last_update_time = 0;
        this._time = 10;   // 摇动时间最小间隔
        this._enableDeviceMotion();
    },

    /** 启用重力感应 */
    _enableDeviceMotion() {
        cc.systemEvent.setAccelerometerEnabled(true);
        cc.systemEvent.on(cc.SystemEvent.EventType.DEVICEMOTION, this.onDeviceMotionEvent, this);
    },

    /** 销毁重力感应 */
    _destroyDeviceMotion() {
        cc.systemEvent.setAccelerometerEnabled(false);
        cc.systemEvent.off(cc.SystemEvent.EventType.DEVICEMOTION, this.onDeviceMotionEvent, this);
    },

    /** 重力感应调用 */
    onDeviceMotionEvent(event) {
        var acc_x = 0, acc_y = 0, acc_z = 0, last_acc_x = 0, last_acc_y = 0, last_acc_z = 0;
        var _cur_time = new Date().getTime();
        if ((_cur_time - this._last_update_time) > this._time) {
            var _diff_time = _cur_time - this._last_update_time;
            this._last_update_time = _cur_time;
            acc_x = event.acc.x;
            acc_y = event.acc.y;
            acc_z = event.acc.z;

            var speed = (Math.abs(acc_x + acc_y + acc_z - last_acc_x - last_acc_y - last_acc_z) / _diff_time * 10000).toFixed(2);

            if (speed > this.shakeThreshold) {
                this.togetherShake();
            }
            last_acc_x = acc_x;
            last_acc_y = acc_y;
            last_acc_z = acc_z;
        }
    },

    /** 摇动时提交后台*/
    togetherShake() {
        var Config = require("Config");
        var self = this;
        var url = Config.domain + "/aihun/postSharkTime";
        var params = "gameTeamId=" + Config.gameTeamId + "&uid=" + Config.uid  + "&userId=" + Config.uid;
        var request = cc.loader.getXMLHttpRequest();
        request.onreadystatechange = function () {
            if (request.readyState == 4 && (request.status >= 200 && request.status < 400)) {
                var response = JSON.parse(request.responseText);
                if (response.code === 1) {
                    cc.director.loadScene(self.loadNewScene);
                }
            }
        };
        request.open("POST", url, true);
        request.setRequestHeader("CONTENT-TYPE", "application/x-www-form-urlencoded");
        request.send(params);
    },

    start() {

    },

    // update (dt) {},
});
