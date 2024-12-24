

cc.Class({
    extends: cc.Component,

    properties: {
        sprNode1:cc.Node,
        sprArr1:[cc.SpriteFrame],
        sprNode2:cc.Node,
        sprArr2:[cc.SpriteFrame],
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        var _index = Tools.random(0,2);
        this.sprNode1.getComponent(cc.Sprite).spriteFrame = this.sprArr1[_index];
        this.sprNode2.getComponent(cc.Sprite).spriteFrame = this.sprArr2[_index];
    },

    // update (dt) {},
});
