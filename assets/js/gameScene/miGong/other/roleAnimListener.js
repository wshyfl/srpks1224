

cc.Class({
    extends: cc.Component,

    properties: {
        roleType:0,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },
    jump(){
        if(this.roleType==0 && AD.couldMove0)
        AD.gameScene.playSfx("跳跃");
        else if(this.roleType==1 && AD.couldMove1)
        AD.gameScene.playSfx("跳跃");
    },

    // update (dt) {},
});
