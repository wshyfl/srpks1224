

cc.Class({
    extends: cc.Component,

    properties: {
        xianLuXiang: cc.Node,
        xian: cc.Node,
        xianCopy: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.cameraPos1 = cc.find("cameraPos1", this.node);
        this.tongFengKou = cc.find("tongFengKou", this.node);
        this.map = cc.find("map", this.node);
        this.guang = cc.find("guang", this.node);
        this.xianLuXiang.scale = 0; this.xianLuXiang.active = false; this.xian.active = false; this.xianCopy.active = true;
        this.human = cc.find("human", this.node);
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
        cc.director.emit("人物待机");

        this.scheduleOnce(function () {
            this.xianLuXiang.active = true; this.xianLuXiang.scale = 0;
            cc.tween(this.xianLuXiang)
                .to(0.5, { scale: 1 })
                .delay(1)
                .call(() => {
                    this.xian.active = true; this.xianCopy.active = false;
                    AD.gameScene.createDialog("剪掉哪个才是安全的？", config.roleType.HUMAN);
                    AD.couldClear = true;
                })
                .start();
        }, 1)

        //被擦干净了
        cc.director.on("完成", () => {

            AD.gameScene.wipUp();

            this.scheduleOnce(function () {
                cc.tween(this.xianLuXiang)
                .to(0.6,{scale:0})
                .call(()=>{
                    cc.tween(this.guang)
                    .to(0.3,{scaleY:0})
                    .start();
                    cc.director.emit("人物6耶");
                })
                .delay(1)
                .call(()=>{
                    cc.director.emit("人物6拿地图");                    
                })
                .delay(0.3)
                .call(()=>{
                    this.map.active = false;        
                })
                .delay(1)
                .call(()=>{
                    AD.gameScene.createDialog("顺利完成任务", config.roleType.HUMAN);
                    this.complete();
                })
                

                .start();
            }, 1)


        }, this);
    },
    //本关完成
    complete() {
        this.scheduleOnce(function () {
            AD.gameScene.win();
        }, 2);
    },
    

});
