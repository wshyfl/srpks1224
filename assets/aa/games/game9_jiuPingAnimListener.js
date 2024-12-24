
cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    // onLoad () {},

    start () {

    },
    playEnd(){
        AD.audioMng.playSfx("砸酒瓶");
        this.node.parent.getComponent("game9_jiuPing").could=true;
        this.node.parent.getComponent("game9_jiuPing").ceateEffect();
    },

    // update (dt) {},
});
