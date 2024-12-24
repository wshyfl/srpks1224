

cc.Class({
    extends: cc.Component,

    properties: {
        labelNum: cc.Node,
    },

    onLoad() {
        this.node.active = window.isHeZuo;
    },

    start() {
        this.second = 0;
        this.gameOver = true;
        this.labelNum.getComponent(cc.Label).string = Tools.getSecond2(this.second);
        this.schedule(() => {
            if (this.gameOver) return;
            this.second++;
            this.labelNum.getComponent(cc.Label).string = Tools.getSecond2(this.second);
        }, 1)
        cc.director.on("合作模式开始", () => {
            this.gameOver = false;

        }, this);
        cc.director.on("合作模式结束", (_mode) => {//_mode   双人吃鸡
            this.gameOver = true;
            cc.director.emit("合作模式结算",this.second);
            console.log("合作模式结束  计时结束  模式是：" + _mode + " 本次坚持时长为： " + this.second + "秒");
        }, this);
    },

    // update (dt) {},
});
