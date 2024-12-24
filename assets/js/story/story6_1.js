

cc.Class({
    extends: cc.Component,

    properties: {
        shengZi: cc.Node,
        human: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.cameraPos1 = cc.find("cameraPos1", this.node);
        this.huangNode = cc.find("huangNode", this.node);
        this.junRen = cc.find("junRen", this.node);

        AD.couldClear = false;//
        cc.director.emit("军人6待机");

        //隐藏数




    },

    // AD.gameScene.cameraGame.node.x = -670;
    // AD.gameScene.changeCamera(1, this.cameraPos3, 0.5);
    // AD.human.biaoQing(19);
    // cc.director.emit("军人6待机");
    // cc.director.emit("人物5亲吻待机");
    // AD.gameScene.createDialog("我要除掉这个保安！", config.roleType.HUMAN);
    start() {
        AD.gameScene.cameraGame.node.x = 0;
        AD.gameScene.cameraGame.node.y = 150;
        AD.gameScene.cameraGame.zoomRatio = 2;
        cc.tween(this.huangNode)
            .repeatForever(
                cc.tween()
                    .to(1.5, { angle: 5 }, { easing: "sineInOut" })
                    .to(1.5, { angle: -5 }, { easing: "sineInOut" })
            )
            .start();

        cc.director.emit("人物6挣扎");
        AD.human.biaoQing(30);

        this.scheduleOnce(function () {
            AD.gameScene.changeCamera(1, this.cameraPos1, 1);
            this.scheduleOnce(function () {
                AD.gameScene.createDialog("我要除掉这个保安！", config.roleType.HUMAN);
                AD.couldClear = true;//
            }, 2)
        }, 1)

        //主角走过来




        //被擦干净了
        cc.director.on("完成", () => {
            cc.director.emit("军人6摔倒");

            AD.gameScene.wipUp();
            cc.tween(this.junRen)
                .to(0.5, { y: -400 })
                .start();



            this.scheduleOnce(function () {
                AD.gameScene.createDialog("哇，这得多疼啊！", config.roleType.HUMAN);
                AD.human.biaoQing(1);
                this.complete();
            }, 1)

        }, this);
    },
    //本关完成
    complete() {
        this.scheduleOnce(function () {
            AD.gameScene.win();
        }, 2.5);
    },



});
