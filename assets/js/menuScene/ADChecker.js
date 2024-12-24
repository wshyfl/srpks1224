

cc.Class({
    extends: cc.Component,

    properties: {
        modeName: "猛鬼宿舍",
        isTimmer: false,
        targetNum: {
            default: 10,
            visible() {
                return this.isTimmer;
            },
        },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        var _unlocked = globalData.getModeUnlockState(this.modeName);
        this.node.active = !_unlocked;
        cc.director.on("解锁模式", () => {
            var _unlocked = globalData.getModeUnlockState(this.modeName);
            this.node.active = !_unlocked;
        }, this);
        if (this.isTimmer && _unlocked==false) {
            var _second = this.targetNum - globalData.data.onlineSecond;
            if(_second<=0){
                globalData.setModeUnlockState(this.modeName);
            }
            else 
            {
                this.node.getChildByName("timer").getComponent(cc.Label).string = this.getSecond2(_second) + "后解锁";
                this.schedule(() => {
                    var _second = this.targetNum - globalData.data.onlineSecond;
                    if (_second >= 0)
                        this.node.getChildByName("timer").getComponent(cc.Label).string = this.getSecond2(_second) + "后解锁";
                    if (_second == 0)
                        globalData.setModeUnlockState(this.modeName);
                }, 1)
            }           
        }
    },

    getSecond2(_secondNow, ...fenMiao) {

        var _hour = parseInt(_secondNow / 3600);
        var _hourLabel = null;
        if (_hour >= 10) {
            _hourLabel = _hour;
        }
        else
            _hourLabel = "0" + _hour;

        var _minite = parseInt((_secondNow - _hour * 3600) / 60);
        var _miniteLabel = null;
        if (_minite >= 10) {
            _miniteLabel = _minite;
        }
        else
            _miniteLabel = "0" + _minite;


        var _second = parseInt(_secondNow - _hour * 3600 - _minite * 60);
        var _secondLabel = null;
        if (_second >= 10) {
            _secondLabel = _second;
        }
        else
            _secondLabel = "0" + _second;

        // var _string = _hourLabel + ":" + _miniteLabel + ":" + _secondLabel;
        var _string = _miniteLabel + ":" + _secondLabel;
        // var _string = _secondLabel;
        // if (fenMiao[0]) {
        //     _string = _hourLabel + ":" + _miniteLabel + ":" + _secondLabel;
        // }
        return _string;
    },
    // update (dt) {},
});
