

cc.Class({
    extends: cc.Component,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        this.onBallNow = false;

    },
    reset(_roleIndex) {
        this.dieNow = false;
        this.onBallNow = false;
        this.node.x = 0;
        this._roleIndex = _roleIndex;
        if (_roleIndex == 0) {
            cc.director.on("发射", () => {
                if (this.onBallNow) return;
                this.couldMove = true;
            }, this);
            this.node.y = -cc.winSize.height / 2 - this.node.height / 2;
            cc.tween(this.node)
                .by(0.1, { y: this.node.height })
                .call(() => {

                })
                .start();
        }
        else {
            cc.director.on("发射1", () => {
                if (this.onBallNow) return;
                this.couldMove = true;
            }, this);
            this.node.angle = 180;
            this.node.y = cc.winSize.height / 2 + this.node.height / 2;
            cc.tween(this.node)
                .by(0.1, { y: -this.node.height })
                .call(() => {
                    if (window.feiDaoDaZhan.shengYuNum1 > 0 && window.feiDaoDaZhan.isAI) {
                        if (!this.onBallNow)
                        {
                            this.scheduleOnce(()=>{
                                this.couldMove = true;

                            },this.random(1,6)*0.1)
                        }
                    }
                })
                .start();
        }
        this.couldMove = false;


        cc.director.on("重置", () => {
            if (this.onBallNow)
                this.node.destroy();


        }, this);

        this.yuanY = this.node.y;
    },

    onCollisionEnter(other, self) {
        if (this.dieNow) {
            return
        }
        if (self.tag == 1 && other.tag == 1) {
            
            // cc.director.emit("游戏结束");
            if (this.dieNow == false) {
                var _directon = -1;
                if (this._roleIndex != 0)
                    _directon = 1;
                cc.tween(this.node)
                    .to(0.3, { y: _directon * cc.winSize.height / 3 * 2, angle: this.random(-500, 500) })
                    .call(() => {
                        this.node.destroy();
                        cc.director.emit("没插中", this._roleIndex);
                    })
                    .start();
            }
            this.dieNow = true;
            return
        }
        else if (self.tag == 0 && other.tag == 66 && !this.dieNow) {
            this.scheduleOnce(() => {
                if (!this.dieNow) {
                    AD.audioMng.playSfx("刀子插入");
                    
                    this.dieNow = true;
                    if(this.yuanY >0)
                    window.feiDaoDaZhan.createEffect("特效上");
                    else 
                    window.feiDaoDaZhan.createEffect("特效下");
                    var _pos1 = this.node.parent.convertToWorldSpaceAR(this.node.position);
                    let start_pos = other.node.convertToNodeSpaceAR(_pos1);
                    this.node.parent = other.node;
                    this.node.position = start_pos;
                    this.onBallNow = true;

                    if (this._roleIndex == 0)
                        this.node.angle = -other.node.angle
                    else
                        this.node.angle = -other.node.angle + 180;
                    cc.director.emit("增加", this._roleIndex);
                    this.node.zIndex = -1;
                }

            }, 0.0001)
        }

    },
    update(dt) {
        if (this.onBallNow) return;
        if (this.couldMove) {
            if (this._roleIndex == 0)
                this.node.y += 4000 * dt;
            else
                this.node.y -= 4000 * dt;
        }
    },

    random(lower, upper) {
        return Math.floor(Math.random() * (upper - lower + 1)) + lower;
    },
});
