

cc.Class({
    extends: cc.Component,

    properties: {
        humanCopy: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.cameraPos1 = cc.find("cameraPos1", this.node);
        this.human = cc.find("human", this.node);
        this.man = cc.find("man5", this.node);


        AD.couldClear = false;//
        

        

        

    },

    start() {
        


        //主角走过来
        cc.director.emit("人物拿书待机");
        AD.human.biaoQing(1);


        cc.director.emit("男人5打招呼");
        // AD.man_story5.timeScale(0.5)

        this.scheduleOnce(function(){
            cc.director.emit("男人5待机");
            // AD.gameScene.changeCamera(1.5, this.cameraPos1, 0.5);
            this.scheduleOnce(function(){
                AD.gameScene.createDialog("千万不能让他知道我暗恋他！", config.roleType.HUMAN);
                AD.couldClear = true;//
            },1)
    
        },1)

        



        //被擦干净了
        cc.director.on("完成", () => {
            AD.gameScene.wipUp();
            
        AD.human.biaoQing(24);
            AD.gameScene.createDialog("好险！", config.roleType.HUMAN);
           
            
            this.scheduleOnce(function () {

                this.complete();
                this.complete();
            }, 1)
            // AD.human.biaoQing("得意");
            // AD.human.changeHair(0);
            // AD.human.changeYanJing(-1);
            // for (var i = 0; i < AD.humanSoltNameArr.length; i++) {
            //     Tools.changeSlotTexture(this.human, AD.humanSoltNameArr[i], 3);
            // }




        }, this);
    },
    //本关完成
    complete() {
        this.scheduleOnce(function () {
            AD.gameScene.win();
        }, 2.5);
    },


});
