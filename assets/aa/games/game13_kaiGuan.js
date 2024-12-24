

cc.Class({
    extends: cc.Component,

    properties: {
        light:cc.Node,
        offNode:cc.Node,
        onNode:cc.Node,
        switchNode:cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.offNode.active = true;
        this.onNode.active = !this.offNode.active;
        this.light.active = !this.onNode.active;
        this.switchNode.on(cc.Node.EventType.TOUCH_START,()=>{

            AD.audioMng.playSfx("开关灯")
            this.offNode.active = !this.offNode.active;
            this.onNode.active = !this.offNode.active;
            this.light.active = !this.onNode.active;
            
        },this)
    },

    // update (dt) {},
});
