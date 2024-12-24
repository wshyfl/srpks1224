

cc.Class({
    extends: cc.Component,

    properties: {
        jiangShi: cc.Node,

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
        var _sfxIndex = 0;
        AD.audioMng.playSfx("僵尸1");
        this.schedule(function () {
            if(!AD.gameScene.gameOver)
            {
                _sfxIndex++;
                if (_sfxIndex % 2 == 0)
                    AD.audioMng.playSfx("僵尸1");
                else
                    AD.audioMng.playSfx("僵尸2");
            }

        }, 3)

        AD.gameScene.cameraGame.zoomRatio = 1.5;
        AD.gameScene.cameraGame.node.x = -100;
        this.scheduleOnce(function () {
            AD.gameScene.changeCamera(1.5, this.cameraPos, 1);
            this.scheduleOnce(function () {
                AD.gameScene.changeCamera(1, this.cameraPos, 1);
                this.scheduleOnce(function () {
                    AD.gameScene.createDialog("我该怎么逃出去？", config.roleType.HUMAN);
                    AD.couldClear = true;//
                }, 1)
            }, 1)
        }, 1)

        AD.handPosTemp = cc.v2(0, 0);
        cc.director.emit("人物7害怕2");



        //被擦干净了
        cc.director.on("完成", () => {
            
            this.jiangShiAct();
            AD.gameScene.wipUp();
            this.humanAct();
        }, this);
    },
    //本关完成
    complete() {
        this.scheduleOnce(function () {
            AD.gameScene.win();
        }, 3);
    },
    humanAct() {
        this.human.scaleX = -1;
        cc.director.emit("人物跑");
        AD.human.biaoQing("惊讶");
        cc.tween(this.human)
            .to(1, { x: 220, y: -270, scaleX: -0.8, scaleY: 0.8 })
            .call(() => {
                this.human.active = false;
                AD.gameScene.createDialog("快从安全通道溜走", config.roleType.HUMAN);
                this.complete();
            })
            .start();
    },

    jiangShiAct(){
        var _jiangShi1 = this.jiangShi.children[0];
        var _jiangShi2 = this.jiangShi.children[1];
        
        _jiangShi1.getComponent(dragonBones.ArmatureDisplay).playAnimation("yidong", 0);
        cc.tween(_jiangShi1)
        .to(5,{x:147,y:-277,scaleX:-0.8,scaleY:0.8})
        .call(()=>{
            _jiangShi1.getComponent(dragonBones.ArmatureDisplay).playAnimation("daiji", 0);
        })
        // 
        // .to(0.2,{opacity:0})
        .start();
        this.scheduleOnce(function(){
            
        _jiangShi2.getComponent(dragonBones.ArmatureDisplay).playAnimation("yidong", 0);
        cc.tween(_jiangShi2)
        .to(5,{x:250,y:-400,scaleX:-0.8,scaleY:0.8})
        .call(()=>{
            _jiangShi2.getComponent(dragonBones.ArmatureDisplay).playAnimation("daiji", 0);
        })
        // .to(0.2,{opacity:0})
        .start();
        },0.5)
    },
});
