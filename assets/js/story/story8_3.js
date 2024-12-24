

cc.Class({
    extends: cc.Component,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {


        this.human = cc.find("human", this.node);
        this.cameraPos = cc.find("cameraPos", this.node);

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
        // AD.gameScene.cameraGame.node.x = 200;
        // AD.gameScene.cameraGame.node.y = 200;
        // AD.gameScene.cameraGame.zoomRatio = 1.5;
        // AD.gameScene.changeCamera(1.5, this.cameraPos, 2);
        // this.scheduleOnce(function(){
        //     AD.gameScene.changeCamera(1, this.cameraPos, 1);
        // },2)
        AD.handPosTemp = cc.v2(0, 0);
        this.humanAct();


        //被擦干净了
        cc.director.on("完成", () => {
            AD.gameScene.wipUp();
            cc.director.emit("人物高兴");
            AD.gameScene.createDialog("清理掉它们就可以了!", config.roleType.HUMAN);
            this.scheduleOnce(function () {
                AD.couldClear = true;//
                this.complete();
            }, 1)
        }, this);
    },
    //本关完成
    complete() {
        this.scheduleOnce(function () {
            AD.gameScene.win();
        }, 2);
    },
    humanAct() {
        cc.director.emit("人物跑");
        AD.human.biaoQing("惊讶");
        cc.tween(this.human)
            .to(2, { x: 77, y: 45 })
            .call(() => {
                cc.director.emit("人物待机捂嘴");
                AD.human.biaoQing("害怕");

            })
            .delay(1)
            .call(() => {
                AD.gameScene.createDialog("我要怎么下楼呢？", config.roleType.HUMAN);
                AD.couldClear = true;
            })
            .start();
    },

});
