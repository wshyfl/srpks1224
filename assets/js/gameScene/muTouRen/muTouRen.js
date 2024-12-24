

cc.Class({
    extends: cc.Component,

    properties: {
        touchDown: cc.Node,
        touchUp: cc.Node,
        sfxArr: {
            default: [],
            type: [cc.AudioClip]
        }
    },

    // onLoad () {},

    start() {
        window.muTouRen = this;
        this.beginNow = false;
        this.isAI = window.isAI;
        cc.director.on("倒计时结束", this.beginGame, this);
        this.scheduleOnce(() => {
            cc.director.emit("重置倒计时",true);
        }, 0.1);
        // this.beginGame();
        cc.director.on("木头人开始", () => {
            this.beginNow = true;
            this.initTouch();
        }, this)
        this.sfxIndex0 = -1;
        this.sfxIndex1 = -1;
    },
    beginGame() {
     
        this.playSfx("陪我玩");
    },


    initTouch() {
        this.couldTouchDown = true;
        this.couldTouchUp = true;
        this.touchDown.on(cc.Node.EventType.TOUCH_START, this.onTouchStart0, this);
        this.touchDown.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd0, this);
        this.touchDown.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchEnd0, this);
        if (!this.isAI) {
            this.touchUp.on(cc.Node.EventType.TOUCH_START, this.onTouchStart1, this);
            this.touchUp.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd1, this);
            this.touchUp.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchEnd1, this);
        }
        else {

        }

    },
    onTouchStart0(event) {
        if (!this.beginNow) return;
        cc.director.emit("移动", true);
    },
    onTouchEnd0(event) {
        cc.director.emit("停止", true);
    },

    onTouchStart1(event) {
        if (!this.beginNow) return;
        cc.director.emit("移动", false);
    },
    onTouchEnd1(event) {
        cc.director.emit("停止", false);
    },
    playSfx(_name, ...index) {
        var _sfxIndex = -1;
        var _isLoop = false;
        var _volume = 1;
        switch (_name) {

            case "木头人":
                _sfxIndex = this.random(0, 2);
                break;
            case "陪我玩":
                _sfxIndex = 3;
                break;
        }
        if (_sfxIndex != -1) {
            var _id = cc.audioEngine.play(this.sfxArr[_sfxIndex], _isLoop, _volume);

            switch (_name) {
                case "木头人":
                    this.sfxIndex0 = _id;
                    cc.audioEngine.setFinishCallback(_id, function () {
                        
                        cc.director.emit("123木头人音效播放完毕");
                    });
                    break;
                case "陪我玩":
                    this.sfxIndex1 = _id;
                    cc.audioEngine.setFinishCallback(_id, function () {
                        cc.director.emit("木头人开始");
                    });
                    break;
            }
        }
    },
    stopSfx(_name){
        switch (_name) {
            case "木头人":
                cc.audioEngine.stop(this.sfxIndex0);
                break;
            case "陪我玩":
                cc.audioEngine.stop(this.sfxIndex1);
                break;
        }
    },
    onDisable(){
        this.stopSfx("木头人");
        this.stopSfx("陪我玩");
    },
    random(lower, upper) {
        return Math.floor(Math.random() * (upper - lower + 1)) + lower;
    },
    // update (dt) {},
});
