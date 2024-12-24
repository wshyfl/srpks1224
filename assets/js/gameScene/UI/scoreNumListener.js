

cc.Class({
    extends: cc.Component,

    properties: {
        isDown: true,
    },

    onLoad() {
        this.num = 0;
        this.node.getComponent(cc.Label).string = this.num;
        cc.director.on("分数增加", (_isDown) => {
            if (_isDown == this.isDown) {
                this.num++;
                this.node.getComponent(cc.Label).string = this.num;
            }
        }, this);
        cc.director.on("分数减少", (_isDown, ...numData) => {
            if (_isDown == this.isDown) {
                if (numData[0])
                    this.num -= numData[0];
                else
                    this.num--;

                if (this.num < 0)
                    this.num = 0;
                this.node.getComponent(cc.Label).string = this.num;
            }
        }, this);
        cc.director.on("获取分数", (_isDown, caller, callN) => {
            if (_isDown == this.isDown)
                caller.call(callN,this.num)

        }, this);

        cc.director.on("实时分数", (_isDown,_num) => {
            if (_isDown == this.isDown) {
               
                this.node.getComponent(cc.Label).string = _num;
            }
        }, this);
    },

    start() {

    },

    // update (dt) {},
});
