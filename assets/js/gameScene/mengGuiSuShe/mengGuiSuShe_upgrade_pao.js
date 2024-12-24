

cc.Class({
    extends: cc.Component,

    properties: {
        nameSpr: cc.Sprite,
        paoSpr: cc.Sprite,
        paoDiSpr: cc.Sprite,
        nameArr: [cc.SpriteFrame],
        paoSprArr: [cc.SpriteFrame],
        paoDiArr: [cc.SpriteFrame],
        desc: cc.Label,
        desc2: cc.Label,
        priceLabel: cc.Label,
        priceLabelAdd: cc.Label,
        btnUpgrade: cc.Node,

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {

    },
    reset(_level, _isDown, _index) {
        this.index = _index;
        this.level = _level;
        this.isDown = _isDown;
        this.castNum = window.mengGuiSuShe.data.paoData.castNum[_level];
        this.yiChuNum = window.mengGuiSuShe.data.paoData.castNum[_level - 1] / 2;
        this.hurtNum = window.mengGuiSuShe.data.paoData.hurtNum[_level];
        this.hurtDistance = window.mengGuiSuShe.data.paoData.hurtDistance[_level];
        this.desc.string = "攻击力：" + this.hurtNum;
        this.desc2.string = "攻击距离：" + this.hurtDistance;
        this.priceLabel.string = this.castNum;
        this.priceLabelAdd.string = "+" + this.yiChuNum;

        this.nameSpr.spriteFrame = this.nameArr[_level];
        this.paoSpr.spriteFrame = this.paoSprArr[_level];
        this.paoDiSpr.spriteFrame = this.paoDiArr[_level];
        this.btnUpgrade.getComponent(cc.Button).interactable = (window.mengGuiSuShe.getCoinNum(this.isDown) >= this.castNum);
        this.schedule(() => {
            this.btnUpgrade.getComponent(cc.Button).interactable = (window.mengGuiSuShe.getCoinNum(this.isDown) >= this.castNum);
        }, 1)
    },
    btnCallBack(event, type) {
        AD.audioMng.playSfx("按钮");
        switch (type) {
            case "升级":
                AD.audioMng.playSfx("猛鬼建筑");
                cc.director.emit("炮升级了", this.isDown, this.index);
                window.mengGuiSuShe.setCoinNum(-this.castNum, this.isDown);
                Tools.resetDialog2(this.node, false);
                break;
            case "关闭":
                Tools.resetDialog2(this.node, false);
                break;
            case "移除":
                window.mengGuiSuShe.setCoinNum(this.yiChuNum, this.isDown);
                cc.director.emit("炮移除了", this.isDown, this.index);
                Tools.resetDialog2(this.node, false);
                break;
        }
    },

    start() {

    },

    // update (dt) {},
});
