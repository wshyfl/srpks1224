

cc.Class({
    extends: cc.Component,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.cameraPos1 = cc.find("cameraPos1", this.node);
        this.human = cc.find("human", this.node);
        this.hong = cc.find("hong", this.node);
        this.kongCheng = cc.find("kongCheng", this.node);
        this.effect = cc.find("effect", this.node);

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
    //被擦掉的换成主角衣服
    // for (var i = 0; i < AD.humanSoltNameArr.length; i++) {
    //     Tools.changeSlotTexture(this.humanCopy, AD.humanSoltNameArr[i], AD.globalNode.getSkinIndex());
    //     Tools.changeSlotTexture(this.humanCopy2, AD.humanSoltNameArr[i], AD.globalNode.getSkinIndex());
    // }
    start() {
        this.hongShan();
        cc.director.emit("人物7害怕");
        cc.director.emit("空乘跑");
        this.scheduleOnce(function () {
            AD.gameScene.createDialog("我要怎么出去？", config.roleType.HUMAN);
            AD.couldClear = true;//
        }, 1)



        //被擦干净了
        cc.director.on("完成", () => {
            AD.gameScene.wipUp();
            cc.director.emit("人物7开心");
            this.scheduleOnce(function () {

                this.humanAct();
            }, 1)
            this.effect.active = false;

        }, this);
    },
    //本关完成
    complete() {
        this.scheduleOnce(function () {
            AD.gameScene.win();
        }, 2);
    },

    humanAct() {
        cc.director.emit("人物7跑");
        // AD.human.biaoQing(19);
        cc.tween(this.human)
            .by(1, { x: -500 })
            .call(() => {
                AD.gameScene.createDialog("差点就来不及了！", config.roleType.HUMAN);
                this.complete();
            })
            .start();
        cc.tween(this.kongCheng)
            .by(2, { x: -1300 })
            .start();

    },
    hongShan() {
        cc.tween(this.hong)
            .repeatForever(
                cc.tween()
                    .to(0.5, { opacity: 60 })
                    .to(0.5, { opacity: 0 })
            )
            .start();
    },

});
