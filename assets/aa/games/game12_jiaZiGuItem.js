

cc.Class({
    extends: cc.Component,

    properties: {
        index: 0,
        biggerScale: 0.02,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        this.node.opacity = 0;
        this.tempScale = this.node.parent.scale;
        this.node.on(cc.Node.EventType.TOUCH_START, () => {
            cc.tween(this.node.parent)
                .to(0.05, { scale: this.tempScale + this.biggerScale })
                .to(0.05, { scale: this.tempScale })
                .call(() => {
                    AD.audioMng.playSfx("架子鼓", this.index);
                })
                .start();
        }, this);
    },

    // update (dt) {},
});
