

cc.Class({
    extends: cc.Component,

    properties: {
        door: cc.Node,
        door2: cc.Node,

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.human = cc.find("human", this.node);
        this.step = 0;
        AD.couldClear = true;//
        cc.director.emit("人物待机");
    },

    start() {
        var self = this;
        this.scheduleOnce(function(){
            
            AD.gameScene.createDialog("我的时光机卡住了！", config.roleType.HUMAN);
        },1)
        cc.director.on("关门", () => {
            //门相关    
            self.door.active = false;
            self.door2.active = true;
            self.door2.position = self.door.position;
            cc.tween(self.door2)
                .to(1, { x: -170 })
                .to(0.2, { x: -160 })
                .start();


            //角色相关
            cc.director.emit("人物高兴");
            AD.gameScene.wipUp();


            self.scheduleOnce(function () {

                // cc.director.emit("人物走");
                // cc.tween(self.human)
                // .to(2,{x:-145})
                // .call(()=>{
                //     self.human.active = false;
                // })
                // .start();

                // AD.guoDu.reset("gameScene")
                AD.gameScene.createDialog("这样就可以时光旅行了~", config.roleType.HUMAN);
                //胜利
                self.scheduleOnce(function () {
                    AD.gameScene.win();
                }, 2);

            }, 1);

        }, this);
    },


    // update (dt) {},
});
