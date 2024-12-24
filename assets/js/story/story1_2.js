

cc.Class({
    extends: cc.Component,

    properties: {
        door: cc.Node,

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.human = cc.find("human", this.node);
        this.shanDian = cc.find("shanDian", this.node); this.shanDian.active = false;
        this.step = 0;
        AD.couldClear = false;//
    },

    start() {
        this.scheduleOnce(this.action, 1);

        cc.director.on("完成", () => {
            AD.gameScene.wipUp();
            this.human.active = true;
            this.action4();
            this.shanDian.active = false;
            // this.shanNow();
        }, this);

        cc.director.emit("人物待机");
    },

    //开门
    action() {
        cc.tween(this.door)
            .to(1, { x: -80 })
            .delay(0.5)
            .call(() => {
                cc.director.emit("人物走");
                this.action2();
            })
            .start();
    },
    //人物走过去
    action2() {
        cc.tween(this.human)
            .to(2, { x: -195 })
            .to(0.01, { scaleX: -1 * this.human.scaleX })
            .delay(0.2)
            .call(() => {
                this.human.active = false;
                this.action3();
            })
            .start();
    },
    //关门
    action3() {
        cc.tween(this.door)
            .to(1, { x: -170 })
            .to(0.2, { x: -160 })
            .call(() => {
                AD.gameScene.createDialog("让我们回到过去吧！", config.roleType.HUMAN);
                this.shanDian.active = true;
                AD.couldClear = true;//
            })
            .start();
    },
    //人物走出来
    action4() {
        cc.tween(this.human)
            .to(2, { x: 85 })
            .delay(0.2)
            .call(() => {

                cc.director.emit("人物高兴");
                //角色相关
                //胜利
                this.scheduleOnce(function () {
                    AD.gameScene.win();
                }, 2);
            })
            .start();
    },

    shanNow(){
        cc.tween(cc.find("shan",this.node))
        .to(0.3,{opacity:255})
        .call(()=>{
            cc.find("bg",this.node).active = true;
        })
        .to(0.3,{opacity:0})

        .start();
    }
    // update (dt) {},
});
