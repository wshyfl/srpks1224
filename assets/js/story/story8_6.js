

cc.Class({
    extends: cc.Component,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {


        this.human = cc.find("human", this.node);
        this.cameraPos = cc.find("cameraPos", this.node);
        this.cameraPos2 = cc.find("cameraPos2", this.node);

        AD.couldClear = false;//

    },

    // AD.handPosTemp = cc.v2(0,400)
    // AD.gameScene.cameraGame.node.x = -100;
    // AD.gameScene.cameraGame.zoomRatio = 1.5;
    // AD.gameScene.changeCamera(1, this.cameraPos3, 0.5);
    // AD.human.biaoQing(19);
    // cc.director.emit("军人6待机");
    // cc.director.emit("人物5亲吻待机");
    // AD.gameScene.createDialog("我要除掉这个保安！", config.roleType.HUMAN);
    start() {

        AD.handPosTemp = cc.v2(0, 0);

        AD.gameScene.cameraGame.node.x = -110;
        AD.gameScene.cameraGame.zoomRatio = 1.5;
        this.humanAct();


        //被擦干净了
        cc.director.on("完成", () => {
            AD.gameScene.createDialog("这样我就可以通过了", config.roleType.HUMAN);
            AD.gameScene.wipUp();
            cc.director.emit("人物高兴单次");
            this.scheduleOnce(function () {
                cc.director.emit("人物高兴单次");
            }, 1.5)
            this.scheduleOnce(function () {
                this.humanAct2();
            }, 3)


        }, this);
    },
    //本关完成
    complete() {
        this.scheduleOnce(function () {
            AD.gameScene.win();
        }, 0.3);
    },
    humanAct() {
        AD.gameScene.changeCamera(1.5, this.cameraPos, 2);
        cc.director.emit("人物跑");
        AD.human.biaoQing("惊讶");

        cc.tween(this.human)
            .to(2, { x: 0, y: -144, scaleX: -0.5, scaleY: 0.5 })
            .call(() => {
                cc.director.emit("人物待机捂嘴");
                AD.human.biaoQing("惊讶");
                AD.gameScene.changeCamera(1.2, this.cameraPos, 0.5);
            })
            .delay(1)
            .call(() => {
                AD.couldClear = true;//
                AD.gameScene.createDialog("怎么办，天台也着火了", config.roleType.HUMAN);
                // this.complete();
            })
            .start();
    },
    humanAct2() {
        cc.director.emit("人物跑");
        AD.gameScene.changeCamera(1.2, this.cameraPos2, 2);
        cc.tween(this.human)
            .by(3, { x: 650 })
            .call(() => {
                this.complete();
            })

            .start();
    },
});
