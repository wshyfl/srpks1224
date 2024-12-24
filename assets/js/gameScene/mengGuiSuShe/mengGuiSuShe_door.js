

cc.Class({
    extends: cc.Component,

    properties: {
        isDown: true,
        bar: cc.Sprite,
        sprArr: [cc.SpriteFrame],
    },

    onLoad() {
        this.tips_upgrade = cc.find("tips_upgrade", this.node);
        this.tips_upgrade.active = false;



        this.doorLevel = 0;
        if (window.isHeZuo)
            this.hp = this.hpZong = 200;
        else
            this.hp = this.hpZong = window.mengGuiSuShe.data.doorData.hpNum[this.doorLevel];
        this.resetHpBar();

        
        cc.director.on("门升级了", (_isDown) => {
            if (_isDown != this.isDown) return;
            if (this.doorLevel < 3) {
                window.mengGuiSuShe.createEffect("烟雾", this.node.position)
                this.doorLevel++;
                cc.find("door", this.node).getComponent(cc.Sprite).spriteFrame = this.sprArr[this.doorLevel];
                this.hp = this.hpZong = window.mengGuiSuShe.data.doorData.hpNum[this.doorLevel];
                this.resetHpBar();
                
            }
            if (this.doorLevel < 3)
                this.tips_upgrade.active = (window.mengGuiSuShe.getCoinNum(this.isDown) >= window.mengGuiSuShe.data.doorData.castNum[this.doorLevel + 1])
            else
                this.tips_upgrade.active = false;
        }, this);
        this.node.on("touchstart", () => {
            if (!window.isHeZuo) {
                if (this.doorLevel < 3) {
                    cc.director.emit("升级门弹窗", this);
                }
            }
        }, this);

        if (!window.isHeZuo) {
            //修门提示
            this.schedule(() => {
                if (this.doorLevel < 3)
                    this.tips_upgrade.active = (window.mengGuiSuShe.getCoinNum(this.isDown) >= window.mengGuiSuShe.data.doorData.castNum[this.doorLevel + 1])
                else
                    this.tips_upgrade.active = false;
            }, 1)
        }

        cc.find("effectWeiXiu", this.node).active = false;
        cc.director.on("维修", (_isDown) => {
            if (_isDown == this.isDown) {
                var _hp = this.hpZong / 20;
                var _second = 10;
                cc.find("effectWeiXiu", this.node).active = true;

                this.schedule(() => {
                    this.hp += _hp;
                    if (this.hp > this.hpZong) {
                        this.hp = this.hpZong
                    }
                    this.resetHpBar();
                    _second--;
                    if (_second <= 0)
                        cc.find("effectWeiXiu", this.node).active = false;

                }, 1, 9)
            }
        }, this)
    },

    start() {
        cc.director.on("女鬼攻击", (_node, _hurtNum) => {
            if (_node == this.node) {
                this.hp -= _hurtNum;
                cc.find("door", this.node).color = new cc.color(225, 72, 72, 255);
                this.scheduleOnce(() => {
                    cc.find("door", this.node).color = new cc.color(225, 225, 225, 255);
                }, 0.1)

                cc.tween(cc.find("door", this.node))
                    .to(0.05, { scale: 0.7 })
                    .to(0.05, { scale: 1 })
                    .start();
                window.mengGuiSuShe.createEffect("女鬼抓痕", this.node.position)
                this.resetHpBar();
                if (this.hp <= 0) {
                    AD.audioMng.playSfx("猛鬼破门");
                    this.node.destroy();
                    if (window.isHeZuo) {

                        AD.audioMng.playSfx("猛鬼失败");
                        window.mengGuiSuShe.beginNow = false;
                       
                        setTimeout(() => {
                            cc.director.emit("合作模式结束", "猛鬼宿舍");
                        }, 2000);
                    }
                }
            }
        }, this)
    },
    onDestroy() {

    },

    resetHpBar() {
        this.bar.fillRange = this.hp / this.hpZong;
    },
    // update (dt) {},
});
