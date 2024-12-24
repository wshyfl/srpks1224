

cc.Class({
    extends: cc.Component,

    properties: {
        yeZiCopy: cc.Node,
        yeZiCopy2: cc.Node,

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.cameraPos1 = cc.find("cameraPos1", this.node);
        this.human = cc.find("human", this.node);
        this.yeZi = cc.find("yeZi", this.node);
        this.yeZi2 = cc.find("yeZi2", this.node);
        this.yeZi.active = this.yeZi2.active = this.yeZiCopy2.active = this.yeZiCopy.active = false;
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
        AD.handPosTemp = cc.v2(80, -0);
        cc.director.emit("空乘死亡");
        Tools.changeSlotTexture(this.human, "JueSe_jiao02", 13);
        Tools.changeSlotTexture(this.human, "JueSe_jiao01", 13);
        this.scheduleOnce(function () {
            AD.gameScene.createDialog("我好口渴啊！", config.roleType.HUMAN);
            AD.couldClear = true;//
        }, 1)




        //被擦干净了
        cc.director.on("完成", () => {
            AD.gameScene.wipUp();

            this.yeZiAct();
            this.scheduleOnce(function () {

                cc.director.emit("人物高兴");
                Tools.changeSlotTexture(this.human, "JueSe_jiao02", 13);
                Tools.changeSlotTexture(this.human, "JueSe_jiao01", 13);
                AD.human.biaoQing(18);
            }, 1)
            this.scheduleOnce(function () {
                AD.gameScene.createDialog("对了，我可以喝椰子汁", config.roleType.HUMAN);
                this.complete();

            }, 2.5)



        }, this);
    },
    //本关完成
    complete() {
        this.scheduleOnce(function () {
            AD.gameScene.win();
        }, 2);
    },
    yeZiAct() {
        this.yeZi.active = this.yeZi2.active = true;
        cc.tween(this.yeZi)
            .to(0.5, { position: this.yeZiCopy.position, angle: this.yeZiCopy.angle })
            .repeat(2,
                cc.tween()
                    .by(0.1, { y: -10 })
                    .by(0.1, { y: 10 })
            )
            .start();
        cc.tween(this.yeZi2)
            .to(0.5, { position: this.yeZiCopy2.position, angle: this.yeZiCopy2.angle })
            .repeat(2,
                cc.tween()
                    .by(0.1, { y: -10 })
                    .by(0.1, { y: 10 })
            )
            .start();
    },


});
