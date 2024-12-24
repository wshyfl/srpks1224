


cc.Class({
    extends: cc.Component,

    properties: {

    },


    // onLoad () {},

    start() {



    },

    reset() {

        this.node.getComponent(cc.Sprite).spriteFrame = AD.game1_yaPaoPao.mode1Arr[Tools.random(0, 2)];
        this.hadDie = false;
    },
    check() {
        AD.game1_yaPaoPao.modeNum--;
        if (AD.game1_yaPaoPao.modeNum <= 0) {
            switch (AD.game1_yaPaoPao.modeType) {
                case 0:
                    AD.game1_yaPaoPao.reset(1);
                    break;
                case 1:
                    AD.game1_yaPaoPao.reset(0);
                    break;
            }

        }
    },

    //普通碰撞
    onCollisionEnter(other, self) {
        if (other.tag == 88 && this.hadDie == false) {//碰到NPC的球形碰撞框 左半框
            this.dieFunc();
        }
    },
    dieFunc() {
        AD.audioMng.playSfx("捏气泡")
        this.hadDie = true;
        this.check();
        this.node.getComponent(cc.Sprite).spriteFrame = AD.game1_yaPaoPao.mode2Arr[Tools.random(0, 1)];
    },
    // update (dt) {},
});
