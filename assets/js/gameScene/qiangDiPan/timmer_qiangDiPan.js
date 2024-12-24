

cc.Class({
    extends: cc.Component,

    properties: {
        labelNum: cc.Node,
    },

    onLoad() {
        this.node.parent = cc.find("Canvas/UI/score");
    },

    start() {
        this.second = 40;
        this.labelNum.getComponent(cc.Label).string = Tools.getSecond2(this.second);
        this.schedule(() => {
            if (!window.qiangDiPan.beginNow) return;
            this.second--;
            
            if (this.second >= 0)
                this.labelNum.getComponent(cc.Label).string = Tools.getSecond2(this.second);
            else {
                window.qiangDiPan.checkOver();
            }
        }, 1)

    },

    // update (dt) {},
});
