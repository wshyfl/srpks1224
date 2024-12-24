

cc.Class({
    extends: cc.Component,

    properties: {
        nameSpr: cc.Sprite,
        bedSpr: cc.Sprite,
        nameArr: [cc.SpriteFrame],
        bedArr: [cc.SpriteFrame],
        desc: cc.Label,
        priceLabel: cc.Label,
        btnUpgrade: cc.Node,

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {

    },
    reset(_level, _isDown) {
        this.level = _level;
        this.isDown = _isDown;
        this.castNum = window.mengGuiSuShe.data.doorData.castNum[_level];
        this.hpNum = window.mengGuiSuShe.data.doorData.hpNum[_level];
        this.desc.string = "血量：" + this.hpNum;
        this.priceLabel.string = this.castNum;

        this.nameSpr.spriteFrame = this.nameArr[_level];
        this.bedSpr.spriteFrame = this.bedArr[_level];
        this.btnUpgrade.getComponent(cc.Button).interactable = (window.mengGuiSuShe.getCoinNum(this.isDown) >= this.castNum);
        this.schedule(()=>{
            this.btnUpgrade.getComponent(cc.Button).interactable = (window.mengGuiSuShe.getCoinNum(this.isDown) >= this.castNum);
        },1)
    },
    btnCallBack(event, type) {
        AD.audioMng.playSfx("按钮");
        switch (type) {
            case "升级":
                
        AD.audioMng.playSfx("猛鬼建筑");
                cc.director.emit("门升级了", this.isDown);
                window.mengGuiSuShe.setCoinNum(-this.castNum,this.isDown);
                Tools.resetDialog2(this.node, false);
                break;
            case "关闭":
                Tools.resetDialog2(this.node, false);
                break;
        }
    },

    start() {

    },

    // update (dt) {},
});