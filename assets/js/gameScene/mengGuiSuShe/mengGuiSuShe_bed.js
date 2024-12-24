

cc.Class({
    extends: cc.Component,

    properties: {
        isDown: true,
        addScore:cc.Node,
        sprArr: [cc.SpriteFrame],
    },

    onLoad() {
        this.tips_upgrade = cc.find("tips_upgrade", this.node);
        this.tips_upgrade.active = false;



        this.bedLevel = 0;
        cc.director.on("床升级了", (_isDown) => {
            if (_isDown != this.isDown) return;
            if (this.bedLevel < 3) {
                window.mengGuiSuShe.createEffect("烟雾",this.node.position)
                this.bedLevel++;
                cc.find("bed", this.node).getComponent(cc.Sprite).spriteFrame = this.sprArr[this.bedLevel];
            }
            if (this.bedLevel < 3)
                this.tips_upgrade.active = (window.mengGuiSuShe.getCoinNum(this.isDown) >= window.mengGuiSuShe.data.bedData.castNum[this.bedLevel + 1])
            else
                this.tips_upgrade.active = false;
        }, this);
        this.node.on("touchstart", () => {

            if (this.bedLevel < 3) {
                cc.director.emit("升级床弹窗", this);
            }
        }, this);

        this.schedule(() => {
            if (this.bedLevel < 3)
                this.tips_upgrade.active = (window.mengGuiSuShe.getCoinNum(this.isDown) >= window.mengGuiSuShe.data.bedData.castNum[this.bedLevel + 1])
            else
                this.tips_upgrade.active = false;
        }, 1)
        
    },

    start() {
        cc.director.on("女鬼攻击", (_node, _hurtNum) => {
            if (_node == this.node) {
                window.mengGuiSuShe.createEffect("女鬼抓痕",this.node.position)
                this.node.destroy();
                cc.director.emit("角色受到攻击",this.isDown);
                AD.audioMng.playSfx("猛鬼失败");
            }
        }, this)
        this.schedule(() => {
            if (window.mengGuiSuShe.beginNow) {
                var _num = Math.pow(2, this.bedLevel + 1);
                window.mengGuiSuShe.setCoinNum(_num, this.isDown);
                this.createScoreEffect(_num)
            }
        }, 1)
    },
    createScoreEffect(_num) {
        var _effect = cc.instantiate(this.addScore);
        _effect.active = true;
        _effect.parent = this.node;
        _effect.getComponent(cc.Label).string = "+" + _num;
        _effect.position = cc.v2(0, 0);
        var _angle = 0;
        var _direction = 30;
        if (this.node.y > 0) {
            // _angle = 180;
            // _direction = -30;
        }
        _effect.angle = _angle;
        cc.tween(_effect)
            .by(0.3, { scale: 0.2, y:  _direction })
            .by(0.4, {  y: _direction *0.6 }, { easing: "sineOut" })
            .to(0.2,{opacity:0})
            .call(() => {
                _effect.destroy();
            })
            .start();
    },

    // update (dt) {},
});
