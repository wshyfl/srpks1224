

cc.Class({
    extends: cc.Component,

    properties: {
        effect:cc.Node,
    },

    // onLoad () {},

    start () {
        this.node.on(cc.Node.EventType.TOUCH_START,(event)=>{
            let point = cc.v2(event.touch.getLocation().x ,
            event.touch.getLocation().y );
            var _pos = this.node.convertToNodeSpaceAR(point);
            var _effect = cc.instantiate(this.effect);
            _effect.parent = this.node;
            _effect.position = _pos;
            _effect.angle = Tools.random(0,360);
            _effect.scale = Tools.random(50,100)*0.01;
            AD.audioMng.playSfx("玻璃打碎");
        },this)
    },

    // update (dt) {},
});
