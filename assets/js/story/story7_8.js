

cc.Class({
    extends: cc.Component,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {

        this.human = cc.find("human", this.node);


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


        cc.director.emit("人物7烤");
        Tools.changeSlotTexture(this.human, "JueSe_jiao02", 13);
        Tools.changeSlotTexture(this.human, "JueSe_jiao01", 13);
        this.scheduleOnce(function () {
            AD.gameScene.createDialog("我得想办法逃走", config.roleType.HUMAN);
            AD.couldClear = true;//
        }, 1)




        //被擦干净了
        cc.director.on("完成", () => {
            AD.gameScene.wipUp();

            this.human.scaleX = -1 * this.human.scaleX;
            this.human.y = -500;
            cc.director.emit("人物待机");
            Tools.changeSlotTexture(this.human, "JueSe_jiao02", 13);
            Tools.changeSlotTexture(this.human, "JueSe_jiao01", 13);
         
            this.scheduleOnce(function(){
                cc.director.emit("人物跑");
                Tools.changeSlotTexture(this.human, "JueSe_jiao02", 13);
                Tools.changeSlotTexture(this.human, "JueSe_jiao01", 13);
    
                cc.tween(this.human)
                    .by(2, { x: -700 })
                    .start();
            },0.5)



            this.scheduleOnce(function () {
                AD.gameScene.createDialog("这样我手脚就可以动了", config.roleType.HUMAN);
                this.complete();

            }, 2)



        }, this);
    },
    //本关完成
    complete() {
        this.scheduleOnce(function () {
            AD.gameScene.win();
        }, 3);
    },

});
