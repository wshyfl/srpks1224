

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
        this.shanDian = cc.find("shanDian", this.node); this.shanDian.active = false;
        this.step = 0;
        AD.couldClear = false;//

    },

    start() {

        cc.director.emit("人物待机捂嘴");
        this.scheduleOnce(function () {
            AD.gameScene.createDialog("额..这感觉也不像古代啊", config.roleType.HUMAN);
        }, 1);
        this.scheduleOnce(function () {
            AD.gameScene.createDialog("越看越像个浴室", config.roleType.HUMAN);
            this.scheduleOnce(function () {

                AD.couldClear = true;//
                AD.gameScene.changeCamera(1.5, this.cameraNode, 0.4);
            }, 2)
        }, 3.5);

        //窗帘被擦干净了
        cc.director.on("完成", () => {
            AD.audioMng.playSfx("外星人")
            AD.human.biaoQing("惊讶");
            //角色相关
            AD.gameScene.wipUp();
            this.scheduleOnce(function () {
                //相机复位
                AD.gameScene.changeCamera(1, this.node, 1.5);
                //人物转身跑到门口
                cc.director.emit("人物跑");

                this.action2();
                this.action();
                //外星人跑过来招手

                cc.director.emit("外星人走");
                cc.tween(this.waiXingRen)
                    .to(2, { x: 100, y: -240 })
                    .call(() => {
                        cc.director.emit("外星人挥手");
                    })
                    .start();

            }, 3)
        }, this);
    },

    //开门
    action() {
        cc.tween(this.door)
            .delay(0.5)
            .to(0.3, { x: -80 })
            .delay(0.2)
            .call(() => {
            })
            .start();
    },
    //人物走过去
    action2() {
        cc.tween(this.human)
            .to(0.01, { scaleX: -1 * this.human.scaleX })
            .to(1.5, { x: -160 })
            .call(() => {
                this.human.active = false;
                this.action3();
            })
            .start();
    },
    //关门
    action3() {
        cc.tween(this.door)
            .to(0.3, { x: -170 })
            .to(0.1, { x: -160 })
            .delay(1)
            .call(() => {
                AD.gameScene.createDialog("对不起，打扰了外星人老哥。", config.roleType.HUMAN);
                this.shanDian.active = true;
                this.scheduleOnce(function () {
                    AD.gameScene.win();
                }, 2.5);
            })
            .start();
    },

    update(dt) {

    },
});
