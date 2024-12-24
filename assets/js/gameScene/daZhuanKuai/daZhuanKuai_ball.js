

cc.Class({
    extends: cc.Component,

    properties: {
        effectHit: cc.Prefab,
    },

    // onLoad () {},

    start() {
        this.speed = 0;
    },

    fanTan(_radian, _speed) {
        this.vx = Math.sin(_radian);
        this.vy = -Math.cos(_radian);

        if (_speed > 15)
            _speed = 15;
        else if (_speed > 10)
            _speed = 5;
        this.node.getComponent(cc.RigidBody).linearVelocity = cc.v2(this.vx * _speed * 80, this.vy * _speed * 80);
        // this.node.getComponent(cc.RigidBody).
        // this.node.getComponent(cc.RigidBody).applyLinearImpulse(cc.v2(this.vx * _speed * 500, this.vy * _speed * 500),
        //     this.node.getComponent(cc.RigidBody).getWorldCenter(), true);
    },
    //碰撞检测
    onBeginContact: function (contact, selfCollider, otherCollider) {

        switch (otherCollider.tag) {
            case 2://挡板

                var _radian = this.getRadian(otherCollider.node.position, selfCollider.node.position);
                this.showEffect(_radian);
                var _speed = 0;
                if (otherCollider.node.y < 0)
                    _speed = this.node.parent.getComponents("daZhuanKuai")[0].moveSpeed;
                else
                    _speed = this.node.parent.getComponents("daZhuanKuai")[1].moveSpeed;
                if (_speed < 50)
                    _speed = 50;
                this.fanTan(_radian, _speed);

                AD.audioMng.playSfx("碰到球");
                break;
            case 666://球门
                if (otherCollider.node.y > 0) {
                    cc.director.emit("得分", 0);
                }
                else cc.director.emit("得分", 1);
                AD.audioMng.playSfx("游戏结束");
                break;
            case 88://反弹角落
                var _radian = this.getRadian(otherCollider.node.position, selfCollider.node.position);
                var _vx = Math.sin(_radian) * 1000;
                var _vy = -Math.cos(_radian) * 1000;
                this.node.getComponent(cc.RigidBody).applyLinearImpulse(cc.v2(_vx, _vy),
                    this.node.getComponent(cc.RigidBody).getWorldCenter(), true);

                otherCollider.node.active = false;
                this.scheduleOnce(() => {
                    otherCollider.node.active = true;

                }, 0.3)
                break;
            default:
                
                AD.audioMng.playSfx("碰到球");
                break;
        }
    },
    showEffect(_radian) {
        // this.effectHit.getComponent(cc.ParticleSystem).resetSystem();
        var vx = -Math.sin(_radian) * 20;
        var vy = Math.cos(_radian) * 20;
        // this.effectHit.position = cc.v2(vx,vy);

        let worldPos = this.node.children[0].convertToWorldSpaceAR(cc.v2(vx, vy));
        let pos = this.node.parent.convertToNodeSpaceAR(worldPos);
        var _effect = cc.instantiate(this.effectHit);
        _effect.parent = this.node.parent;
        _effect.position = pos;
        this.scheduleOnce(() => {
            _effect.destroy();
        }, 1)
    },
    //碰撞检测
    onCollisionEnter: function (other, self) {

        switch (other.tag) {
            case 0://普通碰撞快
                break;
        }
    },
    //获得两点之间的距离
    getDistance(pos, pos2) {
        var distance = Math.sqrt(Math.pow(pos.x - pos2.x, 2) + Math.pow(pos.y - pos2.y, 2));
        return distance;
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
