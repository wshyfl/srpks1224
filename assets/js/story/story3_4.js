

cc.Class({
    extends: cc.Component,

    properties: {
        cameraNode: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.human = cc.find("human", this.node);
        this.cat = cc.find("cat", this.node);




        AD.couldClear = false;//
    },

    start() {

        cc.director.emit("人物走");
        cc.director.emit("猫趴着");

        cc.tween(this.human)
            .to(2, { x: -33 })
            .call(() => {
                cc.director.emit("人物待机");

            })
            .delay(0.5)
            .call(() => {
                AD.couldClear = true;//            
                AD.gameScene.createDialog("我的猫咪们都去哪了？", config.roleType.HUMAN);

            })
            .start();

        //被擦干净了
        cc.director.on("完成", () => {
            AD.gameScene.wipUp();

            cc.director.emit("猫待机");
            this.catAct();
            AD.audioMng.playSfx("猫")

        }, this);
    },
    //本关完成
    complete() {
        this.scheduleOnce(function () {
            AD.gameScene.win();
        }, 2.5);
    },
    catAct() {
        AD.gameScene.createDialog("你好小橘！", config.roleType.HUMAN);
        cc.tween(this.cat)
            .delay(1)

            .call(() => {
                cc.director.emit("猫走");
            })
            .to(1, { x: 74, y: -440 })
            .call(() => {
                cc.director.emit("猫待机");
            })
            .delay(1)
            .call(() => {
                AD.gameScene.createDialog("你们是在跟我玩捉迷藏吗？", config.roleType.HUMAN);
                this.complete();
            })
            .start();
    },

});
