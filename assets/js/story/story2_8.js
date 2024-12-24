

cc.Class({
    extends: cc.Component,

    properties: {
        cameraNode: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.human = cc.find("human", this.node);
        this.taoNode = cc.find("taoNode", this.node);

        AD.couldClear = false;//
    },

    start() {
        AD.gameScene.cameraGame.zoomRatio = 4;
        cc.director.emit("人物挂树");

        this.scheduleOnce(function () {

            AD.audioMng.playSfx("翻窗")
            AD.gameScene.changeCamera(1.5, this.cameraNode, 3);
        
            
            this.scheduleOnce(() => {
                AD.couldClear = true;//
                AD.gameScene.createDialog("额..这些树枝真讨厌", config.roleType.HUMAN);
            }, 4)
        }, 0.5);



        //被擦干净了
        cc.director.on("完成", () => {
            cc.director.emit("人物挂树横");
            AD.gameScene.wipUp();
            this.scheduleOnce(function () {
                cc.tween(this.human)
                    .to(0.3, { y: -1630 })
                    .call(() => {
                        cc.director.emit("人物挂树横2");

                    })
                    .delay(1)
                    .call(() => {
                        AD.gameScene.changeCamera(1.5, this.taoNode, 1);
                    })
                    .delay(1)
                    .call(() => {
                        AD.gameScene.createDialog("绳子有些短了", config.roleType.HUMAN);
                        this.complete();
                    })
                    .start();
            }, 1)
        }, this);
    },
    //本关完成
    complete() {
        this.scheduleOnce(function () {
            AD.gameScene.win();
        }, 2);
    },
});
