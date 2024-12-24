

cc.Class({
    extends: cc.Component,

    properties: {


    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.cameraPos1 = cc.find("cameraPos1", this.node);
        this.human = cc.find("human", this.node);
        this.kongCheng = cc.find("kongCheng", this.node);
        this.jiangLuoSan = cc.find("jiangLuoSan", this.node);

        AD.couldClear = false;//


    },

    // AD.handPosTemp = cc.v2(0,400)
    // AD.gameScene.cameraGame.node.x = -100;
    // AD.gameScene.cameraGame.zoomRatio = 1.5;
    // AD.gameScene.changeCamera(1, this.cameraPos3, 0.5);
    // AD.human.biaoQing(19);
    // cc.director.emit("军人6待机");
    // cc.director.emit("人物5亲吻待机");
    // AD.gameScene.createDialog("我要除掉这个保安！", config.roleType.HUMAN);
    start() {
        AD.handPosTemp = cc.v2(180, 60);
        cc.director.emit("人物7跳伞2");
        cc.director.emit("空乘死亡");
        Tools.changeSlotTexture(this.human, "JueSe_jiao02", 0);
        Tools.changeSlotTexture(this.kongCheng, "JueSe2_xie01", 1);
        Tools.changeSlotTexture(this.kongCheng, "JueSe2_xie02", 1);

  
        cc.tween(this.jiangLuoSan)
        .to(2,{y:191})
        .to(0.3,{opacity:0})
        .start();
        cc.tween(this.human)
        .to(2,{y:-293})
        .call(()=>{
            cc.director.emit("人物7害怕");
            // AD.human.biaoQing(19);
        })
        .delay(1)
        .call(()=>{
            this.caiShiTou();
            this.scheduleOnce(function () {
                AD.gameScene.createDialog("这些岩石扎的脚好疼！", config.roleType.HUMAN);
                AD.couldClear = true;//
            }, 3)
        })
        .start();

        this.speedRate = 1;


        //被擦干净了
        cc.director.on("完成", () => {
            AD.gameScene.wipUp();
            cc.director.emit("人物高兴");
            AD.human.biaoQing(18);
            this.scheduleOnce(function(){
                AD.gameScene.createDialog("借你的鞋穿一下", config.roleType.HUMAN);
                
            this.humanAct();
            },2.5)
            Tools.changeSlotTexture(this.human, "JueSe_jiao02", 13);
            Tools.changeSlotTexture(this.human, "JueSe_jiao01", 13);
            
            

        }, this);
    },
    //本关完成
    complete() {
        this.scheduleOnce(function () {
            AD.gameScene.win();
        }, 2);
    },

    humanAct() {
        cc.director.emit("人物走");   
        Tools.changeSlotTexture(this.human, "JueSe_jiao02", 13);
        Tools.changeSlotTexture(this.human, "JueSe_jiao01", 13);
        cc.tween(this.human)
        .to(2,{x:-600})
        .call(()=>{
            this.complete();
        })
        .start();

    },
    caiShiTou() {
        cc.tween(this.human)
            .repeat(2,
                cc.tween()
                    .call(() => {
                        cc.director.emit("人物7踩石头");
                    })
                    .by(0.5, { x: -200 })
                    .by(0.3, { x: 200 })
                    .delay(1)
            )
            .start();

    },
});
