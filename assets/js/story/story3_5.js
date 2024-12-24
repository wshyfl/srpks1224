

cc.Class({
    extends: cc.Component,

    properties: {
        cameraNode: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.human = cc.find("human", this.node);
        this.cat = cc.find("cat", this.node);




        AD.couldClear = false;//
    },

    start() {

        cc.director.emit("人物待机");
        cc.director.emit("猫趴着");

   
        this.scheduleOnce(function(){
            AD.couldClear = true;//            
                AD.gameScene.createDialog("好吧，那让我来找一找", config.roleType.HUMAN);
        },1)

        //被擦干净了
        cc.director.on("完成", () => {
            AD.gameScene.wipUp();

            AD.human.biaoQing("开心");
            cc.director.emit("猫待机");
            this.catAct();

            AD.audioMng.playSfx("猫")
        }, this);
    },
    //本关完成
    complete() {
        this.scheduleOnce(function () {
            AD.gameScene.win();
        }, 2.5);
    },
    catAct() {
        cc.tween(this.cat)
            .delay(1)

            .call(() => {
                cc.director.emit("猫跳");
            })
            .to(0.5, { x: 74, y: -103,scale:0.8 })
            .call(() => {
                cc.director.emit("猫待机");
            })
            .delay(1)
            .call(() => {
                cc.director.emit("猫走");
            })
            .to(2, { x: 80, y: -151,scale:1 })
            .call(() => {
                cc.director.emit("猫待机");
            })
            .delay(1)
            .call(() => {
                AD.gameScene.createDialog("哈哈，我就知道你在这", config.roleType.HUMAN);
                this.complete();
            })
            .start();
    },

});
