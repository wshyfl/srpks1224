

cc.Class({
    extends: cc.Component,

    properties: {
        ballEffect:cc.Node,
        danKe:cc.Node,
        
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.initCollision();
    },

    start () {
        this.node.on(cc.Node.EventType.TOUCH_START,(event)=>{
            let point = cc.v2(event.touch.getLocation().x ,
            event.touch.getLocation().y );
            var _pos = this.node.convertToNodeSpaceAR(point);
            var _effect = cc.instantiate(this.ballEffect);
            _effect.parent = this.node;
            _effect.getComponent("game7_zaJiDanItem").reset(_pos);
        },this)
    },

    createDanKe(_pos){
        
        AD.audioMng.playSfx("砸鸡蛋");
        var _effect = cc.instantiate(this.danKe);
        _effect.parent = this.node;
        _effect.position = _pos;
        _effect.zIndex = 1;
        _effect.angle = Tools.random(0,180);
        var _index = Tools.random(0,1);
        if(_index==0)_index =-1;
        cc.tween(_effect)
        .by(3,{angle:_index *Tools.random(1000,1600)},{easing:"sineIn"})
        .call(()=>{
            _effect.destroy();
        })
        .start()
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
