

cc.Class({
    extends: cc.Component,

    properties: {
        cameraNode: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.human = cc.find("human", this.node);
        this.sun = cc.find("sun", this.node);
        this.light = cc.find("light", this.node);
        this.mianBei = cc.find("mianBei", this.node);

        cc.tween(this.sun)
            .repeatForever(
                cc.tween()
                    .repeat(3,
                        cc.tween()
                            .by(0.3, { angle: 20 }, { easing: "sineInOut" })
                            .by(0.3, { angle: -20 }, { easing: "sineInOut" })
                    )
                    .delay(1)
            )
            .start();


        AD.couldClear = false;//
    },

    start() {

        cc.director.emit("人物睡觉");

        this.scheduleOnce(function () {
            AD.couldClear = true;//            
            AD.gameScene.createDialog("该起床了哦！", config.roleType.HUMAN);
        }, 1);


        //被擦干净了
        cc.director.on("完成", () => {
            AD.gameScene.wipUp();

            this.lightAct();
        }, this);
    },
    //本关完成
    complete() {
        this.scheduleOnce(function () {
            AD.gameScene.win();
        }, 2.5);
    },
    lightAct() {
        cc.tween(this.light)
            .delay(1)
            .to(1, { scale: 1 })
            .delay(1)
            .call(() => {
                AD.human.biaoQing("生气");
            })
            .delay(1)
            .call(() => {
                this.gaiBeiZi();
            })
            .start();
    },
    gaiBeiZi() {
        cc.tween(this.mianBei)
        .to(1,{x:80})
        .delay(1)
        .call(()=>{
            AD.gameScene.createDialog("这阳光可真刺眼", config.roleType.HUMAN);
            this.complete();

        })
        .start();
    },
});
