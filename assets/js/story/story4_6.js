

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
        this._weaponR.displayIndex = 1;

           //被擦掉的换成主角衣服
           for (var i = 0; i < AD.humanSoltNameArr.length; i++) {
            Tools.changeSlotTexture(this.humanDaiJi, AD.humanSoltNameArr[i], AD.globalNode.getSkinIndex());
        }
    },

    start() {
        AD.handPosTemp = cc.v2(0,570)

        cc.director.emit("人物待机");
        AD.human.changeHair(-1);
        // AD.human.changeYanJing(0);
        AD.gameScene.changeCamera(1.5, this.cameraPos1, 0.2);


        this.scheduleOnce(function () {
            AD.gameScene.createDialog("整理下我的头发吧", config.roleType.HUMAN);
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



            AD.gameScene.createDialog("好了，漂亮小姐姐！", config.roleType.HUMAN);

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
