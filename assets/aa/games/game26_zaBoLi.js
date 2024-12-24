
cc.Class({
    extends: cc.Component,

    properties: {
        item:cc.Prefab,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.initCollision();
    },

    start () {
        cc.director.on("下一个",()=>{
            this.next();
        },this)
    },
    next(){
        var _item = cc.instantiate(this.item);
        _item.parent = this.node;
        _item.x = 720;
        cc.tween(_item)
        .to(0.5,{x:0},{easing:"sineInOut"})
        .start();
    },
    initCollision() {
        //重力碰撞初始化
        cc.director.getCollisionManager().enabled = true;
        cc.director.getPhysicsManager().enabled = true;
        cc.director.getPhysicsManager().gravity = cc.v2(0, -3000);//重力速度  -640代表 每秒移动640像素

        //     cc.director.getPhysicsManager().debugDrawFlags = cc.PhysicsManager.DrawBits.e_aabbBit |
        // cc.PhysicsManager.DrawBits.e_pairBit |
        // cc.PhysicsManager.DrawBits.e_centerOfMassBit |
        // cc.PhysicsManager.DrawBits.e_jointBit |
        // cc.PhysicsManager.DrawBits.e_shapeBit
        // ;

        //普通碰撞初始化
        // var manager = cc.director.getCollisionManager();
        // manager.enabled = true;
        // m
    }

    // update (dt) {},
});
