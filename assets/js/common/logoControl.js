
cc.Class({
    extends: cc.Component,

    properties: {
        targetChanel: "",
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        if(this.targetChanel.indexOf(AD.chanelName)==-1)
        this.node.active = false;
    },

    start() {
        
    },

    // update (dt) {},
});
