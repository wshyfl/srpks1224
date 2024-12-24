

cc.Class({
    extends: cc.Component,

    properties: {
        neiKu: cc.Node,
        sprsParent: cc.Node,
        targetNode: cc.Node,
        up: cc.Node,
        down: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.initCollision();
        AD.game16 = this;
        this.sprArr = new Array();
        for (var i = 0; i < this.sprsParent.children.length; i++) {
            var _spr = this.sprsParent.children[i].getComponent(cc.Sprite).spriteFrame;
            this.sprArr.push(_spr);
        }
        // cc.tween(this.targetNode)
        //     .repeatForever(
        //         cc.tween()
        //             .to(0.5, { opacity: 180 })
        //             .to(0.5, { opacity: 255 })
        //     )
        //     .start()
        
        cc.director.emit("找到了",()=>{
            cc.tween(this.targetNode)
            .to(0.2,{opacity:0})
            .to(0.2,{opacity:255})
            .to(0.2,{opacity:0})
            .to(0.2,{opacity:255})
            .to(0.2,{opacity:0})
            .to(0.2,{opacity:255})
            .to(0.2,{opacity:0})
            .to(0.2,{opacity:255})
            .start()
        },this);
    },

    start() {

        this.reset();
    },

    reset() {


        AD.game16.hadCreateTarget = false;
        AD.game16.targetSprIndex = Tools.random(0, this.sprsParent.children.length - 1);
        AD.game16.targetSpr = this.sprArr[this.targetSprIndex];
        this.targetNode.getComponent(cc.Sprite).spriteFrame = this.targetSpr;

        //生成内裤
        if (cc.find("neiKuParent", this.node).children.length == 1) {
            for (var i = 0; i < 100; i++) {
                var _neiKu = cc.instantiate(this.neiKu);
                _neiKu.parent = cc.find("neiKuParent", this.node);
            }
        }
        for (var i = 0; i < cc.find("neiKuParent", this.node).children.length; i++)
            cc.find("neiKuParent", this.node).children[i].getComponent("game16_zhaoNeiKu_evelope").reset();
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
        // var manager = cc.director.getCollisionManager();
        // manager.enabled = true;
        // m
    }

    // update (dt) {},
});
