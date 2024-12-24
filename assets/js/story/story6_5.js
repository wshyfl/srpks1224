

cc.Class({
    extends: cc.Component,

    properties: {
        human: cc.Node,
        door: cc.Node,
        tipsLabel: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.cameraPos1 = cc.find("cameraPos1", this.node);
        this.cameraPos2 = cc.find("cameraPos2", this.node);
        this.huangNode = cc.find("huangNode", this.node);
        AD.couldClear = false;//
        this.tipsLabel.active = false;

        //隐藏数

        this.actYaoHuang = cc.tween(this.huangNode)
            .repeatForever(
                cc.tween()
                    .to(2, { angle: 3 }, { easing: "sineInOut" })
                    .to(2, { angle: -3 }, { easing: "sineInOut" })
            );



    },
    // AD.gameScene.changeCamera(1, this.cameraPos3, 0.5);
    // AD.human.biaoQing(19);
    // cc.director.emit("军人6待机");
    // cc.director.emit("人物5亲吻待机");
    // AD.gameScene.createDialog("我要除掉这个保安！", config.roleType.HUMAN);
    start() {
        AD.handPosTemp = cc.v2(0, -100);
        cc.director.emit("人物待机");
        cc.director.emit("军人6死亡");

        this.actYaoHuang.start();
        cc.tween(this.human)
            .delay(0.5)
            .call(() => {
                cc.director.emit("人物走");
                AD.gameScene.changeCamera(2, this.cameraPos1, 2);
            })
            .to(2, { x: -96, y: -232, scale: 0.9 * this.human.scaleX })
            .call(() => {
                cc.director.emit("人物待机捂嘴");
            })
            .delay(1)
            .call(() => {
                AD.gameScene.changeCamera(4, this.cameraPos2, 1);
            })
            .delay(1)
            .call(() => {
                AD.couldClear = true;//
                AD.gameScene.createDialog("让我来猜猜密码是什么？", config.roleType.HUMAN);
            })
            .start();


        //主角走过来




        //被擦干净了
        cc.director.on("完成", () => {


            cc.director.emit("人物6耶");
            this.scheduleOnce(function () {

                AD.gameScene.changeCamera(2, this.cameraPos1, 1);
                cc.director.emit("人物待机");
                this.scheduleOnce(function () {
                    cc.tween(this.door)
                        .by(0.5, { x: -100 })
                        .delay(0.5)
                        .call(() => {
                            cc.director.emit("人物走");
                            cc.tween(this.human)
                                .to(2, { x: -260, y: -176,scale:this.human.scale*0.8 })
                                .to(0.2, { opacity: 0 })
                                .delay(1)
                                .call(() => {
                                    AD.gameScene.createDialog("我怎么这么聪明呢", config.roleType.HUMAN);
                                    this.complete();
                                })
                                .start();
                        })
                        .start();
                }, 1)
            }, 1)
            this.tipsLabel.active = true;
            AD.gameScene.wipUp();

            // cc.tween(this.door)
            // .by(0.5,{x:-100})      

            // .delay(1)
            // .call(()=>{
            //     cc.director.emit("人物走");

            // })
            // .start();



            // this.scheduleOnce(function () {
            //     AD.gameScene.createDialog("这里面保安真少！", config.roleType.HUMAN);
            //     AD.couldClear = true;//
            // }, 1);


        }, this);
    },
    //本关完成
    complete() {
        this.scheduleOnce(function () {
            AD.gameScene.win();
        }, 2);
    },



});
