// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        tuoLuo: cc.Node,
        laBa: cc.Node,
        iconNode: cc.Sprite,
        carIconArr: [cc.SpriteFrame],
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        // AD.game17=this;
        // this.targetAngle = 0;
        // this.speed = 0;
        // this.speedA = 0.1;
        // this.guanXingNow = false;
        this.laBa.on(cc.Node.EventType.TOUCH_START, this.touchStart, this)
        this.laBa.on(cc.Node.EventType.TOUCH_MOVE, this.touchMove, this)
        this.laBa.on(cc.Node.EventType.TOUCH_END, this.touchEnd, this)
        this.laBa.on(cc.Node.EventType.TOUCH_CANCEL, this.touchEnd, this)
        // this.angleTemp = 0;
        // this.initCollision();

        this.indexNow = Tools.random(0, this.carIconArr.length - 1);
        this.iconNode.spriteFrame = this.carIconArr[this.indexNow];
    },

    update(dt) {

        // this.tuoLuo.angle = this.targetAngle;


    },
    touchStart(event) {
        // this.guanXingNow = false;
        // this.speed = 0;
        // let point = cc.v2(event.touch.getLocation().x,
        //     event.touch.getLocation().y);
        // var _pos = this.node.convertToNodeSpaceAR(point);
        // this.yuanAngle = Tools.getAngle(_pos, this.tuoLuo.position) - this.targetAngle;
        // this.timeStart = Tools.getDate("millisecond");
        // this.angleYuan = this.yuanAngle;
        cc.tween(this.laBa)
            .to(0.1, { scale: 0.97 })
            .start();
        AD.audioMng.playSfx("汽车喇叭", this.indexNow)
    },
    touchMove(event) {
        // let point = cc.v2(event.touch.getLocation().x,
        //     event.touch.getLocation().y);
        // var _pos = this.node.convertToNodeSpaceAR(point);

        // this.targetAngle = Tools.getAngle(_pos, this.tuoLuo.position) - this.yuanAngle;
        // console.log(" this.tuoLuo.angle  " + this.tuoLuo.angle%90)

        // this.angleYuan = this.targetAngle;
    },
    touchEnd(event) {
        cc.tween(this.laBa)
            .to(0.1, { scale: 1 })
            .start();

    },
    initCollision() {
        //重力碰撞初始化
        // cc.director.getCollisionManager().enabled = true;
        // cc.director.getPhysicsManager().enabled = true;
        // cc.director.getPhysicsManager().gravity = cc.v2(0, -1000);//重力速度  -640代表 每秒移动640像素

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
});
