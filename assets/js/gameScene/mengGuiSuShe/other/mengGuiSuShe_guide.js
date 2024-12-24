
cc.Class({
    extends: cc.Component,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        this.second = 10;
        cc.tween(cc.find("tips_1", this.node))
        .delay(0.5)
            .to(0.2, { scaleY: 1 })
            .delay(2)
            .to(0.2, { scaleY: 0 })
            .start();
        this.schedule(() => {
            this.second--;
            if(this.second>=0)
            AD.audioMng.playSfx("大摆钟");
            if (this.second == 7) {
                cc.tween(cc.find("tips_2", this.node))
                    .to(0.2, { scaleY: 1 })
                    .delay(2)
                    .to(0.2, { scaleY: 0 })
                    .start();
            }
            if (this.second < 0)
                this.node.destroy();
            else {
                cc.find("num", this.node).getComponent(cc.Label).string = this.second;
            }
        }, 1)
    },

    // update (dt) {},
});
