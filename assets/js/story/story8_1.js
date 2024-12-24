

cc.Class({
    extends: cc.Component,

    properties: {
        door: cc.Node,
        doorOpen: cc.Node,
        jiangShi: cc.Node,

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {


        this.human = cc.find("human", this.node);
        this.cameraPos = cc.find("cameraPos", this.node);

        this.jiangShi.active = false;
        AD.couldClear = false;//

        this.doorOpen.active = false;

        cc.tween(this.door)
            .repeatForever(
                cc.tween()
                    .by(0.1, { x: 10, scale: 0.03 })
                    .by(0.1, { x: -10, scale: -0.03 })
                    .by(0.1, { x: 10, scale: 0.03 })
                    .by(0.1, { x: -10, scale: -0.03 })
                    .delay(1)
            )
            .start();
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
        if (cc.director.getScene().name == "gameScene")
            AD.gameScene.cameraGame.node.x = 360;
        else
            AD.gameScene.cameraGame.node.x = 0;
        AD.gameScene.changeCamera(1, this.cameraPos, 2.5);
        // AD.human.biaoQing(2);



        this.humanAct();


        //被擦干净了
        cc.director.on("完成", () => {
            AD.gameScene.wipUp();
            this.door.active = false;
            this.jiangShi.active = true;


            this.doorOpen.active = true;

            // AD.human.biaoQing("害怕");

            AD.audioMng.playSfx("女孩尖叫");

            var _sfxIndex = 0;
            AD.audioMng.playSfx("僵尸1");
            this.schedule(function () {
                if (!AD.gameScene.gameOver) {
                    _sfxIndex++;
                    if (_sfxIndex % 2 == 0)
                        AD.audioMng.playSfx("僵尸1");
                    else
                        AD.audioMng.playSfx("僵尸2");
                }

            }, 3)
            cc.director.emit("人物7害怕2");

            this.scheduleOnce(function () {
                AD.gameScene.createDialog("天哪，怎么会有僵尸？", config.roleType.HUMAN);
                this.complete();
            }, 2)



        }, this);
    },
    //本关完成
    complete() {
        this.scheduleOnce(function () {
            AD.gameScene.win();
        }, 3);
    },
    humanAct() {

        cc.director.emit("人物走");
        cc.tween(this.human)
            .to(2.5, { x: 46 })
            .call(() => {
                cc.director.emit("人物待机");
                AD.gameScene.createDialog("是谁在敲门？", config.roleType.HUMAN);
                AD.couldClear = true;//
                if (cc.director.getScene().name == "gameScene")
                AD.gameScene.showTips();
            })
            .start();
    },

});
