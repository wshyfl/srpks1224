

cc.Class({
    extends: cc.Component,

    properties: {
        humanCopy: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {



        this.youTing = cc.find("youTing", this.node);
        this.feiJi = cc.find("feiJi", this.node);
        this.human = cc.find("human", this.node);

        var _animation2 = this.humanCopy.getComponent(dragonBones.ArmatureDisplay);
        _animation2.playAnimation("7_shiluo", -1);
      

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
        AD.handPosTemp = cc.v2(0, 250);
        for (var i = 0; i < AD.humanSoltNameArr.length; i++) {
            Tools.changeSlotTexture(this.humanCopy, AD.humanSoltNameArr[i], AD.globalNode.getSkinIndex());
        }

        for (var i = 0; i < AD.humanSoltNameArr.length; i++) {
            Tools.changeSlotTexture(this.human, AD.humanSoltNameArr[i], 12);
        }


        Tools.changeSlotTexture(this.humanCopy, "JueSe_jiao02", 13);
        Tools.changeSlotTexture(this.humanCopy, "JueSe_jiao01", 13);


        cc.director.emit("人物7失落");
        this.scheduleOnce(function () {
            AD.gameScene.createDialog("我想离开这个岛！", config.roleType.HUMAN);
            AD.couldClear = true;//
        }, 1)




        //被擦干净了
        cc.director.on("完成", () => {
            AD.gameScene.wipUp();


            cc.director.emit("人物7开心2");


            cc.tween(this.feiJi)
            .to(0.4,{scale:1})
            .start();
            cc.tween(this.youTing)
            .to(0.4,{scale:1})
            .start();


            this.scheduleOnce(function () {
                AD.gameScene.createDialog("我真是太幸运了", config.roleType.HUMAN);
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
