

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

        this.index = Tools.random(0, 4);
        this.node.getComponent(cc.Sprite).spriteFrame = this.ballSpr[this.index];
        this.colorArr = [[179, 96, 226], [193, 2, 169], [47, 27, 156], [141, 189, 25], [206, 64, 14]];

        this.node.scale = 3;

        var _left = Tools.random(0, 1);
        if (_left == 0)
            _left = -1;

        // this.node.postion = cc.v2(1800, Tools.random(100, 400));
        this.node.x = _left * 800;
        this.node.y = _pos.y + Tools.random(100, 200);
        cc.tween(this.node)
            .to(0.5, { position: _pos, scale: 1, angle: _left * Tools.random(360, 600) }, { easing: "sineIn" })
            .call(() => {
                this.bomb();
            })
            .start();
    },
    bomb() {

        AD.audioMng.playSfx("水球");
        this.node.scale = Tools.random(90, 110) * 0.01;
        this.node.color = new cc.color(this.colorArr[this.index][0], this.colorArr[this.index][1], this.colorArr[this.index][2], 255)
        this.node.getComponent(cc.Sprite).spriteFrame = this.tuAn[Tools.random(0, 2)];
        cc.tween(this.node)
            .delay(5)
            .to(2, { opacity: 0 })
            .call(() => {
                this.node.destroy();
            })
            .start();
    }

    // update (dt) {},
});
