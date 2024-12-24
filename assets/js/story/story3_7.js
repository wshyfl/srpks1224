

cc.Class({
    extends: cc.Component,

    properties: {
        cameraNode: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.human = cc.find("human", this.node);
        this.cameraPos1 = cc.find("cameraPos1", this.node);
        this.cameraPos2 = cc.find("cameraPos2", this.node);
        this.cat = cc.find("cat", this.node);
        AD.couldClear = false;//
    },

    start() {

        AD.gameScene.cameraGame.node.x = -600;
        AD.gameScene.cameraGame.node.y = -200;
        AD.gameScene.cameraGame.zoomRatio = 2;
        cc.director.emit("人物走");
        cc.director.emit("消防员待机举手");
        cc.director.emit("猫趴着");

        AD.gameScene.changeCamera(2, this.cameraPos1, 3);
        cc.tween(this.human)
            .to(3, { x: -150 })
            .call(() => {
                cc.director.emit("人物待机捂嘴");
                AD.human.biaoQing("恐惧");

            })
            .delay(1)
            .call(() => {
                AD.gameScene.changeCamera(1, this.cameraPos2, 1);;
            })
            .delay(1)
            .call(() => {
                AD.gameScene.createDialog("天哪，小黑你怎么跑那么高", config.roleType.HUMAN);
            })
            .delay(1)
            .call(() => {
                AD.couldClear = true;//         
            })
            .start();


            AD.human.biaoQing(36);

        //被擦干净了
        cc.director.on("完成", () => {
            AD.gameScene.wipUp();

            // AD.human.biaoQing("开心");
                this.catAct();
      
        }, this);
    },
    //本关完成
    complete() {
        this.scheduleOnce(function () {
            AD.gameScene.win();
        }, 2.5);
    },
    catAct() {
        cc.tween(this.cat)
            .delay(0.5)
            .to(0.5, { y: -15,angle:0})
            .call(() => {
                AD.gameScene.createDialog("小心！", config.roleType.HUMAN);
                this.complete();
            })
            .start();

            
        this.scheduleOnce(function () {
            cc.director.emit("消防员接猫");
        }, 0.5);
    },

});
