var Config = require("Config");

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
        audio: {
            default: null,
            url: cc.AudioClip,
        },

        // 场景切换
        singleFailScene: "",
        doubleFailScene: "",
        singleSucessScene: "",
        doubleSucessScene: "",
    },

    onLoad() {
        // 重力感应
        this._last_update_time = 0;
        this._time = 10;   // 摇动时间最小间隔
        this._scale = 1.0;  // 缩放值
        this._enableDeviceMotion();
        if (cc.sys.os === cc.sys.OS_ANDROID) {
            this.shakeThreshold = 2500;
        }

        this._is_collision = false;  // 是否碰撞
        
        // 进度条
        this.progressBar.progress = 1.0;
        this._pingpong = true;  // 进度变动控制
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
                if (this._scale <= this.minScale) {
                    this._scale = this.minScale;
                } else {
                    this._scale = (this.cows.y - this.node.y) / this.standardDistance;
                }

                var action = cc.moveTo(0.5, this.node.x, this.node.y + this.distance);
                var scale = cc.scaleTo(0.5, this._scale);
                this.node.runAction(cc.spawn(action, scale));  // 移动加缩放
            }
            last_acc_x = acc_x;
            last_acc_y = acc_y;
            last_acc_z = acc_z;
        }
    },

    /** 当碰撞产生的时候调用 */
    onCollisionEnter: function (other, self) {
        /** 碰撞后，self 物体快速移动与 other 物体 X 坐标相同的位置 */
        var moveAction = cc.moveTo(0.1, this.cows.x, this.node.y);
        this.node.runAction(moveAction);

        this._is_collision = true;

        /** 碰撞后切换下一场景 */
        if (Config.isSingle === 0) {  // 双人游戏时跳转
            this.saveGameState(1, this.doubleSucessScene);
        } else {
            this.finishGame(this.singleSucessScene);
        }
    },

    onDestroy: function () {
        cc.audioEngine.stop(this.didi);
    },

    stopMusic: function () {
        cc.audioEngine.stop(this.didi);
    },

    playMusic: function () {
        this.didi = cc.audioEngine.play(this.audio, true, 1);
    },

    start() {
        var self = this;
        /** 倒计时开始 */
        this.countDown = function () {
            // 当时间小于等于0，停止计时器
            if (self.cdTime <= 0 && !self._is_collision) {
                self.stopMusic();
                if (Config.isSingle === 0) {  // 双人游戏时跳转
                    self.saveGameState(0, self.doubleFailScene);
                } else {
                    self.finishGame(self.singleFailScene);
                }
            }
            if (self.cdTime == 3) {
                self.playMusic();
            }
            self.cdTime--;
        };
        this.schedule(this.countDown, 1);
        /** 倒计时结束 */

        /** 奶牛左右移动 */
        var _cows_x = this.cows.x;
        var cowsMoveAction = cc.sequence(
            cc.moveTo(0.5, _cows_x + 35, this.cows.y),
            cc.delayTime(0.3),
            cc.moveTo(0.5, _cows_x, this.cows.y),
            cc.moveTo(0.5, _cows_x - 35, this.cows.y),
            cc.delayTime(0.3),
            cc.moveTo(0.5, _cows_x, this.cows.y),
        );
        this.cows.runAction(cc.repeatForever(cowsMoveAction));  // 重复

        /** 碰撞体系代码 */
        var manager = cc.director.getCollisionManager();
        manager.enabled = true;
    },

    finishGame: function (sceneName) {
        this.unschedule(this.countDown);
        this._pingpong = false;
        this._destroyDeviceMotion();
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

    /** 双人模式下，游戏成功或失败，需要请求后台记录下状态 */
    saveGameState: function (state, nextScene) {
        var url = Config.domain + "/aihun/postGameStatus";
        var self = this;
        var request = cc.loader.getXMLHttpRequest();
        var params = "gameTeamId=" + Config.gameTeamId + "&userId=" + Config.uid + "&gameStatus=" + state;
        request.onreadystatechange = function () {
            if (request.readyState == 4 && (request.status >= 200 && request.status < 400)) {
                self.finishGame(nextScene);
            }
        };
        request.open("POST", url, true);
        request.setRequestHeader("CONTENT-TYPE", "application/x-www-form-urlencoded");
        request.send(params);
    },

});
