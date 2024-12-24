

cc.Class({
    extends: cc.Component,

    properties: {
        door: cc.Node,
        cameraNode: cc.Node,
    },
    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.human = cc.find("human", this.node);
        this.waiXingRen = cc.find("waiXingRen", this.node);
        this.shanDian = cc.find("shanDian", this.node); this.shanDian.active = true;
        this.step = 0;
        AD.couldClear = false;//

    },

    start() {

        
        cc.director.emit("外星人挥手");
        this.scheduleOnce(function () {
            AD.gameScene.createDialog("准备再次穿越...", config.roleType.HUMAN);
            AD.couldClear = true;//
        }, 1);

        

        //窗帘被擦干净了
        cc.director.on("完成", () => {
            this.shanDian.active = false;
            this.waiXingRen.active = false;
            AD.gameScene.wipUp();
            this.scheduleOnce(function () {
                this.openDoor();//开门
            }, 1.5);

        }, this);
    },
    //开门
    openDoor() {
        cc.tween(this.door)
            .delay(0.5)
            .to(0.3, { x: -80 })
            .delay(0.2)
            .call(() => {
                this.human.active = true;
                AD.human.biaoQing("待机");
                cc.director.emit("人物待机");
            })
            .delay(1)
            .call(() => {
                AD.human.biaoQing("待机");
                cc.director.emit("人物走");
                this.closeDoor();
                this.action();
            })
            .start();
    },
    //人物走过去
    action() {
        cc.tween(this.human)
            .to(1.5, { x: 100 })
            .call(() => {
                             
                AD.human.biaoQing("待机");
                cc.director.emit("人物待机捂嘴");

                AD.gameScene.createDialog("我想这次应该对了吧！", config.roleType.HUMAN);
                // AD.gameScene.createDialog("快点，我们回家吧！ ", config.roleType.HUMAN);
                this.shanDian.active = true;
                this.scheduleOnce(function () {
                    AD.gameScene.win();
                }, 2.5);
            })
            .start();
    },
    //关门
    closeDoor() {
        cc.tween(this.door)
            .to(1, { x: -170 })
            .to(0.1, { x: -160 })
            .delay(1)
            .call(() => {
              
            })
            .start();
    },
    
    update(dt) {

    },
});
