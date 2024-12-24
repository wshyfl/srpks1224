

cc.Class({
    extends: cc.Component,

    properties: {
        cameraNode: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.human = cc.find("human", this.node);
        this.kongLong = cc.find("kongLong", this.node);this.kongLong.active =false;
        this.waiXingRen = cc.find("waiXingRen", this.node);this.waiXingRen.active =false;
        this.shanDian = cc.find("shanDian", this.node);this.shanDian.active =false;
        this.step = 0;
        AD.couldClear = false;//
    },
    
    start() {
        this.scheduleOnce(function () {
            AD.gameScene.createDialog("这个机器留着太危险了", config.roleType.HUMAN);
            this.scheduleOnce(function () {
                AD.couldClear = true;//
            }, 2);
        }, 1);
        

        //被擦干净了
        cc.director.on("完成", () => {
            AD.gameScene.wipUp();
            this.kongLong.active =true;
            this.waiXingRen.active =true;
            cc.director.emit("外星人挥手");
            AD.human.biaoQing("惊讶");
            cc.director.emit("人物待机捂嘴");
            this.kongLongHou();

            this.scheduleOnce(function(){
                
                AD.gameScene.changeCamera(2, this.cameraNode, 0.4);
                this.scheduleOnce(function(){
                    AD.gameScene.createDialog("天哪，它们怎么过来了？", config.roleType.HUMAN);
                    this.scheduleOnce(function () {
                        AD.gameScene.win();
                    }, 2.5);
                },2)
            },3)
        }, this);
    },

    kongLongHou() {
        cc.director.emit("恐龙吼");
        this.schedule(function(){
            
        cc.director.emit("恐龙吼");
        },1,2)
        
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
            .to(0.01, { scaleX: -1*this.human.scaleX })
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
    

    // update (dt) {},
});
