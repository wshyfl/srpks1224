
cc.Class({
    extends: cc.Component,

    properties: {
        roleIndex: 0,
        greenSpr: cc.SpriteFrame,
    },

    // onLoad () {},

    start() {
        this.yuanSpr = this.node.children[0].children[0].getComponent(cc.Sprite).spriteFrame;
        cc.director.on("重置点", (_roleIndex,_index, _type) => {
            if (this.roleIndex != _roleIndex) return;
            var _point = this.node.children[_index].children[0];
            switch (_type) {
                case "成功":
                    _point.getComponent(cc.Sprite).spriteFrame = this.greenSpr;
                    break;
                case "失败":
                    _point.getComponent(cc.Sprite).spriteFrame = null;
                    break;
                default:
                    _point.getComponent(cc.Sprite).spriteFrame = this.yuanSpr;
                    break;
            }

        }, this)
    },

    // update (dt) {},
});
