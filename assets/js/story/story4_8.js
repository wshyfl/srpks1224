

cc.Class({
    extends: cc.Component,

    properties: {
        man: cc.Node,
        girl: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.cameraPos1 = cc.find("cameraPos1", this.node);
        this.human = cc.find("human", this.node);
        this.effect = cc.find("effect", this.node); this.effect.active = false;
        this.effectHeart = cc.find("effectHeart", this.node); this.effectHeart.active = false;
        this.yongBao = cc.find("yongBao", this.node); this.yongBao.active = false;




    },

    start() {
        AD.handPosTemp = cc.v2(0,320)
        //真人 换成 舞会装
        for (var i = 0; i < AD.humanSoltNameArr.length; i++) {
            Tools.changeSlotTexture(this.human, AD.humanSoltNameArr[i], 3);
        }

        //主角走过来
        cc.director.emit("人物走");
        cc.director.emit("紫衣女孩待机");
        cc.director.emit("男人4待机");

        cc.tween(this.human)
            .to(1.5, { x: -200 })
            .call(() => {
                cc.director.emit("人物待机");
                cc.director.emit("紫衣女孩生气");
                AD.human.biaoQing(5);
                AD.gameScene.createDialog("hello，你们好！", config.roleType.HUMAN);
                AD.couldClear = true;//
                this.effect.active = true;
                this.man.scaleX = -1 * this.man.scaleX;

            })
            .start();





        //被擦干净了
        cc.director.on("完成", () => {
            console.log("dddddddddd")
            AD.gameScene.wipUp();
            AD.human.biaoQing("得意");
            AD.human.changeHair(0);
            AD.human.changeYanJing(-1);
            for (var i = 0; i < AD.humanSoltNameArr.length; i++) {
                Tools.changeSlotTexture(this.human, AD.humanSoltNameArr[i], 3);
            }


            cc.tween(this.man)
                .call(() => {
                    cc.director.emit("男人4走");
                })
                .to(1, { x: -76 })
                .call(() => {
                    this.man.active = this.human.active = false;
                    this.effectHeart.active = this.yongBao.active = true;
                    AD.gameScene.changeCamera(1.5, this.cameraPos1, 1);
                })
                .call(() => {

                    AD.gameScene.createDialog("这感觉就像童话故事一样！", config.roleType.HUMAN);
                    this.complete();
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


});
