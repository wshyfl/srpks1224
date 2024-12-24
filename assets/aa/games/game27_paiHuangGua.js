
cc.Class({
    extends: cc.Component,

    properties: {
        chaZi: cc.Node,
        parent1: cc.Node,
        item: cc.Prefab,

    },

    onLoad() {
        this.chaZi.opacity = 0;
        this.chaZi.zIndex = 1;
        cc.director.on("下一波", () => {
            this.numSum--;
            if (this.numSum <= 0)
                this.next();
        }, this);
        this.next();
    },
    next() {
        this.numSum = 4;
        var _index = 0;
        var _item = cc.instantiate(this.item);
        _item.parent = this.parent1;
        _item.y = 250 - _index * 200;
        _index++;
        this.schedule(() => {
            var _item = cc.instantiate(this.item);
            _item.parent = this.parent1;
            _item.y = 250 - _index * 200;
            _index++;
        }, 0.2, 2)

    },

    start() {
        cc.director.on("拍黄瓜", (_pos) => {
            this.pai(_pos);
        }, this)
    },
    pai(_pos) {
        this.chaZi.position = cc.v2(_pos.x, _pos.y - 520)
        this.chaZi.opacity = 0;
        this.chaZi.scaleY = 0.7;
        cc.tween(this.chaZi)
            .to(0.05, { opacity: 255, scaleY: 1 }, { easing: "sineOut" })
            .call(() => {

            })
            .delay(0.2)
            .to(0.1, { opacity: 0, scaleY: 0.7 }, { easing: "sineIn" })
            .start();
    },

    // update (dt) {},
});
