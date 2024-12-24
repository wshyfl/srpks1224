

cc.Class({
    extends: cc.Component,

    properties: {
        door: cc.Node,
        cameraNode: cc.Node,
        miFengPointArr: {
            default: [],
            type: [cc.Node]
        }
    },
    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.human = cc.find("human", this.node);
        this.miFeng = cc.find("miFeng", this.node);
        this.zhiZhu = cc.find("zhiZhu", this.node);
        this.step = 0;
        AD.couldClear = false;//

    },

    start() {


        AD.human.biaoQing(3);
        cc.director.emit("人物跑");
        this.action();
        AD.gameScene.changeCamera(1, this.cameraNode, 3);
        // //窗帘被擦干净了
        cc.director.on("完成", () => {
            AD.gameScene.wipUp();
            this.miFengMove();
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
            .to(3, { x: -580 })
            .call(() => {

                AD.human.biaoQing("恐惧");
                cc.director.emit("人物待机捂嘴");
                this.scheduleOnce(function () {

                    AD.gameScene.createDialog("晕，蜘蛛竟然挡住了时光机", config.roleType.HUMAN);
                    AD.couldClear = true;//
                }, 0.5)
                // cc.director.emit("人物待机捂嘴");
                // AD.human.biaoQing("疑惑");
            })
            .start();
    },
    miFengMove() {
        cc.director.on("捉住苍蝇",function(){
            this.miFeng.scale = 0;
        },this);
        this.miFeng.getComponent(cc.Animation).play();
        cc.tween(this.miFeng)
            .delay(2)
            .call(() => {
                cc.director.emit("蜘蛛攻击");
            })
            .delay(1.24)
            // .to(0.05, { position: this.miFengPointArr[4].position, angle: -60, scale: 0.8 })
            .delay(1)
            .call(() => {

                AD.gameScene.createDialog("这个蜘蛛可太凶了", config.roleType.HUMAN);
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
