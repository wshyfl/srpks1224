

cc.Class({
    extends: cc.Component,

    properties: {
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {

        this.human = cc.find("human", this.node);
        this.man = cc.find("man5", this.node);
        this.effect = cc.find("effect", this.node); this.effect.active = false;
        this.effect2 = cc.find("effectHeart", this.node); this.effect.active = false;

        this.cameraPos1 = cc.find("cameraPos1", this.node);

        this.langRen = cc.find("langRen", this.node); this.langRen.active = true;
        AD.couldClear = false;//


        //隐藏数




    },

    start() {

        AD.human.timeScale(1.2)



        //主角走过来
        this.humanAct();
        this.langRenAct();



        //被擦干净了
        cc.director.on("完成", () => {
            AD.gameScene.changeCamera(2, this.cameraPos1, 1);
            AD.gameScene.wipUp();
            cc.director.emit("狼人待机蹲");
            this.human.scaleX = -1 * this.human.scaleX;
            this.scheduleOnce(function () {
                this.scheduleOnce(function () {
                    this.effect.active = true;
                    this.man.active = true;
                    this.langRen.active = false;
                 
                    
                }, 2)
                this.scheduleOnce(function () {

                    this.effect2.active = true;
                    cc.director.emit("人物5亲吻待机");
                    AD.gameScene.createDialog("你还是这个样子比较帅！", config.roleType.HUMAN);
                    this.complete();
                }, 3)
            }, 0.5)


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
            .to(3, { x: -730 })
            .call(() => {
                cc.director.emit("人物待机捂嘴");
            })
            .delay(0.5)
            .call(() => {
                AD.gameScene.createDialog("没有路了可怎么办？", config.roleType.HUMAN);
                AD.couldClear = true;//
            })
            .start();
    },
    langRenAct() {
        // AD.gameScene.changeCamera(1, this.cameraPos4, 1.5);
        cc.director.emit("狼人跑");
        cc.tween(this.langRen)
            .to(3, { x: -575 })
            .call(() => {
                cc.director.emit("狼人待机站");
            })
            .start();
    },


});
