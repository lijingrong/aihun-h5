
cc.Class({
    extends: cc.Component,

    properties: {
        // 重力感应
        cows: {
            default: null,
            type: cc.Node
        },
        distance: 0,  // 移动的单位距离，andriod 设为 20；iphone 设为 10
        shakeThreshold: 0,  // 摇动达到的临界值
        standardDistance: 0, // 两物体间标准参考距离
        minScale: 0, // 最小缩放值

        // 倒计时进度条
        cdSpeed: 0,
        cdTime: 0,
        progressBar: {
            default: null,
            type: cc.ProgressBar
        },

        // 场景切换
        failScene: "",
        singleSucessScene: "",
        doubleSucessScene: "",
    },

    onLoad() {
        // 重力感应
        this._last_update_time = 0; 
        this._time = 10;   // 摇动时间最小间隔
        this._scale = 1.0;  // 缩放值
        cc.systemEvent.setAccelerometerEnabled(true);
        cc.systemEvent.on(cc.SystemEvent.EventType.DEVICEMOTION, this.onDeviceMotionEvent, this);

        // 进度条
        this.progressBar.progress = 1.0;
        this._pingpong = true;  // 进度变动控制
    },

    onDestroy() {
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
                if (this._scale <= this.minScale) {
                    this._scale = this.minScale;
                } else {
                    this._scale = (this.cows.y - this.node.y) / this.standardDistance;
                }

                var action = cc.moveTo(0.25, this.node.x, this.node.y + (speed / this.shakeThreshold) * this.distance);
                var scale = cc.scaleTo(0.25, this._scale);
                this.node.runAction(cc.spawn(action, scale));  // 移动加缩放
            }
            last_acc_x = acc_x;
            last_acc_y = acc_y;
            last_acc_z = acc_z;
        }
    },

    /** 当碰撞产生的时候调用 */
    onCollisionEnter: function (other, self) {
        this.unschedule(this.callback);
        this.finishGame(this.singleSucessScene);
    },

    start() {
        /** 倒计时开始 */
        this.callback = function () {
            // 当时间小于等于0，停止计时器
            if (this.cdTime <= 0) {
                this.unschedule(this.callback);

                this.finishGame(this.failScene);
            }
            if (this.cdTime == 3) {
                cc.log("播放滴滴声");
            }
            // cc.log(this.cdTime);
            this.cdTime--;
        };
        this.schedule(this.callback, 1);
        /** 倒计时结束 */

        /** 碰撞体系代码 */
        var manager = cc.director.getCollisionManager();
        manager.enabled = true;
    },

    finishGame: function (sceneName) {
        this._pingpong = false;
        this.onDestroy();
        // 切换场景
        cc.director.loadScene(sceneName);
    },

    update(dt) {
        this._updateProgressBar(this.progressBar, dt);
    },

    /** 进度条 */
    _updateProgressBar: function (progressBar, dt) {
        var progress = progressBar.progress;
        if (this._pingpong) {
            progress -= dt * this.cdSpeed;
        }
        progressBar.progress = progress;
    },

});
