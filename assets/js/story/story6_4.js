

cc.Class({
    extends: cc.Component,

    properties: {
        human: cc.Node,
        humanCopy: cc.Node,
        shengZi: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.cameraPos1 = cc.find("cameraPos1", this.node);
        this.huangNode = cc.find("huangNode", this.node);
        this.junRen = cc.find("junRen", this.node);
        AD.couldClear = false;//
        this.humanCopy.active = false;

        //隐藏数

        this.actYaoHuang = cc.tween(this.huangNode)
            .repeatForever(
                cc.tween()
                    .to(1.5, { angle: 5 }, { easing: "sineInOut" })
                    .to(1.5, { angle: -5 }, { easing: "sineInOut" })
            );
        var self = this;
        cc.director.on("擦除开始", () => {
            self.actYaoHuang.stop();
            self.shengZi.opacity = 255;
            AD.human.changeShengZi(-1);
        }, this);
        cc.director.on("擦除失败", () => {
            self.actYaoHuang.start();
            AD.human.changeShengZi(0);
            self.shengZi.opacity = 0;
        }, this);
        cc.director.on("擦除成功", () => { }, this);


    },
    // AD.gameScene.changeCamera(1, this.cameraPos3, 0.5);
    // AD.human.biaoQing(19);
    // cc.director.emit("军人6待机");
    // cc.director.emit("人物5亲吻待机");
    // AD.gameScene.createDialog("我要除掉这个保安！", config.roleType.HUMAN);
    start() {
        cc.director.emit("人物6挣扎");
        cc.director.emit("军人6死亡");
        AD.human.changeShengZi(0);
        this.shengZi.opacity = 0;
        this.actYaoHuang.start();
        this.scheduleOnce(function () {
            AD.gameScene.createDialog("现在就能下去了！", config.roleType.HUMAN);
            AD.couldClear = true;//
        }, 1);

        //主角走过来




        //被擦干净了
        cc.director.on("完成", () => {


            AD.gameScene.wipUp();
            cc.director.emit("人物落地");
            this.human.x = this.humanCopy.x;
            this.human.angle = 0;
            cc.tween(this.human)
                .delay(0.5)
                .to(0.3, { position: this.humanCopy.position })
                .call(() => {
                    cc.director.emit("人物6落地2");
                })
                .delay(0.5)
                .call(() => {
                    cc.director.emit("人物6耶");
                })
                .delay(1)
                .call(() => {
                    cc.director.emit("人物待机");
                    AD.human.biaoQing(29);
                })
                .delay(1)
                .call(() => {
                    this.complete();
                    AD.gameScene.createDialog("轻轻松松嘛~", config.roleType.HUMAN);
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
