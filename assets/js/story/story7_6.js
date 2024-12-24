

cc.Class({
    extends: cc.Component,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.cameraPos1 = cc.find("cameraPos1", this.node);
        this.human = cc.find("human", this.node);
        this.yeRen = cc.find("yeRen", this.node);
        this.yeRen2 = cc.find("yeRen2", this.node);
        this.yeRen2 = cc.find("yeRen2", this.node);
        this.humanCopy = cc.find("humanCopy", this.node);

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
        AD.handPosTemp = cc.v2(180, 280);
        // cc.director.emit("人物7害怕");
        cc.director.emit("人物7害怕2");
        cc.director.emit("野人待机矛");
        Tools.changeSlotTexture(this.yeRen, "wuqi1", -1);
        Tools.changeSlotTexture(this.human, "JueSe_jiao02", 13);
        Tools.changeSlotTexture(this.human, "JueSe_jiao01", 13);
        this.scheduleOnce(function () {
            AD.gameScene.createDialog("啊，竟然有野人！", config.roleType.HUMAN);
            AD.couldClear = true;//
        }, 1)




        //被擦干净了
        cc.director.on("完成", () => {
            AD.gameScene.wipUp();
            cc.director.emit("野人待机空手");


            this.scheduleOnce(function () {

                cc.director.emit("人物高兴");
                Tools.changeSlotTexture(this.human, "JueSe_jiao02", 13);
                Tools.changeSlotTexture(this.human, "JueSe_jiao01", 13);
                AD.human.biaoQing(18);
            }, 1)
            this.scheduleOnce(function () {
                AD.gameScene.createDialog("他们为什么要攻击我", config.roleType.HUMAN);
                this.yeRen2Act();
                this.complete();

            }, 2.5)



        }, this);
    },
    //本关完成
    complete() {
        this.scheduleOnce(function () {
            AD.gameScene.win();
        }, 3);
    },
    yeRen2Act() {
        this.yeRen2.active = true;
        this.animation = this.yeRen2.getComponent(dragonBones.ArmatureDisplay);
        this.animation.playAnimation("daiji", 1);
        cc.tween(this.yeRen2)
            .to(0.5, { x: 270 })
            .call(() => {

                this.animation.playAnimation("gongji", 1);
                
                cc.director.emit("人物5摔倒");
                Tools.changeSlotTexture(this.human, "JueSe_jiao02", 13);
                Tools.changeSlotTexture(this.human, "JueSe_jiao01", 13);
                this.human.position = this.humanCopy.position;
                

            })
            .start();
    },

});
