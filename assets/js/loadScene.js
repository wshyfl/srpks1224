

cc.Class({
    extends: cc.Component,

    properties: {
        bar: cc.Sprite,
    },
    onLoad() {
        globalData.getDataAll();
        this.loadJSON();
    },

    start() {
        this.bar.fillRange = 0;
        cc.tween(this.bar)
            .to(3, { fillRange: 1 })
            .call(() => {
                if (this.numNow >= this.numSum)
                    cc.director.loadScene("readyToMain");
                else
                    this.checkResult();
            })
            .start();
    },
    checkResult() {
        this.scheduleOnce(() => {
            if (this.numNow >= this.numSum)
                cc.director.loadScene("readyToMain");
            else
                this.checkResult();
        }, 0.2)
    },
    loadJSON() {
        var self = this;
        this.numNow = this.numSum = 0;

        this.numSum++;
        cc.resources.load('Tips', function (err, jsonAsset) {
            AD.tipsJSON = jsonAsset.json;
            self.numNow++;


        });
    },

});
