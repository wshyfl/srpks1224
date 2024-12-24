

cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        cc.tween(this.node)
        .repeatForever(
            cc.tween()
            .to(1,{opacity:0})
            .to(1,{opacity:255})
        )
        .start();
        
    },

    // update (dt) {},
});
