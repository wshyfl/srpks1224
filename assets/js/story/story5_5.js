

cc.Class({
    extends: cc.Component,

    properties: {
        shiTou: cc.Node,
        shiTou2: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {

        this.human = cc.find("human", this.node);
        this.cameraPos1 = cc.find("cameraPos1", this.node);

        this.langRen = cc.find("langRen", this.node); this.langRen.active = true;
        AD.couldClear = false;//


        //隐藏数




    },

    start() {




        //主角走过来
        this.humanAct();
        this.langRenAct();



        //被擦干净了
        cc.director.on("完成", () => {
            AD.gameScene.wipUp();


            cc.tween(this.shiTou)
                .to(0.5, { position: this.shiTou2.position, angle: this.shiTou2.angle })
                .start();

            this.scheduleOnce(function () {
                this.humanActLeave();
                this.langRenActLeave();
                
            }, 1)

        }, this);
    },
    //本关完成
    complete() {
        this.scheduleOnce(function () {
            AD.gameScene.win();
        }, 2);
    },

    humanAct() {
        cc.director.emit("人物跑");
        AD.human.biaoQing(25);

        AD.gameScene.changeCamera(1, this.cameraPos1, 2);
        cc.tween(this.human)
            .to(1.5, { x: -585 })
            .call(() => {
                cc.director.emit("人物待机捂嘴");
            })
            .delay(1)
            .call(() => {
                AD.gameScene.createDialog("这么大的坑，我要怎么过去？", config.roleType.HUMAN);
                AD.couldClear = true;//
            })
            .start();
    },
    langRenAct() {
        // AD.gameScene.changeCamera(1, this.cameraPos4, 1.5);
        cc.director.emit("狼人跑");
        cc.tween(this.langRen)
            .by(1.5, { x: -545 })
            .call(() => {
                cc.director.emit("狼人待机站");
            })
            .start();
    },
    humanActLeave() {
        cc.director.emit("人物跑");
        cc.tween(this.human)
            .by(3, { x: -1000 })
            .start();
    },
    langRenActLeave() {
        cc.director.emit("狼人跑");
        cc.tween(this.langRen)
            .by(3, { x: -1000 })
            .call(() => {
                AD.gameScene.createDialog("可惜还是没有甩开他！", config.roleType.HUMAN);
                this.complete();
            })
            .start();
    },
});
