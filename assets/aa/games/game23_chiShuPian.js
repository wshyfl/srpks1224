

cc.Class({
    extends: cc.Component,

    properties: {
        mouth: cc.Node,
        shuPian: cc.Node,
        suiZha: cc.Node,
        sprArr: [cc.SpriteFrame]
    },

    onLoad() {
        this.initCollision();
        AD.game23 = this;
        this.mouth.active = false;
        this.node.on(cc.Node.EventType.TOUCH_START, (event, type) => {

            let _pos = this.node.convertToNodeSpaceAR(event.getLocation());
            this.mouth.position = _pos;

            this.mouth.active = true;

        }, this)
        this.node.on(cc.Node.EventType.TOUCH_END, (event, type) => {
            this.mouth.active = false;
        }, this)
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, (event, type) => {
            this.mouth.active = false;
        }, this)
    },

    createSuiZha(_pos, _w, _h) {
        var _suiZha = cc.instantiate(this.suiZha);
        _suiZha.parent = this.node;
        _suiZha.x = _pos.x + Tools.random(-_w, _w);
        _suiZha.y = _pos.y + Tools.random(-_h, _h);
        _suiZha.getComponent(cc.Sprite).spriteFrame = this.sprArr[Tools.random(0, this.sprArr.length - 1)];
        _suiZha.angle = Tools.random(0, 360);
        _suiZha.scale = Tools.random(20, 60) * 0.01
        var _rate = Tools.random(10, 30) * 0.1;
        cc.tween(_suiZha)
            .by(_rate * 0.1, { y: -150 * _rate, opacity: 0 })
            .call(() => {
                _suiZha.destroy();
            })
            .start();
    },
    check() {
        var _reset = true;
        for (var i = 0; i < this.shuPian.children.length; i++) {
            if (this.shuPian.children[i].active) {
                _reset = false;
                break;
            }
        }
        if (_reset) {
           
            this.scheduleOnce(() => {
                this.shuPian.x = 720;
                this.shuPian.angle = Tools.random(0,360)
                for (var i = 0; i < this.shuPian.children.length; i++) {
                    this.shuPian.children[i].active = true;
                }
                cc.tween(this.shuPian)
                    .to(0.5, { x: 0 })
                    .start();
            }, 1)
        }
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
