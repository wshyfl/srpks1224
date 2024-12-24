

cc.Class({
    extends: cc.Component,

    properties: {
        cameraNode: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.human = cc.find("human", this.node);
        

        

        AD.couldClear = false;//
    },

    start() {

        cc.director.emit("人物睡觉");

        this.scheduleOnce(function () {
            AD.couldClear = true;//            
            AD.gameScene.createDialog("快点把她叫醒吧！", config.roleType.HUMAN);
        }, 1);


        //被擦干净了
        cc.director.on("完成", () => {
            AD.gameScene.wipUp();
            this.human.position = cc.v2(-35,-33);
            this.human.angle = -90;
            cc.director.emit("人物发抖站");
            this.zhanLi();
        }, this);
    },
    //本关完成
    complete() {
        this.scheduleOnce(function () {
            AD.gameScene.win();
        }, 2.5);
    },
    lightAct() {
        cc.tween(this.light)
            .delay(1)
            .to(1, { scale: 1 })
            .delay(1)
            .call(() => {
                AD.human.biaoQing("生气");
            })
            .delay(1)
            .call(() => {
                this.gaiBeiZi();
            })
            .start();
    },
    zhanLi() {
        cc.tween(this.human)
        .delay(3)
        .to(0.4,{x:120,y:-190,angle:0})
        .delay(2)
        .call(()=>{
            AD.human.biaoQing("生气");
        })
        .call(()=>{
            AD.gameScene.createDialog("啊..好冷好冷！", config.roleType.HUMAN);
            this.complete();

        })
        .start();
    },
});
