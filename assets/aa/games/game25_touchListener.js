

cc.Class({
    extends: cc.Component,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.isDie = false;
        this.node.on(cc.Node.EventType.TOUCH_START, () => {
            if(this.isDie==false){
                this.isDie=true;
                this.node.getComponent(cc.Sprite).enabled = false;
                this.scheduleOnce(() => {
                    this.node["_touchListener"].setSwallowTouches(false);
                }, 0.1)
                this.scheduleOnce(() => {
                    cc.director.emit("重置");
                }, 1)
                this.scheduleOnce(() => {
                    this.node.destroy();
                }, 3)
                this.node.children.forEach(element => {
                    element.active = true;
                });
                this.playSfx();
            }
          
        }, this);
        this.spr = this.node.getComponent(cc.Sprite).spriteFrame.name;
        console.log(this.spr)
    },

    start() {

    },
    playSfx() {
        switch (this.spr) {
            case "GQ21_JiuPing"://酒瓶
                AD.audioMng.playSfx("玻璃打碎")
                break;
            case "GQ21_XiangZi2"://木箱2
                AD.audioMng.playSfx("木箱破碎")
                break;
            case "GQ21_XiangZi1"://木箱1
                AD.audioMng.playSfx("木箱破碎")
                break;
            case "GQ21_XiangZi3"://瓷瓶
                AD.audioMng.playSfx("玻璃打碎")
                break;
            case "GQ21_XiangZi4"://西瓜
                AD.audioMng.playSfx("西瓜破碎")
                break;
        }
    },

    // update (dt) {},
});
