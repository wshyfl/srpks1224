

cc.Class({
    extends: cc.Component,

    properties: {
        door: cc.Node,
        cameraNode: cc.Node,
    },
    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.human = cc.find("human", this.node); this.human.active = false;
        this.miFeng = cc.find("miFeng", this.node);
        this.zhiZhu = cc.find("zhiZhu", this.node);
        this.shanDian = cc.find("shanDian", this.node); this.shanDian.active = true;
        this.step = 0;
        AD.couldClear = false;//

    },

    start() {

        this.scheduleOnce(function () {
            AD.gameScene.createDialog("我们还是回去吧", config.roleType.HUMAN);
            this.scheduleOnce(function () {
                AD.couldClear = true;//
            }, 2);
        }, 1);
        

        //被擦干净了
        cc.director.on("完成", () => {
            AD.gameScene.wipUp();
            this.openDoor();
        }, this);

    },
    
    //开门
    openDoor() {
        cc.tween(this.door)
            .delay(0.5)
            .by(0.6, { x: 80 })
            .delay(0.3)
            .call(() => {
                this.human.active = true;
                AD.human.biaoQing("待机");
                cc.director.emit("人物待机");
            })
            .delay(0.5)
            .call(() => {
                this.action();
            })
            .delay(0.5)
            .call(() => {
                this.closeDoor();
            })
            .start();
    },
    //人物走过去
    action() {

        cc.director.emit("人物走");
        cc.tween(this.human)
            .to(0.02,{scaleX:-1*this.human.scaleX})

            .by(2, { x: 250 })
            .call(() => {
                AD.human.biaoQing("高兴");
                cc.director.emit("人物高兴");
                AD.gameScene.createDialog("回家的感觉真好！", config.roleType.HUMAN);
            })
            .delay(2.5)
            .call(() => {
                AD.gameScene.win();
            })
            .start();
    },

    //关门
    closeDoor() {
        cc.tween(this.door)
            .by(0.2, { x: -90 })
            .by(0.1, { x: 10 })
            .start();
    },

    update(dt) {

    },
});
