

cc.Class({
    extends: cc.Component,

    properties: {
        door: cc.Node,
        cameraNode: cc.Node,
    },
    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.human = cc.find("human", this.node);
        this.miFeng = cc.find("miFeng", this.node);
        this.zhiZhu = cc.find("zhiZhu", this.node);
        this.shanDian = cc.find("shanDian", this.node); this.shanDian.active = false;
        this.step = 0;
        AD.couldClear = false;//

    },

    start() {

        this.scheduleOnce(function () {
            AD.gameScene.createDialog("对不起了，小苍蝇", config.roleType.HUMAN);
            this.scheduleOnce(function () {
                AD.couldClear = true;//
            }, 2);
        }, 1);

        AD.human.biaoQing("待机");
        cc.director.emit("人物待机捂嘴");
        // this.action();
        
        // //窗帘被擦干净了
        cc.director.on("完成", () => {
            AD.gameScene.wipUp();
            this.scheduleOnce(function(){                
            AD.gameScene.createDialog("这下机器应该又可以启动了", config.roleType.HUMAN);
            },1)
            AD.human.biaoQing("开心");
            this.humanGaoXing();            
        }, this);

    },
    humanGaoXing(){
        
        cc.director.emit("人物高兴单次");
        this.schedule(function(){
            cc.director.emit("人物高兴单次");
        },1,1)
        this.scheduleOnce(function(){
            this.action();
        },4)
    },
    //开门
    openDoor() {
        cc.tween(this.door)
            .delay(0.5)
            .by(0.2, { x: 80 })
            .delay(0.1)
            .call(() => {
                this.human.active = false;
            })
            .delay(0.5)
            .call(() => {
                this.closeDoor();
                this.scheduleOnce(function () {
                    AD.gameScene.win();
                }, 2.5);
            })
            .start();
    },
    //人物走过去
    action() {
        
        AD.human.biaoQing("高兴");
        cc.director.emit("人物走");
        AD.human.biaoQing(1);
        cc.tween(this.human)
            .to(1, { x: -110 })
            .call(() => {
                cc.director.emit("人物待机");
                this.openDoor();
            })
            .start();
    },
    
    //关门
    closeDoor() {
        cc.tween(this.door)
            .by(0.2, { x: -90 })
            .by(0.1, { x: 10 })
            .delay(1)
            .call(() => {
                this.shanDian.active = true;
            })
            .delay(1)
            .call(() => {
                
            })
            .start();
    },

    update(dt) {

    },
});
