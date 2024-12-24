

cc.Class({
    extends: cc.Component,

    properties: {

    },

    // onLoad () {},
    reset(_isDown, _speed) {
        this.speed = _speed;
        this.hurtDistance = 150;
        this._isDown = _isDown;
        this.node.x = this.random(-260, 220);
        if (this._isDown)
            this.node.y = -500;
        else
            this.node.y = 500;
        cc.director.on("炮弹爆炸", (_isDownN, _pos) => {
            if (_isDown != _isDownN) {
                if (this.getDistance(this.node.position, _pos) < this.hurtDistance) {
                    this.node.destroy();
                    if (this._isDown)
                        window.xiaoBingDuiTui.createEffect("NPC死亡下", this.node.position)
                    else
                        window.xiaoBingDuiTui.createEffect("NPC死亡上", this.node.position)
                }
            }
        }, this);
        var _anim = this.node.getComponent(cc.Animation).play();
        _anim.speed = _speed;

    },
    start() {
        this.yuanScale = this.node.scaleX;
        this.couldMove = true;
        cc.director.on("游戏结束", (_isDownWin) => {
            var _anim = this.node.getComponent(cc.Animation).play();
            if (this._isDown == _isDownWin) {
                _anim.speed = 1;
                this.speed = 0;
                cc.tween(this.node)
                    .repeatForever(
                        cc.tween()
                            .to(0.2, { scale: this.yuanScale + 0.2 }, { easing: "sineOut" })
                            .to(0.4, { scale: this.yuanScale }, { easing: "sineIn" })
                    )
                    .start();
            }
            else {
                _anim.speed = 6;
                if (this._isDown)
                    this.speed = -6;
                else
                    this.speed = 6;
                this.node.angle += 180;
            }


        }, this)
    },

    update(dt) {
        if (!this.couldMove) return;
        if (this._isDown) {
            this.node.y += this.speed;
            if (this.node.y >= 500) {
                this.node.destroy();
                cc.director.emit("分数减少", !this._isDown);
                cc.director.emit("对推检测结果")
            }
        }
        else {

            this.node.y -= this.speed;
            if (this.node.y <= -500) {
                this.node.destroy();
                cc.director.emit("分数减少", !this._isDown);
                cc.director.emit("对推检测结果")
            }
        }
    },
    random(lower, upper) {
        return Math.floor(Math.random() * (upper - lower + 1)) + lower;
    },

    //获得两点之间的距离
    getDistance(pos, pos2) {
        var distance = Math.sqrt(Math.pow(pos.x - pos2.x, 2) + Math.pow(pos.y - pos2.y, 2));
        return distance;
    },
});
