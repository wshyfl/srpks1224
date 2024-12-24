

cc.Class({
    extends: cc.Component,

    properties: {
        cameraNode: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.human = cc.find("human", this.node);
        this.shuiParent = cc.find("shuiParent", this.node);
        this.yiZi = cc.find("yiZi", this.node); this.yiZi.active = true;
        this.shui = cc.find("shui", this.node); this.shui.active = true;


      this.actYiZi = cc.tween(this.yiZi)
        .repeatForever(
            cc.tween()
                .by(1, { y: 30}, { easing: "sineInOut" })
                .delay(this.duration)
                .by(1, { y: -30 }, { easing: "sineInOut" })
                .delay(0.3)
        );
        this.actYiZi.start();

        AD.couldClear = false;//
    },

    start() {
        cc.director.emit("人物游泳");
        AD.human.biaoQing("生气");

        this.scheduleOnce(function () {
            AD.gameScene.createDialog("啊哦，这屋子里成泳池了", config.roleType.HUMAN);
            this.scheduleOnce(function () {
                AD.couldClear = true;//
            }, 2);
        }, 1);


        //被擦干净了
        cc.director.on("完成", () => {
            AD.gameScene.wipUp();
            this.scheduleOnce(function(){
                this.waterClean();
                cc.director.emit("人物待机捂嘴");
                AD.human.biaoQing("开心");
            },2)
            cc.tween(this.shui)
                .to(3, { scaleX: 1,scaleY: 1 })
                .call(()=>{
                    this.shui.parent = this.shuiParent
                })
                .start();
        }, this);
    },
    //本关完成
    complete() {
        this.scheduleOnce(function () {
            AD.gameScene.win();
        }, 2.5);
    },
    //水没了
    waterClean() {
        
        this.actYiZi.stop();
        cc.tween(this.yiZi)
            .to(0.4, {y:-190,angle:-90 })
            .call(() => {
                
            })
            .delay(0.5)
            .call(() => {
                // AD.human.biaoQing("开心");
                
                AD.gameScene.createDialog("水都流下去喽！", config.roleType.HUMAN);
                this.complete();
            })
            .start();
    },
    // update (dt) {},
});
