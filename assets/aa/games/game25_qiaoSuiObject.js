

cc.Class({
    extends: cc.Component,

    properties: {
        objs:cc.Node,
        itemsPrefab: [cc.Prefab],
    },

    onLoad() {
        this.initCollision();
    },

    start() {

        cc.director.on("重置", () => {
            this.numSum--;
            if (this.numSum <= 0) {
                this.create();
            }
        }, this);
        this.index = 0;
        
        this.numSum = this.objs.childrenCount;
    },
    create() {
        var _obj = cc.instantiate(this.itemsPrefab[this.index]);
        this.numSum = _obj.childrenCount;
        _obj.parent = this.node;
        this.index++;
        if (this.index >= this.itemsPrefab.length)
            this.index = 0;
    },

    initCollision() {
        //重力碰撞初始化
        cc.director.getCollisionManager().enabled = true;
        cc.director.getPhysicsManager().enabled = true;
        cc.director.getPhysicsManager().gravity = cc.v2(0, -2000);//重力速度  -640代表 每秒移动640像素

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
