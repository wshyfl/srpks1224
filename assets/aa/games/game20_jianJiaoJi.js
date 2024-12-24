
cc.Class({
    extends: cc.Component,

    properties: {
        ji:cc.Node,
        touchNode:cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.touchNode.on(cc.Node.EventType.TOUCH_START,()=>{
            this.playAct("动作");
            AD.audioMng.playSfx("尖叫鸡");
        },this);
        this.touchNode.on(cc.Node.EventType.TOUCH_MOVE,(event)=>{
            this.ji.x+=event.getDelta().x;
            this.ji.y+=event.getDelta().y;
        },this);
        this.anim = this.ji.getComponent(sp.Skeleton);
    },

    start () {

    },
    playAct(_name, ...data) {
        switch (_name) {
            case "待机":
                this.anim.setAnimation(0, "daiji", false);
                break;
            case "动作":
               
                this.anim.setAnimation(0, "ji"+Tools.random(1,2), false);
                break;
        }
    },

    // update (dt) {},
});
