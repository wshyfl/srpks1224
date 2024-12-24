

cc.Class({
    extends: cc.Component,

    properties: {
        cameraNode: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.human = cc.find("human", this.node);
        this.shengZi = cc.find("shengZi", this.node);




        AD.couldClear = false;//
    },

    start() {
        cc.director.emit("人物待机捂嘴");
        AD.human.biaoQing("待机");

        this.scheduleOnce(function () {
            AD.gameScene.createDialog("门被锁上了，我要离开这里！", config.roleType.HUMAN);
            this.scheduleOnce(function () {
                AD.couldClear = true;//
            }, 2);
        }, 1);


        //被擦干净了
        cc.director.on("完成", () => {
            cc.director.emit("人物待机劈腿");
            AD.gameScene.wipUp();
            this.scheduleOnce(function () {
                this.shengZi.active = false;
                cc.director.emit("人物捡绳子");
                AD.human.biaoQing("开心");
                this.scheduleOnce(function () {

                    AD.gameScene.createDialog("有绳子就好办多了", config.roleType.HUMAN);
                    this.complete();
                }, 1)
            }, 2)
        }, this);
    },
    //本关完成
    complete() {
        this.scheduleOnce(function () {
            AD.gameScene.win();
        }, 2.5);
    },
    //水没了
    waterClean() {


    },
    // update (dt) {},
});
