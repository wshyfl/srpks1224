
cc.Class({
    extends: cc.Component,

    properties: {

    },

    onLoad() {
        cc.director.getCollisionManager().enabled = true;
        AD.Game = this;
        this.UI = cc.find("UI", this.node);
        this.GameOverNow = false;

        this.scoreDown = this.scoreUp = 0;
        // this.node.children[2].height = cc.winSize.height / 2;
        // this.node.children[3].height = cc.winSize.height / 2;
        // this.node.children[2].y = -cc.winSize.height / 4;
        // this.node.children[3].y = cc.winSize.height / 4;
    },
    start() {
        this.GameOver = false
        
        var _width = cc.find("progress/bar", this.UI).width / 6
        this.tweenDownTime = cc.tween(cc.find("progress/bar", this.UI))
            .to(60, { width: 0 })
            .call(() => {
                this.onJieSuan();
            })


        this.beginNow = false;
        this.hadChangeScene = false;

        cc.director.on("倒计时结束", this.beginGame, this);
        this.scheduleOnce(() => {
            cc.director.emit("重置倒计时");
        }, 0.1);
    },
    beginGame(){
        
        this.beginNow = true;
        //游戏开始
        this.tweenDownTime.start()
        this.initCollision();
    },

    update(dt) {

    },
    initCollision() {

    },
    onBtnCallBack(e, t) {
        // AD.sound.playSfx("按钮");
        switch (t) {
            case "暂停":
                AD.showBanner();
                this.pauseView.active = true
                cc.director.pause();
                // AD.sound.playSfx("暂停钟表")
                break
            case "继续游戏":
                // AD.sound.playSfx("恢复钟表")
                this.pauseView.active = false
                cc.director.resume();
                break
            case "主界面":
                // AD.sound.playSfx("停止钟表")

                break

        }
    },
    /**展示新球界面 */
    onShowNewBallView(_weight) {
        return

    },
    onJieSuan() {
        console.log("结算")
        if(this.GameOverNow)return;
        this.GameOverNow = true;
        if (this.scoreDown != this.scoreUp)
            cc.director.emit("游戏结束", this.scoreDown > this.scoreUp)
        else
            cc.director.emit("游戏平局")
    },
    onJudgeJieSuan() {
        if (this.node.children[2].getComponent("ballMng2").GameOver && this.node.children[3].getComponent("ballMng2").GameOver) {
            this.tweenDownTime.stop()
            this.onJieSuan();
        }
    },

    resetDialog(_dialog, _show) {
        var _zheZhao = _dialog.getChildByName("zheZhao");
        var _bg = _dialog.getChildByName("bg");
        if (_show) {
            _dialog.active = true;
            _zheZhao.opacity = 0;
            _bg.scale = 0;

            cc.tween(_zheZhao)
                .to(0.15, { opacity: 180 })
                .start();

            cc.tween(_bg)
                .to(0.15, { scale: 1 })
                .start();

        }
        else {
            cc.tween(_zheZhao)
                .to(0.15, { opacity: 0 })
                .start();

            cc.tween(_bg)
                .to(0.15, { scale: 0 })
                .call(() => {
                    _dialog.active = false;
                })
                .start();
        }
    },
});
