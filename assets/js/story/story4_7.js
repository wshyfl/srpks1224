

cc.Class({
    extends: cc.Component,

    properties: {
        human: cc.Node,
        humanDaiJi: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.cameraPos1 = cc.find("cameraPos1", this.node);
        this.effect = cc.find("effect", this.node); this.effect.active = false;


        this.animation = this.humanDaiJi.getComponent(dragonBones.ArmatureDisplay);
        this.animation.playAnimation("daiji2", 0);
        this._armature = this.animation.armature();
        this._weaponR = this._armature.getSlot('JueSe_hair');
        this._weaponR.displayIndex = 0;
        AD.couldClear = false;//

        AD.couldClear = false;//
        //被擦掉的换成主角衣服
        for (var i = 0; i < AD.humanSoltNameArr.length; i++) {
            Tools.changeSlotTexture(this.humanDaiJi, AD.humanSoltNameArr[i], AD.globalNode.getSkinIndex());
        }
    },

    start() {
        AD.handPosTemp = cc.v2(0,300)
        //真人 换成 短裤装
        for (var i = 0; i < AD.humanSoltNameArr.length; i++) {
            Tools.changeSlotTexture(this.human, AD.humanSoltNameArr[i], 0);
        }

        cc.director.emit("人物待机");
        AD.human.changeHair(0);
        // AD.human.changeYanJing(0);
        AD.gameScene.changeCamera(1.2, this.cameraPos1, 0.2);


        this.scheduleOnce(function () {
            AD.gameScene.createDialog("换上好看的衣服！", config.roleType.HUMAN);
            AD.couldClear = true;//
        }, 1);


        //被擦干净了
        cc.director.on("完成", () => {
            console.log("dddddddddd")
            this.effect.active = true;
            AD.gameScene.wipUp();
            AD.human.biaoQing("得意");
            cc.director.emit("人物开心4");
            AD.human.changeHair(0);
            AD.human.changeYanJing(-1);
            for (var i = 0; i < AD.humanSoltNameArr.length; i++) {
                Tools.changeSlotTexture(this.human, AD.humanSoltNameArr[i], 3);
            }
    

            AD.gameScene.createDialog("接下来去参加舞会吧", config.roleType.HUMAN);

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
