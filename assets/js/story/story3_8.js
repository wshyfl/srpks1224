

cc.Class({
    extends: cc.Component,

    properties: {
        cameraNode: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.human = cc.find("human", this.node);
        this.cameraPos1 = cc.find("cameraPos1", this.node);
        this.cat = cc.find("cat", this.node);
        AD.couldClear = false;//
    },

    start() {
        AD.audioMng.playSfx("猫")
        AD.handPosTemp = cc.v2(200,400)
        AD.gameScene.cameraGame.node.x = -150;
        AD.gameScene.cameraGame.node.y = -200;
        AD.gameScene.cameraGame.zoomRatio = 2;
        cc.director.emit("人物抱猫");
        cc.director.emit("消防员待机");
        cc.director.emit("猫趴着");
        AD.xiaoFangYuan.kouZhao(-1);

        // AD.human.biaoQing(29);
        AD.human.timeScale(0.5)
        this.scheduleOnce(function () {
            AD.gameScene.createDialog("真是太谢谢你了", config.roleType.HUMAN);
            AD.couldClear = true;//
        }, 1);



        //被擦干净了
        cc.director.on("完成", () => {
            AD.gameScene.wipUp();

            
            AD.gameScene.changeCamera(3, this.cameraPos1, 1.5);;
            this.scheduleOnce(function () {
                AD.gameScene.createDialog("你长的好帅啊，先生！", config.roleType.HUMAN);
                this.complete();
            }, 4);

        }, this);
    },
    //本关完成
    complete() {
        this.scheduleOnce(function () {
            AD.gameScene.win();
        }, 2.5);
    },
    

});
