

cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.node.y = 0;
        var _num = this.random(10000,50000);
        this.node.getComponent(cc.Label).string = _num;
    },
//获得随机整数 上下限都包括
    random(lower, upper) {
        return Math.floor(Math.random() * (upper - lower + 1)) + lower;
    },
    // update (dt) {},
});
