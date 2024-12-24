

cc.Class({
    extends: cc.Component,

    properties: {
        sprArr:[cc.SpriteFrame]
    },
    onLoad () {
        this.die = false;
        this.node.angle =90;
        if(Tools.random(0,1)==0)
        this.node.angle =-90;
        var _direciton = 1;
        if(this.node.angle==90)
        _direciton = -1;

        this.node.on(cc.Node.EventType.TOUCH_START,(event)=>{
            if(this.die)return
            this.die = true;
            AD.audioMng.playSfx("拍黄瓜");
            var _pos = this.node.parent.convertToNodeSpaceAR(event.getLocation());
            cc.director.emit("拍黄瓜",cc.v2(this.node.x+100*_direciton,this.node.y));
            this.scheduleOnce(()=>{
                this.breakNow();
            },0.1)
        },this);
        this.node.x =720;
        cc.tween(this.node)
        .to(0.3,{x:0},{easing:"sineOut"})
        .call(()=>{

        })
        .start();
    },

    start () {

    },
    breakNow(){
        this.node.getComponent(cc.Sprite).enabled = false;
        this.node.children[0].active = true;
        this.node.zIndex = -1;
        // this.node.children[0].parent = this.node.parent;
        // var _pos = this.node.children[0].parent.convertToNodeSpaceAR(this.node.children[0].position);

        this.node.children[0].angle = Tools.random(0,360);
        this.node.children[1].active = true;
        var _direciton = 1;
        if(this.node.angle==90)
        _direciton = -1;
        cc.tween( this.node.children[1])
        .delay(1)
        .by(0.3,{y:-720*_direciton},{easing:"sineIn"})
        .call(()=>{
            cc.director.emit("下一波");
        })
        .start();

        cc.tween(this.node.children[0])
        .delay(1)
        .to(1,{opacity:0})
        .call(()=>{
            this.node.destroy();
        })
        .start();
    },
    // update (dt) {},
});
