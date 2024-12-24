

cc.Class({
    extends: cc.Component,

    properties: {
        humanCopy: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.cameraPos1 = cc.find("cameraPos1", this.node);
        this.cameraPos2 = cc.find("cameraPos2", this.node);
        this.cameraPos3 = cc.find("cameraPos3", this.node);
        this.human = cc.find("human", this.node);
        this.man = cc.find("man5", this.node);


        AD.couldClear = false;//
        this.animation = this.humanCopy.getComponent(dragonBones.ArmatureDisplay);
        this.animation.playAnimation("5_nashudaiji", 0);

        for (var i = 0; i < AD.humanSoltNameArr.length; i++) {
            Tools.changeSlotTexture(this.humanCopy, AD.humanSoltNameArr[i], AD.globalNode.getSkinIndex());
        }

        this._armature = this.animation.armature();
        this._weaponR = this._armature.getSlot('JueSe_tou');
        this._weaponR.displayIndex = 26 - 1;

        this.index = 0;
        this.func = function () {
            this.index++;
            if (this.index % 2 == 0) {

                this._weaponR.displayIndex = 26 - 1;
            }
            else {

                this._weaponR.displayIndex = 27 - 1;
            }
        };
        this.schedule(this.func, 1)

    },

    start() {
        AD.handPosTemp = cc.v2(0,400)
        // AD.gameScene.cameraGame.node.x = -100;
        // AD.gameScene.cameraGame.zoomRatio = 1.5;


        //主角走过来
        cc.director.emit("人物拿书待机");
        AD.human.biaoQing(24);


        cc.director.emit("男人5走");
        // AD.man_story5.timeScale(0.5)


        // AD.gameScene.changeCamera(1.5, this.cameraPos1, 1.5);
        cc.tween(this.man)
            .to(1.5, { x: -180 })
            .call(() => {
                cc.director.emit("男人5待机");
            })

            .start();
        cc.tween(this.node)
            .delay(2)
            .call(() => {
                AD.gameScene.changeCamera(2, this.cameraPos2, 1);
            })
            .delay(0.5)
            .call(() => {
                AD.couldClear = true;//
                AD.gameScene.createDialog("我不想让他看到我这样......", config.roleType.HUMAN);
            })
            .start()




        //被擦干净了
        cc.director.on("完成", () => {
            this.unschedule(this.func);
            console.log("dddddddddd")
            AD.gameScene.wipUp();
            AD.gameScene.changeCamera(1, this.cameraPos3, 0.5);
            this.scheduleOnce(function () {

                AD.gameScene.createDialog("这下好多了！", config.roleType.HUMAN);
                this.complete();
            }, 1)
            // AD.human.biaoQing("得意");
            // AD.human.changeHair(0);
            // AD.human.changeYanJing(-1);
            // for (var i = 0; i < AD.humanSoltNameArr.length; i++) {
            //     Tools.changeSlotTexture(this.human, AD.humanSoltNameArr[i], 3);
            // }




        }, this);
    },
    //本关完成
    complete() {
        this.scheduleOnce(function () {
            AD.gameScene.win();
        }, 2.5);
    },


});
