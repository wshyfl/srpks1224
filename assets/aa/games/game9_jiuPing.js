

cc.Class({
    extends: cc.Component,

    properties: {
        suiPianArr: [cc.SpriteFrame],
        anim: cc.Animation,
        effect: cc.Node,
        textLabel: cc.Label,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.initCollision();
        AD.game9 = this;
        this.suiPianPool = new cc.NodePool();

    },

    start() {
        this.anim.node.zIndex = 1;
        this.could = true;
        this.node.on(cc.Node.EventType.TOUCH_START, (event) => {
            if (!this.could) return;
            this.could = false;
            this.anim.play();

        }, this);
        this.numNow = 0;
        // this.act = cc.tween(this.textLabel.node)
        //     .to(0.1, { scale: 2.2 }, { easing: "sineOut" })
        //     .to(0.1, { scale: 2 }, { easing: "sineInOut" })
        //     .delay(1)
        //     .to(0.1, { scale: 0 }, { easing: "sineOut" });
        this.act = cc.tween(this.textLabel.node)
            // .to(0.1, { scale: 2 }, { easing: "sineOut" })
            .by(0.03, { y: 25 ,scale:0.5}, { easing: "sineInOut" })
            .by(0.03, { y: -25 ,scale:-0.5}, { easing: "sineInOut" })
            .by(0.03, { y: 10 ,scale:0.2}, { easing: "sineInOut" })
            .by(0.03, { y: -10 ,scale:-0.2}, { easing: "sineInOut" })
            .delay(1)
            .to(0.1, { scale: 0 }, { easing: "sineOut" })
            

        this.textLabel.node.scale = 0;
    },

    ceateEffect() {
        // var effectP = cc.instantiate(this.effect);
        // effectP.x = Tools.random(-100, 100) ;
        // effectP.y = Tools.random(-100, 0) ;
        // effectP.parent = this.node;
        // effectP.getComponent(cc.Sprite).spriteFrame = this.suiPianArr[Tools.random(0,3)];
        // effectP.getComponent("game9_suiPian").reset();
        for (var i = 0; i < 20; i++) {
            var effectP = cc.instantiate(this.effect);


            effectP.parent = this.node;
            effectP.getComponent(cc.Sprite).spriteFrame = this.suiPianArr[Tools.random(0, 3)];
            effectP.getComponent("game9_suiPian").reset();
        }


        this.numNow++;
        this.resetNum();
    },
    resetNum() {

        if (this.textLabel.node.scale == 0) {
            this.numNow = 1;
            this.textLabel.node.scale = 3;
            cc.tween(this.textLabel.node)
                .to(0.1, { scale: 2 }, { easing: "sineOut" })
                .start();

        }
        else {
            this.textLabel.node.scale = 2;
            this.act.stop();
            this.act.start();
        }
        this.textLabel.string = "x" + this.numNow;
        // this.textLabel.node.scale = 0;
        // this.act.stop();
        // this.act.start();
        cc.tween(cc.find("Canvas"))
        .to(0.03, { x: 1 ,scale:1.01}, { easing: "sineInOut" })
        .to(0.03, { x: -1 ,scale:0.99}, { easing: "sineInOut" })
        .to(0.03, { y: 1 ,scale:1.00}, { easing: "sineInOut" })
        .to(0.03, { y: -1 ,scale:1.0}, { easing: "sineInOut" })
        .start();
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
    },

    // update (dt) {},
});
