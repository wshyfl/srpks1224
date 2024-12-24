

cc.Class({
    extends: cc.Component,

    properties: {
        effectHit: cc.Prefab,

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        //     if (this.node.y < 0)
        //     this.node.getComponent(cc.RigidBody).linearVelocity.y = -800;
        // else
        //     this.node.getComponent(cc.RigidBody).linearVelocity.y = 800;

        this.scheduleOnce(() => {
            this.node.getComponent(cc.PhysicsCircleCollider).enabled = true;
        }, 0.5);
        this.maxSpeed = Math.abs(this.node.getComponent(cc.RigidBody).linearVelocity.y);
    },

    start() {
        this.schedule(() => {
            var _vx = this.node.getComponent(cc.RigidBody).linearVelocity.x;
            var _vy = this.node.getComponent(cc.RigidBody).linearVelocity.y;

 
            
            var _speedNow = Math.sqrt(Math.pow(_vx, 2) + Math.pow(_vy, 2));
            if (Math.abs(_speedNow - this.maxSpeed) > 50) {


                var _yDirection = 1;
                if (_vy < 0)
                    _yDirection = -1;
                this.node.getComponent(cc.RigidBody).linearVelocity = cc.v2(_vx, _yDirection * Math.sqrt(Math.pow(this.maxSpeed, 2) - Math.pow(_vx, 2)));
                
            }
        }, 0.1)
    },
    showEffect(_radian) {
        // this.effectHit.getComponent(cc.ParticleSystem).resetSystem();
        var vx = -Math.sin(_radian) * 20;
        var vy = Math.cos(_radian) * 20;
        // this.effectHit.position = cc.v2(vx,vy);

        let worldPos = this.node.children[0].convertToWorldSpaceAR(cc.v2(vx, vy));
        let pos = this.node.parent.convertToNodeSpaceAR(worldPos);
        var _effect = cc.instantiate(this.effectHit);
        _effect.parent = this.node.parent.parent;
        _effect.position = pos;
        this.scheduleOnce(() => {
            _effect.destroy();
        }, 1)
    },
    //碰撞检测
    onBeginContact: function (contact, selfCollider, otherCollider) {

        switch (otherCollider.tag) {
            case 88://击中下方玩家
            
                this.node.destroy();
                cc.director.emit("击中敌方", true);
                AD.audioMng.playSfx("炮弹爆炸");
                break;
            case 99://击中上方玩家
            
                this.node.destroy();
                cc.director.emit("击中敌方", false);
                AD.audioMng.playSfx("炮弹爆炸");
                break;
            case 66://碰到船桨
                AD.audioMng.playSfx("战船反弹");
                var _radian = this.getRadian(otherCollider.node.position, selfCollider.node.position);
                this.showEffect(_radian);
                break;
            default:
                AD.audioMng.playSfx("战船反弹");
                break;
        }
    },

    getRadian(pos1, pos2) {//获得人物中心和鼠标坐标连线，与y轴正半轴之间的夹角
        var px = pos1.x;
        var py = pos1.y;
        var mx = pos2.x;
        var my = pos2.y;
        var x = Math.abs(px - mx);
        var y = Math.abs(py - my);
        var z = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
        var cos = y / z;
        var radina = Math.acos(cos);//用反三角函数求弧度
        var angle = Math.floor(180 / (Math.PI / radina));//将弧度转换成角度

        if (mx > px && my > py) {//鼠标在第四象限
            angle = 180 - angle;
        }

        if (mx == px && my > py) {//鼠标在y轴负方向上
            angle = 180;
        }

        if (mx > px && my == py) {//鼠标在x轴正方向上
            angle = 90;
        }

        if (mx < px && my > py) {//鼠标在第三象限
            angle = 180 + angle;
        }

        if (mx < px && my == py) {//鼠标在x轴负方向
            angle = 270;
        }

        if (mx < px && my < py) {//鼠标在第二象限
            angle = 360 - angle;
        }
        return this.angleToRadian(angle);//角度转弧度
    },
    //角度转弧度
    angleToRadian(angle) {
        return angle * Math.PI / 180;
    },
    // update (dt) {},
});
