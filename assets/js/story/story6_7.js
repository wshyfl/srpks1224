

cc.Class({
    extends: cc.Component,

    properties: {
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.cameraPos1 = cc.find("cameraPos1", this.node);
        this.zhuZi = cc.find("zhuZi", this.node);
        this.human = cc.find("human", this.zhuZi);
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
        cc.director.emit("人物待机");

        this.scheduleOnce(function () {
            AD.gameScene.createDialog("怎样才能到对面呢？", config.roleType.HUMAN);

            AD.couldClear = true;
        }, 1)

        //被擦干净了
        cc.director.on("完成", () => {

            AD.gameScene.wipUp();

            cc.director.emit("人物6耶");
            this.scheduleOnce(function () {
                cc.director.emit("人物待机");
                this.zhuZiAct();
            }, 1)


        }, this);
    },
    //本关完成
    complete() {
        this.scheduleOnce(function () {
            AD.gameScene.win();
        }, 2);
    },

    zhuZiAct() {

        cc.tween(this.zhuZi)
            .to(2, { x: 20 })
            .delay(0.5)
            .call(() => {
                this.humanAct();
            })
            .start();
    },
    humanAct(){
        AD.gameScene.changeCamera(1, this.cameraPos1, 2);
        cc.director.emit("人物走");
        cc.tween(this.human)
        .to(2,{x:360})
        .call(()=>{
            cc.director.emit("人物待机");
            this.complete();
            AD.gameScene.createDialog("我马上就可以完成任务了！", config.roleType.HUMAN);
        })
        .start();
    },

});
