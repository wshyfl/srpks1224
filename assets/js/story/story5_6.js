

cc.Class({
    extends: cc.Component,

    properties: {
        doorOpen: cc.Node,
        doorClose: cc.Node,
        humanCopy: cc.Node,
        dianJu: cc.Node,
        dianJuCopy: cc.Node,
        shuUp: cc.Node,
        dianHuaTing2: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.dianHuaTing = this.doorClose.parent;
        this.doorClose.zIndex = this.doorOpen.zIndex = 1;
        this.human = cc.find("human", this.node);
        this.hide = cc.find("hide", this.node);
        this.cameraPos1 = cc.find("cameraPos1", this.node);

        this.langRen = cc.find("langRen", this.node); this.langRen.active = true;
        AD.couldClear = false;//
        this.dianJu.active = this.dianJuCopy.active = false;

        //隐藏数




    },

    start() {

        AD.human.timeScale(1.2)
        AD.gameScene.cameraGame.node.x = 660;
        AD.gameScene.cameraGame.zoomRatio = 1;


        //主角走过来
        this.humanAct();
        this.langRenAct();



        //被擦干净了
        cc.director.on("完成", () => {
            AD.gameScene.wipUp();

            this.dianJuAct();




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

        AD.gameScene.changeCamera(1, this.cameraPos1, 3);
        cc.tween(this.human)
            .to(3, { x: -500 })
            .call(() => {
                cc.director.emit("人物待机捂嘴");
                this.inDianHuaTing();
            })
            .delay(0.5)
            .call(() => {
                AD.gameScene.createDialog("把他从我身边弄走！", config.roleType.HUMAN);
                AD.couldClear = true;//
            })
            .start();
    },
    langRenAct() {
        // AD.gameScene.changeCamera(1, this.cameraPos4, 1.5);
        cc.director.emit("狼人跑");
        cc.tween(this.langRen)
            .to(3, { x: -320 })
            .call(() => {
                cc.director.emit("狼人待机站");
            })
            .start();
    },
    humanActLeave() {
        cc.director.emit("人物跑");
        cc.tween(this.human)
            .by(2, { x: -800 })
            .start();
    },
    langRenActLeave() {
        cc.tween(this.langRen)
            .delay(0.5)
            .call(() => {
                cc.director.emit("狼人跑");
            })
            .by(2, { x: -800 })
            .call(() => {
                AD.gameScene.createDialog("刚才真是危险！", config.roleType.HUMAN);
                this.complete();
            })
            .start();
    },
    //进入电话亭
    inDianHuaTing() {
        this.human.parent = this.dianHuaTing;
        this.doorOpen.active = false; this.doorClose.active = true;
        this.human.position = this.humanCopy.position;
        this.human.scaleX = this.humanCopy.scaleX;
        this.human.scaleY = 0.6;

    },
    dianJuAct() {
        this.dianJu.active = true;
        cc.tween(this.dianJu)
            .to(0.3, { position: this.dianJuCopy.position, angle: this.dianJuCopy.angle })
            .repeat(2,
                cc.tween()
                    .by(0.1, { x: -50 })
                    .by(0.1, { x: 50 })
            )
            .call(() => {
                this.dianJu.active = false;
                this.shuDao();
                this.dianHuaTingDao();
            })
            .start();
    },
    //树倒
    shuDao() {
        this.hide.active = false;
        cc.tween(this.shuUp)
            .to(0.2, { angle: -70 })
            .start();
    },
    //电话亭 倒
    dianHuaTingDao() {
        cc.director.emit("狼人待机蹲");

        this.human.parent = this.node;
        this.human.scale = 0.6666667; this.human.x = -575; this.human.y = -345;
        cc.director.emit("人物5摔倒");
        this.scheduleOnce(function () {
            this.humanActLeave();
            this.langRenActLeave();
        }, 1)
        this.doorOpen.active = true; this.doorClose.active = false;
        cc.tween(this.dianHuaTing2)
            .to(0.2, { angle: -90, y: -200 })
            .start();
    },
});
