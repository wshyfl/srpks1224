

cc.Class({
    extends: cc.Component,

    properties: {
        isHeZuo: false,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        this.node.active = (this.isHeZuo == window.isHeZuo);
    },

    // update (dt) {},
});
