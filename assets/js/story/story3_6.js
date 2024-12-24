

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
        this.humanPos1 = cc.find("humanPos1", this.node);




        AD.couldClear = false;//
    },

    start() {

        cc.director.emit("人物待机捂嘴");


        this.scheduleOnce(function () {
            AD.couldClear = true;//            
            AD.gameScene.createDialog("我想小黑应该是跑出去了", config.roleType.HUMAN);
        }, 1)

        //被擦干净了
        cc.director.on("完成", () => {
            AD.gameScene.wipUp();

            AD.human.biaoQing(14);
            this.scheduleOnce(function () {

                AD.gameScene.changeCamera(1.5, this.cameraPos1, 0.5);
                this.humanAct();
            }, 1)

        }, this);
    },
    //本关完成
    complete() {
        this.scheduleOnce(function () {
            AD.gameScene.win();
        }, 1.5);
    },
    humanAct() {
        cc.tween(this.human)
            .delay(1)
            .call(() => {
                cc.director.emit("人物3走路");
                AD.human.biaoQing(14);
                AD.gameScene.changeCamera(1.5, this.cameraPos2, 1.5);
            })
            .to(3, {position:this.humanPos1.position})
            .call(() => {
                this.complete();
            })
            .start();
    },

});
