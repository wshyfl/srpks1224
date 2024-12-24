
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        waWa:cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.initCollision();
        this.waWa.on(cc.Node.EventType.TOUCH_START,(event)=>{
            this.waWa.getComponent(cc.RigidBody).type = cc.RigidBodyType.Static;
        },this)
        this.waWa.on(cc.Node.EventType.TOUCH_MOVE,(event)=>{
            this.waWa.x+=event.getDelta().x;
            this.waWa.y+=event.getDelta().y;
        },this)
        this.waWa.on(cc.Node.EventType.TOUCH_END,(event)=>{
            this.waWa.getComponent(cc.RigidBody).type = cc.RigidBodyType.Dynamic;
        },this)
        this.waWa.on(cc.Node.EventType.TOUCH_CANCEL,(event)=>{
            this.waWa.getComponent(cc.RigidBody).type = cc.RigidBodyType.Dynamic;
        },this)
    },

    start () {
        this.di.y = -cc.winSize.height/2-this.di.height/2
    },

    initCollision() {
        //重力碰撞初始化
        cc.director.getCollisionManager().enabled = true;
        cc.director.getPhysicsManager().enabled = true;
        cc.director.getPhysicsManager().gravity = cc.v2(0, -1000);//重力速度  -640代表 每秒移动640像素

        //     cc.director.getPhysicsManager().debugDrawFlags = cc.PhysicsManager.DrawBits.e_aabbBit |
        // cc.PhysicsManager.DrawBits.e_pairBit |
        // cc.PhysicsManager.DrawBits.e_centerOfMassBit |
        // cc.PhysicsManager.DrawBits.e_jointBit |
        // cc.PhysicsManager.DrawBits.e_shapeBit
        // ;

        //普通碰撞初始化
        var manager = cc.director.getCollisionManager();
        manager.enabled = true;
        // m
    }
    // update (dt) {},
});
