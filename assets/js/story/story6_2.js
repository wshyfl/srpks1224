

cc.Class({
    extends: cc.Component,

    properties: {
        shengZi: cc.Node,
        human: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.cameraPos1 = cc.find("cameraPos1", this.node);
        this.huangNode = cc.find("huangNode", this.node);
        this.junRen = cc.find("junRen", this.node);

        AD.couldClear = false;//

        //隐藏数




    },
    // AD.gameScene.changeCamera(1, this.cameraPos3, 0.5);
    // AD.human.biaoQing(19);
    // cc.director.emit("军人6待机");
    // cc.director.emit("人物5亲吻待机");
    // AD.gameScene.createDialog("我要除掉这个保安！", config.roleType.HUMAN);
    start() {
        cc.director.emit("人物6挣扎");
        cc.director.emit("军人6死亡");
        cc.tween(this.huangNode)
            .repeatForever(
                cc.tween()
                    .to(1.5, { angle: 5 }, { easing: "sineInOut" })
                    .to(1.5, { angle: -5 }, { easing: "sineInOut" })
            )
            .start();
        cc.director.emit("人物6挣扎");

        this.scheduleOnce(function () {
            this.scheduleOnce(function () {
                cc.director.emit("人物6挣扎2");
            }, 2)
            cc.tween(this.shengZi)
                .to(4, { y: 0 },{easing:"sineInOut"})

                .delay(0.5)
                .call(() => {
                    AD.couldClear = true;//
                    AD.gameScene.createDialog("别啊，上，上，上，我的妈！", config.roleType.HUMAN);
                })
                .start();


        }, 1)

        //主角走过来




        //被擦干净了
        cc.director.on("完成", () => {
            

            AD.gameScene.wipUp();
            cc.tween(this.shengZi)
                .to(4, { y: 280 },{easing:"sineInOut"})
                .call(()=>{
                    AD.human.biaoQing(24);
                })
                .delay(1)
                .call(()=>{
                    AD.gameScene.createDialog("吓了我一跳！", config.roleType.HUMAN);
                    this.complete();
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
