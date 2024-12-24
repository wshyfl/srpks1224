

cc.Class({
    extends: cc.Component,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        this.node.active = (AD.chanelName == "oppo");
        if (AD.chanelName == "oppo" && AD.wuDianRate == 20) {
            this.node.active = true;
        } else {
            this.node.active = false;
        }
    },
    btnCallBack(event, type) {
        AD.audioMng.playSfx("按钮");
        switch (type) {
            case "更多游戏":
                AD.moreGame();
                break;
        }
    }
    // update (dt) {},
});
