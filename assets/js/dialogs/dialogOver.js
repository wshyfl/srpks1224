

cc.Class({
    extends: cc.Component,

    properties: {
        tipsOver: cc.Node,
        otherNode: cc.Node,
        resultType: [cc.Node],
        scoreMax: cc.Label,
        scoreNow: cc.Label,
        effectXinJiLu: cc.Prefab,
    },

    // onLoad () {},

    start() {
        AD.gameOver();
    },
    //0下方胜利  1上方胜利 2平局 3合作模式
    reset(_type, ...second) {
        AD.audioMng.playSfx("游戏结束");

        this.tipsOver.scaleY = 0;
        this.otherNode.scale = 0;
        cc.tween(this.tipsOver)
            .to(0.1, { scaleY: 1 })
            .delay(1)
            .to(0.1, { scaleY: 0 })
            .delay(0.5)
            .call(() => {
                this.otherNode.scale = 1;
                AD.audioMng.playSfx("胜利");


                for (var i = 0; i < 4; i++)
                    this.resultType[i].active = (i == _type);
                if (_type == 3) {//合作模式
                    this.scoreMax.string = globalData.getModeScoreMax(window.modeType) + "s";
                    var _numNow = second[0];
                    this.scoreNow.string = _numNow + "s";

                    cc.director.on("新纪录", () => {
                        this.xinJiLu();
                        this.scoreMax.string = globalData.getModeScoreMax(window.modeType) + "s";
                    }, this);
                    this.scheduleOnce(() => {
                        globalData.setModeScoreMax(window.modeType, _numNow);
                    }, 1)
                }
            })
            .start();

    },
    xinJiLu() {
        var _effect = cc.instantiate(this.effectXinJiLu);
        var _effect2 = cc.instantiate(this.effectXinJiLu);
        _effect.parent = this.otherNode;
        _effect2.parent = this.otherNode;

        _effect.position = cc.v2(0, 200); _effect.angle = 180;
        _effect2.position = cc.v2(0, -200)

        cc.tween(_effect)
            .delay(2)
            .to(0.2, { scale: 0 })
            .call(() => {
                _effect.destroy();
            })
            .start();

        cc.tween(_effect2)
            .delay(2)
            .to(0.2, { scale: 0 })
            .call(() => {
                _effect2.destroy();
            })
            .start();
    },
    btnCallBack(event, type) {
        AD.audioMng.playSfx("按钮");
        switch (type) {
            case "返回":
                globalData.showTuiJian = true;
                cc.director.loadScene("menuScene");
                break;
            case "更多游戏":
                AD.moreGame();
                break;
        }
    }


    // update (dt) {},
});
