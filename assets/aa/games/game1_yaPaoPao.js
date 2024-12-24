// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        xiangPiCa: cc.Node,
        panel0: cc.Node,
        panel1: cc.Node,
        mode1Arr: [cc.SpriteFrame],
        mode2Arr: [cc.SpriteFrame],
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.xiangPiCa.active = false;
        AD.game1_yaPaoPao = this;
        this.initCollision();
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    },

    start() {
        for (var i = 0; i < this.panel0.childrenCount; i++) {
            var _line = parseInt(i / 7);
            if (_line % 2 == 0) {
                this.panel0.children[i].x -= 25.75;
                this.panel1.children[i].x -= 25.75;
            }
            else {
                this.panel0.children[i].x += 25.75;
                this.panel1.children[i].x += 25.75;
            }
        }

        this.reset(0);
    },
    reset(_panelIndex) {
        switch (_panelIndex) {
            case 0:
                for (var i = 0; i < this.panel0.childrenCount; i++)
                    this.panel0.children[i].getComponent("game1_item").reset();
                cc.tween(this.panel0)
                    .to(0.2, { x: 0 })
                    .start();
                cc.tween(this.panel1)
                    .to(0.2, { x: -850 })
                    .start();
                this.modeType = 0;
                this.modeNum = this.panel0.childrenCount;
                break;
            case 1:
                for (var i = 0; i < this.panel1.childrenCount; i++)
                    this.panel1.children[i].getComponent("game1_item").reset();
                cc.tween(this.panel1)
                    .to(0.2, { x: 0 })
                    .start();
                    cc.tween(this.panel0)
                    .to(0.2, { x: 850 })
                    .start();
                this.modeType = 1;
                this.modeNum = this.panel1.childrenCount;
                // console.log("胜利");
                // cc.director.emit("弹出胜利界面");
                break;
        }
    },

    onTouchStart(event) {
        this.xiangPiCa.active = true;
        let start_pos = this.node.convertToNodeSpaceAR(event.getLocation());
        this.xiangPiCa.x = start_pos.x;
        this.xiangPiCa.y = start_pos.y;


    },
    onTouchMove(event) {
        let start_pos = this.node.convertToNodeSpaceAR(event.getLocation());
        this.xiangPiCa.x = start_pos.x;
        this.xiangPiCa.y = start_pos.y;
    },
    onTouchEnd(event) {
        this.xiangPiCa.active = false;

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


    // update (dt) {},
});
