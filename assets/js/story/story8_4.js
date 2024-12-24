

cc.Class({
    extends: cc.Component,

    properties: {
        jiangShi: cc.Node,
        guiZi: cc.Node,
        guiZiCopy: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {


        this.human = cc.find("human", this.node);
        this.cameraPos = cc.find("cameraPos", this.node);

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
        // AD.gameScene.cameraGame.node.x = 200;
        // AD.gameScene.cameraGame.node.y = 200;
        // AD.gameScene.cameraGame.zoomRatio = 1.5;
        // AD.gameScene.changeCamera(1.5, this.cameraPos, 2);
        // this.scheduleOnce(function(){
        //     AD.gameScene.changeCamera(1, this.cameraPos, 1);
        // },2)
        AD.handPosTemp = cc.v2(0, 0);
        this.jiangShiAct();


        cc.director.emit("人物待机捂嘴");
        AD.human.biaoQing("害怕");
        //被擦干净了
        cc.director.on("完成", () => {
            AD.gameScene.wipUp();

            this.guiZi.active = true;
            this.guiZiAct();

        }, this);
    },
    //本关完成
    complete() {
        this.scheduleOnce(function () {
            AD.gameScene.win();
        }, 2);
    },
    guiZiAct() {
        cc.tween(this.guiZi)
            .to(0.5, { position: this.guiZiCopy.position, angle: this.guiZiCopy.angle })
            .call(() => {

                // cc.director.emit("人物高兴");
                var _jiangShi1 = this.jiangShi.children[0];
                var _jiangShi2 = this.jiangShi.children[1];
                _jiangShi1.getComponent(dragonBones.ArmatureDisplay).playAnimation("daodi", 1);
                _jiangShi2.getComponent(dragonBones.ArmatureDisplay).playAnimation("daodi", 1);
            })
            .delay(0.5)
            .call(()=>{
                
                this.humanAct();
            })
            .delay(2)
            .call(() => {
                AD.gameScene.createDialog("先用柜子挡住他们", config.roleType.HUMAN);
                this.complete();
            })
            .start();
    },

    humanAct(){
        cc.director.emit("人物跑");
        AD.human.biaoQing("惊讶");
        this.human.scaleX = -0.7;
        cc.tween(this.human)
            .to(2, { x: 530, y: 438 })
            
            .start();
    },
    jiangShiAct() {
        var _jiangShi1 = this.jiangShi.children[0];
        var _jiangShi2 = this.jiangShi.children[1];


        cc.tween(this.jiangShi)
            .to(3, { x: 160, y: -450 })
            .call(() => {
                _jiangShi1.getComponent(dragonBones.ArmatureDisplay).playAnimation("daiji", 0);
                _jiangShi2.getComponent(dragonBones.ArmatureDisplay).playAnimation("daiji", 0);
                var _sfxIndex = 0;
                AD.audioMng.playSfx("僵尸1");
                this.schedule(function () {
                    _sfxIndex++;
                    if (!AD.gameScene.gameOver) {
                        _sfxIndex++;
                        if (_sfxIndex % 2 == 0)
                            AD.audioMng.playSfx("僵尸1");
                        else
                            AD.audioMng.playSfx("僵尸2");
                    }

                }, 3)
            })
            .delay(0.1)
            .call(() => {
                AD.gameScene.createDialog("楼下也有僵尸上来了！", config.roleType.HUMAN);
                AD.couldClear = true;
            })
            .start();
    },
});
