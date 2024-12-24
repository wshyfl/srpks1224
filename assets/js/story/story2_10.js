

cc.Class({
    extends: cc.Component,

    properties: {
        cameraNode: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.human = cc.find("human", this.node);
        this.shengZi = cc.find("shengZi", this.node);

        AD.couldClear = false;//
    },

    start() {
        AD.handPosTemp = cc.v2(0, -650);
        cc.director.emit("人物挂树横2");
        this.scheduleOnce(function () {
            AD.couldClear = true;//            
            AD.gameScene.createDialog("接下来该完美着陆了", config.roleType.HUMAN);
        }, 1);


        //被擦干净了
        cc.director.on("完成", () => {
            this.shengZi.active = false;
            AD.gameScene.wipUp();
            cc.director.emit("人物落地");
            this.humanDown();
            this.human.zIndex = 1;
        }, this);
    },
    //本关完成
    complete() {
        this.scheduleOnce(function () {
            AD.gameScene.win();
        }, 1);
    },
    humanDown() {
        cc.tween(this.human)
            .delay(0.5)
            .to(0.5, { y: -466 })
            .delay(0.5)
            .call(() => {
                cc.director.emit("人物高兴");
            })
            .delay(3)
            .call(() => {
                cc.director.emit("人物跑");
            })
            .by(1.5, { x: -600 })
            .call(() => {
                this.complete();
            })
            .start();
    }
});
