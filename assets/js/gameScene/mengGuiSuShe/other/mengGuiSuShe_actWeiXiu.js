

cc.Class({
    extends: cc.Component,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        cc.tween(this.node)
            .repeatForever(
                cc.tween()
                    .to(0.25, { angle: 15 },{easing:"sineInOut"})
                    .to(0.25, { angle: -15 },{easing:"sineInOut"})
            )
            .start();

    },

    // update (dt) {},
});
