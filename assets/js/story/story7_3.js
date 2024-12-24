

cc.Class({
    extends: cc.Component,

    properties: {
        humanCopy: cc.Node,

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.cameraPos1 = cc.find("cameraPos1", this.node);
        this.human = cc.find("human", this.node);
        this.kongCheng = cc.find("kongCheng", this.node);
        this.yun1 = cc.find("yun1", this.node);
        this.yun2 = cc.find("yun2", this.node);
        this.yun3 = cc.find("yun3", this.node);
        this.yun4 = cc.find("yun4", this.node);

        AD.couldClear = false;//

        //被擦掉的换成主角衣服
        for (var i = 0; i < AD.humanSoltNameArr.length; i++) {
            Tools.changeSlotTexture(this.humanCopy, AD.humanSoltNameArr[i], AD.globalNode.getSkinIndex());
        }
        

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
        AD.handPosTemp = cc.v2(100, 0);
        cc.director.emit("人物7跳伞");
        Tools.changeSlotTexture(this.human, "JueSe_jiao02", 0);
        // Tools.changeSlotTexture(this.human, "JueSe_jiao01", 0);
        cc.director.emit("空乘跳伞");
        this.scheduleOnce(function () {
            AD.gameScene.createDialog("我下落的太快了！", config.roleType.HUMAN);
            AD.couldClear = true;//
        }, 1)

        this.speedRate = 1;


        //被擦干净了
        cc.director.on("完成", () => {
            this.speedRate = 0.4;
            this.kongChengAct();
            AD.gameScene.wipUp();
            cc.director.emit("人物7跳伞2");
            Tools.changeSlotTexture(this.human, "JueSe_jiao02", 0);
            // Tools.changeSlotTexture(this.human, "JueSe_jiao01", 0);
            this.kongChengAct();
            this.scheduleOnce(function () {
                AD.gameScene.createDialog("终于把他弄下去了！", config.roleType.HUMAN);
                this.complete();
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


    },
    kongChengAct() {
        cc.tween(this.kongCheng)
            .by(2, { y: -1000, angle: -100 })
            .start();
    },
    resetYun(_nodeYun) {
        _nodeYun.y += 20*this.speedRate;
        if (_nodeYun.y > cc.winSize.height / 2 + 100) {
            _nodeYun.y = -cc.winSize.height / 2 - 200 - Tools.random(0, 150);
            _nodeYun.scale = Tools.random(6, 10) * 0.1;
        }

    },
    update() {
        this.resetYun(this.yun1);
        this.resetYun(this.yun2);
        this.resetYun(this.yun3);
        this.resetYun(this.yun4);
    },

});
