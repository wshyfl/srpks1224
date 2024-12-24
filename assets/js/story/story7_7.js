

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



        
        this.chuiZiCopy = cc.find("chuiZiCopy", this.node);
        this.zhuZi = cc.find("zhuZi", this.node);
        this.zhuZiCopy = cc.find("zhuZiCopy", this.node);
        this.zhongDuan = cc.find("zhongDuan", this.node);

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
        AD.handPosTemp = cc.v2(40, -40);
        cc.director.on("动画播放完毕", function () {
            this.zhongDuan.active = false;
            this.zhuZi.active = false;
            this.zhuZiCopy.active = true;
            this.scheduleOnce(function(){


                var _animation = this.yeRen.getComponent(dragonBones.ArmatureDisplay);
                _animation.playAnimation("siwang2", 1);


                var _animation2 = this.yeRen2.getComponent(dragonBones.ArmatureDisplay);
                _animation2.playAnimation("siwang1", 1);

            },0.4)
        }, this)

        cc.director.emit("人物7烤");
        Tools.changeSlotTexture(this.yeRen, "wuqi1", -1);
        Tools.changeSlotTexture(this.human, "JueSe_jiao02", 13);
        Tools.changeSlotTexture(this.human, "JueSe_jiao01", 13);
        this.scheduleOnce(function () {
            AD.gameScene.createDialog("天哪，我不会要被吃了吧", config.roleType.HUMAN);
            AD.couldClear = true;//
        }, 1)




        //被擦干净了
        cc.director.on("完成", () => {
            AD.gameScene.wipUp();
            
            this.chuiZiCopy.active = true;

            
            this.scheduleOnce(function () {
                AD.gameScene.createDialog("他们暂时不会起来了吧", config.roleType.HUMAN);
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
