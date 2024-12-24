

cc.Class({
    extends: cc.Component,

    properties: {
        sprDie: cc.SpriteFrame,
    },
    // onLoad () {},

    start() {

    },

    reset(_delayDuration, ...isAI) {
        this.couldBeHit = false;
        this.node.scale = 0;
        window.daDiShu.createEffect("出现", this.node.parent.position);
        this.actAll = cc.tween(this.node)
            .to(0.1, { scale: 1 })
            .call(() => {
                this.couldBeHit = true;
            })
            .delay(_delayDuration)
            .call(() => {
                this.couldBeHit = false;
            })
            .call(() => {

                window.daDiShu.createEffect("消失", this.node.parent.position);
            })
            .to(0.1, { scale: 0 })
            .call(() => {
                this.node.destroy();
            });
        this.actAll.start();

        this.actDie = cc.tween(this.node)
            .to(0.05, { scale: 1.1 })
            .to(0.05, { scale: 1 })
            .delay(0.8)
            .call(() => {

                window.daDiShu.createEffect("消失", this.node.parent.position);
            })
            .to(0.1, { scale: 0 })
            .call(() => {
                this.node.destroy();
            });
        if (isAI[0]) {
            //AI 判断
            var _maxNum = 100;//越大 越笨
            this.scheduleOnce(() => {
                if (this.couldBeHit) {
                    this.node.getComponent(cc.Sprite).spriteFrame = this.sprDie;
                    this.actAll.stop();
                    this.couldBeHit = false;
                    cc.director.emit("打中地鼠啦", (this.node.parent.y < 0));
                    this.actDie.start();
                    window.daDiShu.createEffect("击中", this.node.parent.position);
                }
            }, this.random(15, _maxNum) * 0.01)
        }
        else {
            this.node.on("touchstart", () => {
                if (this.couldBeHit) {
                    this.node.getComponent(cc.Sprite).spriteFrame = this.sprDie;
                    this.actAll.stop();
                    this.couldBeHit = false;
                    cc.director.emit("打中地鼠啦", (this.node.parent.y < 0));
                    window.daDiShu.createEffect("击中", this.node.parent.position);
                    this.actDie.start();
                }
            }, this)
        }

    },
    random(lower, upper) {
        return Math.floor(Math.random() * (upper - lower + 1)) + lower;
    },
    // update (dt) {},
});
