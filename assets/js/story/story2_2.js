

cc.Class({
    extends: cc.Component,

    properties: {
        cameraNode: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.human = cc.find("human", this.node);
        this.huo = cc.find("huo", this.node);this.huo.active = false;

        this.fangDaJing = cc.find("fangDaJing", this.node);
      
        
        this.guangMask = cc.find("guangMask", this.node);this.guangMask.height = 0;

        AD.couldClear = false;//
    },

    start() {
        cc.director.emit("人物待机坐");
        AD.human.biaoQing("生气");

        this.scheduleOnce(function () {
            AD.gameScene.createDialog("要是能把绳子烧掉就好了", config.roleType.HUMAN);
            this.scheduleOnce(function () {
                AD.couldClear = true;//
            }, 2);
        }, 1);


        //被擦干净了
        cc.director.on("完成", () => {
            AD.gameScene.wipUp();

            this.scheduleOnce(function () {
                this.fire();

            }, 1)
        }, this);
    },
    //本关完成
    complete() {
        this.scheduleOnce(function () {
            AD.gameScene.win();
        }, 2.5);
    },
    //放大镜  着火
    fire() {
        cc.tween(this.guangMask)
            .to(1, { height: 395 })
            .call(() => {
                this.huo.active = true;
            })
            .delay(0.5)
            .call(() => {
                AD.gameScene.createDialog("别让火烧到我自己", config.roleType.HUMAN);
                // AD.human.biaoQing("开心");
                this.complete();
            })
            .start();
    },
    // update (dt) {},
});
