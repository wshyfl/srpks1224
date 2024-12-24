

cc.Class({
    extends: cc.Component,

    properties: {
        ball: cc.Node,
        zhen: cc.Node,
        num: cc.Label,
        
  
        
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.zhen.scale = 0;
        this.node.on(cc.Node.EventType.TOUCH_START, () => {
            if (this.gameOverNow == false)
                cc.director.emit("发射");


        }, this);
        AD.game21 = this;
        this.createNewZhen();
        this.initCollision();

        this.wuDi = false;
        this.gameOverNow = false;
        cc.director.on("游戏结束", () => {
            if (this.gameOverNow == false) {
                this.gameOverNow = true;
                cc.tween(this.ball)
                    .repeat(5,
                        cc.tween()
                            .to(0.1, { opacity: 0 })
                            .to(0.1, { opacity: 255 })
                    )
                    .delay(0.5)
                    .call(() => {
                      this.reset();
                    })
                    .start();
            }
        }, this);

        this.numNow=0;
        cc.director.on("增加",()=>{
            this.numNow++;
            this.num.string = this.numNow;
        },this);
    },

    reset() {
        cc.director.emit("重置");
        // this.createNewZhen();
        this.gameOverNow = false;
        this.numNow=0;
        this.num.string = this.numNow;
    },
    btnCallBack(event,type){
        switch(type){
            case "普通":
                this.wuDi = false;
                this.reset();
                break;
            case "无敌":
                this.wuDi = true;
                this.reset();
                break;
        }
    },
    createNewZhen() {


        var _zhen = cc.instantiate(this.zhen);
        _zhen.parent = this.zhen.parent;
        _zhen.scale = 1;
        _zhen.getComponent("game21_jianFengChaZhen_zhen").reset();
    },
    initCollision() {
        //重力碰撞初始化
        // cc.director.getCollisionManager().enabled = true;
        // cc.director.getPhysicsManager().enabled = true;
        // cc.director.getPhysicsManager().gravity = cc.v2(0, 0);//重力速度  -640代表 每秒移动640像素


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
    },
    update(dt) {
        if (this.gameOverNow == false)
            this.ball.angle += 120 * dt;
    },
});
