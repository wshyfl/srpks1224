

cc.Class({
    extends: cc.Component,

    properties: {
        ballEffect:cc.Prefab,
        
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.node.on(cc.Node.EventType.TOUCH_START,(event)=>{
            let point = cc.v2(event.touch.getLocation().x ,
            event.touch.getLocation().y );
            var _pos = this.node.convertToNodeSpaceAR(point);
            var _effect = cc.instantiate(this.ballEffect);
            _effect.parent = this.node;
            _effect.getComponent("game11_shuiQiuBall").reset(_pos);
        },this)
    },

    // update (dt) {},
});
