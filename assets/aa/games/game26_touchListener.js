

cc.Class({
    extends: cc.Component,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.isDie = false;
        this.node.on(cc.Node.EventType.TOUCH_START, (event) => {
            if(this.isDie==false){
                this.isDie=true;
                this.node.getComponent(cc.Sprite).enabled = false;
               
                AD.pos = this.node.convertToNodeSpaceAR(event.getLocation());
                this.node.children.forEach(element => {
                    element.active = true;
                });
                this.scheduleOnce(()=>{
                    cc.director.emit("下一个");
                },2)
                
                AD.audioMng.playSfx("玻璃打碎")
            }
          
        }, this);
        this.spr = this.node.getComponent(cc.Sprite).spriteFrame.name;
        console.log(this.spr)
    },

    start() {

    },
    

    // update (dt) {},
});
