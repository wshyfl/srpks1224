

cc.Class({
    extends: cc.Component,

    properties: {
        you: cc.Node,
        you2: cc.Node,
        humanCopy: cc.Node,
        humanCopy2: cc.Node,
        
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.cameraPos1 = cc.find("cameraPos1", this.node);
        this.human = cc.find("human", this.node); this.human.opacity = 0;
        this.tongFengKong = cc.find("tongFengKong", this.node); this.tongFengKong.active = true;
        this.tongFengKongCopy = cc.find("tongFengKongCopy", this.node); this.tongFengKongCopy.active = false;
        AD.couldClear = false;//
        this.humanCopy.active = this.you.active = true;

        this.you2.active = this.humanCopy2.active = false;
        
        //被擦掉的换成主角衣服
        for (var i = 0; i < AD.humanSoltNameArr.length; i++) {
            Tools.changeSlotTexture(this.humanCopy, AD.humanSoltNameArr[i], AD.globalNode.getSkinIndex());
            Tools.changeSlotTexture(this.humanCopy2, AD.humanSoltNameArr[i], AD.globalNode.getSkinIndex());
        }
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
        cc.director.emit("人物待机");
        this.tongFengKongAct();

        

        //被擦干净了
        cc.director.on("完成", () => {
            AD.gameScene.wipUp();
            cc.director.emit("人物6耶");
            this.humanAct();
        }, this);
    },
    //本关完成
    complete() {
        this.scheduleOnce(function () {
            AD.gameScene.win();
        }, 2);
    },

    humanAct() {

        
        cc.tween(this.human)
            .delay(1)
            .call(() => {
                cc.director.emit("人物跳窗");
            })
            .to(0.5, { x: -20, y: -140,})
            .delay(0.5)
            .call(() => {
                this.human.opacity = 0;
                this.humanCopy2Act();
            })
            .start();
    },
    humanCopyAct(){
        cc.tween(this.humanCopy)
        .to(0.5,{y:-260})
        .call(()=>{
            this.humanCopy.opacity=0;
            this.human.opacity=255;
            cc.director.emit("人物6落地2");

        })
        .delay(0.4)
        .call(()=>{
            cc.director.emit("人物待机劈腿");
        })
        .delay(1)
        .call(()=>{

            AD.gameScene.createDialog("他们在找我了，赶紧躲起来！", config.roleType.HUMAN);
            AD.couldClear = true;
        })
        .start();
    },
    humanCopy2Act(){
        this.you2.active = true;this.humanCopy2.active = true;
        this.scheduleOnce(function(){
            this.animation = this.humanCopy2.getComponent(dragonBones.ArmatureDisplay);
            this.animation.playAnimation("6_zaijian2", 1);
        },1);
        cc.tween(this.humanCopy2)
        .delay(1)
        .by(1.5,{y:-200})
        .delay(1)
        .call(()=>{
            AD.gameScene.createDialog("又一次完美完成任务！", config.roleType.HUMAN);
            this.complete();
        })
        .start();

    },
    tongFengKongAct(){
        cc.tween(this.tongFengKong)
        .delay(1)
        .to(0.5,{position:this.tongFengKongCopy.position,angle:800})
        .call(()=>{
            
        this.humanCopyAct();
        })
        .start();
    },
});
