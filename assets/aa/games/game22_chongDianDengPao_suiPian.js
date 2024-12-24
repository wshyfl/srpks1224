

cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.node.getComponent(cc.RigidBody).applyLinearImpulse(cc.v2(Tools.random(-800 , 800 ), Tools.random(800 ,1800)),
        this.node.getComponent(cc.RigidBody).getWorldCenter(), true);
    },

    // update (dt) {},
});
