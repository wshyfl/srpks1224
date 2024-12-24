

cc.Class({
    extends: cc.Component,

    properties: {

    },

    // onLoad () {},

    start() {

        this.item = cc.instantiate(window.mengGuiSuShe.mengGuiSuShe_itemBg_child);
        this.item.parent = this.node;
        this.item.position = cc.v2(0, 0);
        this.node.on("touchstart", () => {
            
            if (this.node.y > 0 && window.isAI) {

            }
            else
                cc.director.emit("建造炮弹窗", this.node)
        }, this)
    },

    // update (dt) {},
});
