

cc.Class({
    extends: cc.Component,

    properties: {

        cameraNode: cc.Node,
    },
    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.human = cc.find("human", this.node);
        this.kongLong = cc.find("kongLong", this.node); this.kongLong.active = false;

        AD.couldClear = false;//

    },

    start() {

        cc.director.emit("人物走");
        AD.human.biaoQing("待机");
        this.action();
        this.scheduleOnce(function () {
            AD.gameScene.changeCamera(1, this.cameraNode, 2.7);
        }, 0.3)
        

        // //窗帘被擦干净了
        cc.director.on("完成", () => {
            //恐龙相关
            this.kongLong.active = true;
            this.kongLongHou();

            AD.gameScene.wipUp();
            this.scheduleOnce(function () {
                cc.director.emit("恐龙跑");
                cc.tween(this.kongLong)
                    .to(0.5, { x: this.kongLong.x - 100 })
                    .call(() => {
                        this.kongLongHouRepeat();
                    })
                    .delay(1.5)
                    .call(()=>{
                        cc.director.emit("恐龙待机");
                        AD.gameScene.createDialog("哇靠，竟然是恐龙，快跑！", config.roleType.HUMAN);
                        this.scheduleOnce(function () {
                            AD.gameScene.win();
                        }, 2.5);
                    })
                    
                    
                    .start();
            }, 1.5);

            //人物相关
            AD.human.biaoQing("恐惧");
            this.scheduleOnce(function(){
                this.human.scaleX = -1*this.human.scaleX;
                this.action2();//往回跑
                cc.director.emit("人物跑");
            },1.5)
          
        }, this);
    },
    kongLongHou() {

        cc.director.emit("恐龙吼");
        this.scheduleOnce(function () {
            cc.director.emit("恐龙吼");
        }, 0.8);
    },
    kongLongHouRepeat() {


        cc.director.emit("恐龙吼");
        this.scheduleOnce(function () {
            this.kongLongHouRepeat();
        }, 0.8);
    },

    //人物走过去
    action() {
        cc.tween(this.human)
            .to(3.0, { x: 520 })
            .call(() => {

                AD.couldClear = true;//
                AD.gameScene.createDialog("这是什么蛋，这么大？", config.roleType.HUMAN);
                cc.director.emit("人物待机捂嘴");
                AD.human.biaoQing("疑惑");
            })
            .start();
    },
    //人物往回跑
    action2() {
        cc.tween(this.human)
            .to(2, { x: 0 })
            .call(() => {
            })
            .start();
    },
    

    // update(dt) {

    // },
});
