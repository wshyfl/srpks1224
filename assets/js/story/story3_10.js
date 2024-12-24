

cc.Class({
    extends: cc.Component,

    properties: {
        cameraNode: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.human = cc.find("human", this.node);
        this.cameraPos1 = cc.find("cameraPos1", this.node);
        this.xiaoFangYuan = cc.find("xiaoFangYuan", this.node);
        this.cat = cc.find("cat", this.node);
        
        this.effect = cc.find("effect", this.node);this.effect.active = false;
        AD.couldClear = false;//
        this.animation = this.xiaoFangYuan.getComponent(dragonBones.ArmatureDisplay);
    },

    start() {
        AD.handPosTemp = cc.v2(0,250)
        AD.gameScene.cameraGame.node.y = -200;
        AD.gameScene.cameraGame.zoomRatio = 2;

        cc.director.emit("人物摔倒");
        cc.director.emit("消防员蹲");
        AD.xiaoFangYuan.kouZhao(-1);
        AD.xiaoFangYuan.xue(0);
        cc.director.emit("猫待机");


        this.scheduleOnce(function () {
            AD.gameScene.createDialog("能告诉我你的名字吗？", config.roleType.HUMAN);
            AD.couldClear = true;//
        }, 3);



        //被擦干净了
        cc.director.on("完成", () => {
            AD.gameScene.wipUp();
            this.scheduleOnce(function () {
                this._armature = this.animation.armature();
                this.xue = this._armature.getSlot('JueSe2_tou');
                this.xue.displayIndex = 1;
                cc.director.emit("人物吻");
                this.effect.active = true;
                this.complete();
                // AD.human.biaoQing(33);
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
