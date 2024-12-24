
cc.Class({
    extends: cc.Component,

    properties: {
        tipsDown: cc.Label,
        tipsUp: cc.Label,
    },

    // onLoad () {},

    onEnable() {
        this.tipsDown.string = this.tipsUp.string = globalData.getGuide(window.modeType, "玩法提示");
    },
    reset() {
        this.jump = true;
    },
    start() {

    },
    btnCallBack(event, type) {
        globalData.setGuideState(window.modeType);
        this.node.destroy();
        setTimeout(() => {
            if (this.jump == true)
                cc.director.emit("重置倒计时", true);
            else
                cc.director.emit("重置倒计时");
        }, 200);
    }

    // update (dt) {},
});
