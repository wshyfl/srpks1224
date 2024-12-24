
cc.Class({
    extends: cc.Component,

    properties: {

    },

    onLoad() {
        this.node.on(cc.Node.EventType.TOUCH_START, this.touchstart, this)
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.touchMove, this)

        this.node.on(cc.Node.EventType.TOUCH_END, this.touchEnd, this)
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.touchEnd, this)
    },

    start() {

    },
    touchstart() {
        this.node.getComponent(cc.RigidBody).gravityScale = 0;

    },
    touchMove(event) {
        this.node.x += event.getDelta().x;
        this.node.y += event.getDelta().y;
    },
    touchEnd() {
        this.node.getComponent(cc.RigidBody).gravityScale = 1;

    },
    // update (dt) {},
    onBeginContact: function (contact, selfCollider, otherCollider) {
        if(Math.abs(this.node.getComponent(cc.RigidBody).linearVelocity.y)>400
        ||Math.abs(this.node.getComponent(cc.RigidBody).linearVelocity.x)>400)
        AD.audioMng.playSfx("木块");
    },
});
