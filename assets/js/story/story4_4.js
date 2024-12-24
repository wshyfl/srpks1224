

cc.Class({
    extends: cc.Component,

    properties: {
        humanCopy: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.human = cc.find("human", this.node);
        this.cameraPos1 = cc.find("cameraPos1", this.node);
        this.effect = cc.find("effect", this.node); this.effect.active = false;

        AD.couldClear = false;//
        this.animation = this.humanCopy.getComponent(dragonBones.ArmatureDisplay);
        this.animation.playAnimation("4_jusang", 0);
        this._armature = this.animation.armature();
        this._weaponR = this._armature.getSlot('JueSe_tou');
        this._weaponR.displayIndex = 20 - 1;

           //被擦掉的换成主角衣服
           for (var i = 0; i < AD.humanSoltNameArr.length; i++) {
            Tools.changeSlotTexture(this.humanCopy, AD.humanSoltNameArr[i], AD.globalNode.getSkinIndex());
        }
    },

    start() {

        AD.handPosTemp = cc.v2(0,560)
        cc.director.emit("人物走路4");
        AD.human.biaoQing(20);
        cc.tween(this.human)
            .to(3, { x: 10 })
            .call(() => {
                cc.director.emit("人物沮丧");
                AD.human.biaoQing(20);
            })
            .delay(1)
            .call(() => {
                AD.gameScene.changeCamera(1.5, this.cameraPos1, 1);
            })
            .delay(1.5)
            .call(() => {
                this.humanCopy.position = this.human.position;
                AD.gameScene.createDialog("唉，可是我的形象太糟了！", config.roleType.HUMAN);
                AD.couldClear = true;//
                AD.human.biaoQing(19);
            })
            .start();


        this.scheduleOnce(function () {
        }, 1);



        //被擦干净了
        cc.director.on("完成", () => {
            this.effect.active = true;
            AD.gameScene.wipUp();
            cc.director.emit("人物开心4");
            AD.gameScene.createDialog("也许我也可以打扮一下", config.roleType.HUMAN);

            this.complete();

        }, this);
    },
    //本关完成
    complete() {
        this.scheduleOnce(function () {
            AD.gameScene.win();
        }, 2.5);
    },


});
