

cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.node.opacity = 0;

    },
    onCollisionStay: function (other, self) {
        if(other.tag == 0)
        this.node.parent.parent.getComponent("tank_tank").couldFire = false;
    },
    onCollisionExit: function (other, self) {
        if(other.tag == 0)
        this.node.parent.parent.getComponent("tank_tank").couldFire = true;
    },
    // update (dt) {},
});
