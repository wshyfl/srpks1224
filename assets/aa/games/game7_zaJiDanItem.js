

cc.Class({
    extends: cc.Component,

    properties: {
        ballSpr: [cc.SpriteFrame],

        tuAn: [cc.SpriteFrame],
    },
    // onLoad () {},

    start() {
        
    },
    reset(_pos) {

        this.index = Tools.random(0, 3);
        

        this.node.scale = 3;

        var _left = Tools.random(0, 1);
        if (_left == 0)
            _left = -1;

        // this.node.postion = cc.v2(1800, Tools.random(100, 400));
        this.node.x = _left * 800;
        this.node.y = _pos.y + Tools.random(100,200);
        cc.tween(this.node)
            .to(0.5, { position: _pos,scale:1,angle:_left*Tools.random(360,600) },{easing:"sineIn"})
            .call(()=>{
                this.bomb();
            })
            .start();
    },
    bomb() {
       
        this.node.getComponent(cc.Sprite).spriteFrame = this.tuAn[0];
        cc.tween(this.node)
        .delay(5)
        .to(2,{opacity:0})
        .call(()=>{
            this.node.destroy();
        })
        .start();
        this.node.parent.getComponent("game7_zaJiDan").createDanKe(this.node.position)
        // this.node.children[0].parent = this.node.parent;
        // cc.tween(this.node.children[0])
        // .delay(Tools.random(10,20)*0.1)
        // .by(1,{y:-1650},{easing:"sineIn"})
        // .call(()=>{
        //     this.node.children[0].destroy();
        // })
        // .start();
    }

    // update (dt) {},
});
