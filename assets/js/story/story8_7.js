

cc.Class({
    extends: cc.Component,

    properties: {
        plane: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {


        this.human = cc.find("human", this.node);
        this.cameraPos = cc.find("cameraPos", this.node);
        this.cameraPos2 = cc.find("cameraPos2", this.node);

        AD.couldClear = false;//


    },

    // AD.handPosTemp = cc.v2(0,400)
    // AD.gameScene.cameraGame.node.x = -100;
    // AD.gameScene.cameraGame.zoomRatio = 1.5;
    // AD.gameScene.changeCamera(1, this.cameraPos3, 0.5);
    // AD.human.biaoQing(19);
    // cc.director.emit("军人6待机");
    // cc.director.emit("人物5亲吻待机");
    // AD.gameScene.createDialog("我要除掉这个保安！", config.roleType.HUMAN);
    start() {

        AD.handPosTemp = cc.v2(0, 0);


        AD.gameScene.cameraGame.zoomRatio = 1.2;


        this.humanAct();

        //被擦干净了
        cc.director.on("完成", () => {
            AD.gameScene.wipUp();
            cc.director.emit("人物高兴单次");
            this.scheduleOnce(function () {
                cc.director.emit("人物高兴单次");
            }, 1.5)
            this.scheduleOnce(function () {
                this.planeFly();
            }, 3)


        }, this);
    },
    //本关完成
    complete() {
        this.scheduleOnce(function () {
            AD.gameScene.win();
        }, 0.3);
    },
    humanAct() {
        this.scheduleOnce(function () {
            AD.gameScene.changeCamera(1.2, this.cameraPos, 1.5);

        }, 0.7)
        cc.director.emit("人物跑");
        AD.human.biaoQing("惊讶");

        cc.tween(this.human)
            .to(2.2, { x: 140, scaleX: -0.5, scaleY: 0.5 })
            .call(() => {
                cc.director.emit("人物待机捂嘴");
                AD.human.biaoQing("惊讶");

            })
            .delay(1)
            .call(() => {
                AD.gameScene.changeCamera(1, this.cameraPos, 0.5);
                AD.couldClear = true;//
                AD.gameScene.createDialog("我要怎么求救呢？", config.roleType.HUMAN);
                // this.complete();
            })
            .start();
    },
    planeFly() {

        AD.audioMng.playSfx("飞机");
        this.schedule(function(){
            
            AD.audioMng.playSfx("飞机");
        },2.6,1)
        cc.tween(this.plane)
            .to(1, { x: 550, y: 250, scale: 1 })
            .call(() => {
                this.toPlane();
            })
            .start();
    },
    toPlane() {
        cc.director.emit("人物跑");
        cc.tween(this.human)
            .to(1, { x: 470 })
            .to(0.02, { scaleX: 0.5 })
            .call(() => {
                cc.director.emit("人物待机");
            })
            .delay(0.5)
            .call(() => {
                cc.director.emit("人物跳窗");
                AD.human.biaoQing("开心");
            })
            .by(0.4, { x: 0, y: 200, scale: -0.1 })
            .delay(0.5)
            .call(() => {
                this.out();
            })
            .start();
    },
    out() {

        this.scheduleOnce(function(){
            this.complete();
        },2)
        cc.tween(this.plane)
            .by(3, { x: -1000, y: 1600 }, { easing: "sineIn" })
            .start();
        cc.tween(this.human)
            .by(3, { x: -1000, y: 1600 }, { easing: "sineIn" })
            .call(() => {
              
            })
            .start();
    },
});
