

cc.Class({
    extends: cc.Component,

    properties: {
        tiZi: cc.Node,
        tiZiCopy: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.cameraPos1 = cc.find("cameraPos1", this.node);
        this.huangNode = cc.find("huangNode", this.node);
        this.junRen = cc.find("junRen", this.node);
        this.tiZiCopy.active = false;
        AD.couldClear = false;//

        //隐藏数




    },
    // AD.gameScene.changeCamera(1, this.cameraPos3, 0.5);
    // AD.human.biaoQing(19);
    // cc.director.emit("军人6待机");
    // cc.director.emit("人物5亲吻待机");
    // AD.gameScene.createDialog("我要除掉这个保安！", config.roleType.HUMAN);
    start() {
        cc.director.emit("人物6挣扎");
        cc.director.emit("军人6死亡");
        cc.tween(this.huangNode)
            .repeatForever(
                cc.tween()
                    .to(1.5, { angle: 5 }, { easing: "sineInOut" })
                    .to(1.5, { angle: -5 }, { easing: "sineInOut" })
            )
            .start();

        this.scheduleOnce(function () {
            AD.gameScene.createDialog("我需要东西在下面架一下！", config.roleType.HUMAN);
            AD.couldClear = true;//
        }, 1)

        //主角走过来




        //被擦干净了
        cc.director.on("完成", () => {


            AD.gameScene.wipUp();

            cc.tween(this.tiZi)
                .to(0.4, { position: this.tiZiCopy.position, angle: this.tiZiCopy.angle,scaleX:this.tiZiCopy.scaleX }, { easing: "sineIn" })
                .by(0.05, { y: 10})
                .by(0.05, { y:-10})
                .delay(1)
                .call(() => {
                    AD.gameScene.createDialog("这样肯定能行了！", config.roleType.HUMAN);
                    this.complete();
                })
                .start();




        }, this);
    },
    //本关完成
    complete() {
        this.scheduleOnce(function () {
            AD.gameScene.win();
        }, 2);
    },



});
