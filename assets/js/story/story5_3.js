

cc.Class({
    extends: cc.Component,

    properties: {
        humanCopy: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {

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
        this._weaponR.displayIndex = 0;

        //隐藏数




    },

    start() {



        AD.handPosTemp = cc.v2(-130,350)
        //主角走过来
        cc.director.emit("人物拿书待机");


        cc.director.emit("男人5打招呼");
        // AD.man_story5.timeScale(0.5)

        Tools.changeSlotTexture(this.human, "DJ_shu", -1);
        this.scheduleOnce(function () {
            cc.director.emit("男人5待机");
            this.scheduleOnce(function () {
                this._weaponR.displayIndex = 18;
                AD.couldClear = true;//
                AD.human.biaoQing(19);
                AD.gameScene.createDialog("他想约我出去，可是作业太多了", config.roleType.HUMAN);
                // cc.director.emit("人物5手放下");

                // AD.couldClear = true;//
            }, 1)

        }, 1)





        //被擦干净了
        cc.director.on("完成", () => {
            AD.gameScene.wipUp();

            AD.human.biaoQing(24);
            AD.gameScene.createDialog("这下可以去参加万圣节派对了", config.roleType.HUMAN);

            cc.director.emit("人物5亲吻待机");

            this.scheduleOnce(function () {
                cc.director.emit("人物待机捂嘴");
                this.complete();
            }, 1)

        }, this);
    },
    //本关完成
    complete() {
        this.scheduleOnce(function () {
            AD.gameScene.win();
        }, 2.5);
    },


});
