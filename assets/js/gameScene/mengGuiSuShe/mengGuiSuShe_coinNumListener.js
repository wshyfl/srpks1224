
cc.Class({
    extends: cc.Component,

    properties: {
        isDown: true,
    },

    // onLoad () {},

    start() {
        this.node.getComponent(cc.Label).string = window.mengGuiSuShe.getCoinNum(this.isDown);
        cc.director.on("猛鬼金币数量变化", (_isDown) => {
            if (_isDown == this.isDown)
                this.node.getComponent(cc.Label).string = window.mengGuiSuShe.getCoinNum(this.isDown);
        }, this)
    },

    // update (dt) {},
});
