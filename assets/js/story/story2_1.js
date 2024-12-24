

cc.Class({
    extends: cc.Component,

    properties: {
        cameraNode: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.human = cc.find("human", this.node);
        this.key = cc.find("key", this.node);
        this.suo = cc.find("suo", this.node);

        AD.couldClear = false;//
    },

    start() {
        cc.director.emit("人物待机坐");
        AD.human.biaoQing("生气");

        this.scheduleOnce(function () {
            AD.gameScene.createDialog("匪徒把我绑起来了", config.roleType.HUMAN);
            this.scheduleOnce(function () {

                AD.gameScene.createDialog("我得想办法逃出去", config.roleType.HUMAN);
                AD.couldClear = true;//
            }, 2);
        }, 1);


        //被擦干净了
        cc.director.on("完成", () => {
            AD.gameScene.wipUp();

            this.scheduleOnce(function () {
                this.keyUp();

            }, 1)
        }, this);
    },
    //本关完成
    complete() {
        this.scheduleOnce(function () {
            AD.gameScene.win();
        }, 2.5);
    },
    //找到钥匙--解锁
    keyUp() {
        cc.tween(this.key)
            .to(0.2, { angle: 0 })
            .to(0.6, { x: this.suo.x + 100, y: this.suo.y - 10 })
            .delay(0.6)
            .to(0.5, { scale: 0.85 })
            .delay(0.5)
            .to(0.2, { x: this.suo.x + 30, y: this.suo.y - 10 })
            .call(() => {
                this.suo.active = false;
            })
            .delay(0.5)
            .call(() => {
                this.key.scale = 0;
                AD.human.biaoQing("开心");
                this.complete();
            })
            .start();
    },
    // update (dt) {},
});
