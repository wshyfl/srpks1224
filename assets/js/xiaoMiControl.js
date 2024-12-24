
cc.Class({
    extends: cc.Component,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        if (AD.chanelName == "android") {
            if (AD.xiaoMiShow) {
                this.node.active = true;
            } else {
                this.node.active = false;
            }
        }
    },

    // update (dt) {},
});
