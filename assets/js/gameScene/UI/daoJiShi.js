

cc.Class({
    extends: cc.Component,

    properties: {
        sprArr: [cc.SpriteFrame],
        gameTips: cc.Node,
        gameGuide: cc.Node,
    },

    onLoad() {
        this.gameTips.active = false;
        this.gameGuide.active = false;
        this.zheZhao = cc.find("zheZhao", this.node);
        this.zheZhao.active = false; this.zheZhao.opacity = 0;
        this.numLabel = cc.find("num", this.node);
        this.numLabel.scale = 0;


        cc.director.on("重置倒计时", (...second) => {
            var _hadGuide = globalData.getGuideState(window.modeType);
            if (_hadGuide) {
                if (second[0]) {
                    this.reset(second[0]);
                }
                else
                    this.reset();
            }
            else {
                this.gameTips.active = true;
                if (second[0])
                    this.gameTips.getComponent("gameTips").reset()
            }
        }, this)
    },

    start() {

    },

    reset(...second) {
        if (second[0]) {
            this.node.active = false;
            cc.director.emit("倒计时结束");
            this.gameGuide.active = true;
            return;
        }
        this.zheZhao.active = true;
        cc.tween(this.zheZhao)
            .to(0.2, { opacity: 120 })
            .start();
        // cc.tween(this.numLabel)
        //     .to(0.2, { scale: 1 })
        //     .start();
        this.numLabel.scale = 0;
        this.num = 4;
        var _func = () => {
            this.num--;
            if (this.num >= 1)

                AD.audioMng.playSfx("秒")
            this.numLabel.getComponent(cc.Sprite).spriteFrame = this.sprArr[this.num - 1];
            cc.tween(this.numLabel)
                .to(0.15, { scale: 1 })
                .delay(0.2)
                .to(0.15, { scale: 0 })
                .start();

            if (this.num == 1) {
                this.unschedule(_func);
                cc.tween(this.numLabel)
                    .delay(0.5)
                    .call(() => {
                        AD.audioMng.playSfx("go")
                    })
                    .to(0.2, { scale: 0 })
                    .call(() => {
                        cc.director.emit("倒计时结束");
                        this.gameGuide.active = true;
                    })
                    .start();
                cc.tween(this.zheZhao)
                    .delay(0.5)
                    .to(0.2, { opacity: 0 })
                    .call(() => {
                        this.zheZhao.active = false;
                    })
                    .start();
            }
        };
        this.schedule(_func, 0.5, 2)
    },
    // update (dt) {},
});
