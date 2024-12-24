
cc.Class({
    extends: cc.Component,

    properties: {
        isDown: true,
    },

    onLoad() {

    },

    reset(_level) {
        this.bar = cc.find("bar", this.node).getComponent(cc.Sprite);
        cc.find("lv", this.node).getComponent(cc.Label).string = "Lv."+(_level+1);
        this.hadDoor = false;//是否还有门
        this.level = _level;
        var _rate = Math.pow(2, this.level);
        this.hp = this.hpZong = 50 * _rate;
        this.bar.fillRange = this.hp / this.hpZong;
        this.hurtNum = 2 * _rate;
        this.speed = 3;
        
        this.initAnim();
        this.leftDownPointArr = [cc.v2(-380, 0), cc.v2(-130, 0), cc.v2(0, -210), cc.v2(-30, -366), cc.v2(-220, -455)];
        this.rightDownPointArr = [cc.v2(380, 0), cc.v2(130, 0), cc.v2(0, -210), cc.v2(-30, -366), cc.v2(-220, -455)];

        this.leftUpPointArr = [cc.v2(-380, 0), cc.v2(-130, 0), cc.v2(0, 210), cc.v2(30, 366), cc.v2(220, 455)];
        this.rightUpPointArr = [cc.v2(380, 0), cc.v2(130, 0), cc.v2(0, 210), cc.v2(30, 366), cc.v2(220, 455)];



        var _left = (this.random(0, 1) == 0);
        this.arr = null;
        if (this.isDown) {
            _left ? this.arr = this.leftDownPointArr : this.arr = this.rightDownPointArr;
        }
        else {

            _left ? this.arr = this.leftUpPointArr : this.arr = this.rightUpPointArr;
            this.node.angle = 180;
        }
        if (window.isHeZuo) {
            this.arr = [cc.v2(380, -50), cc.v2(-480, -50)];
        }
        this.node.position = this.arr[0];
        this.pointIndex = 0;

        this.targetHurtNode = null;//攻击目标

    },
    beHurt(_hurtNum) {
        this.hp -= _hurtNum;
        if (this.hp <= 0)
            this.node.destroy();
        else {

            this.bar.fillRange = this.hp / this.hpZong;
        }

    },

    initAnim() {
        this.anim = this.node.getComponent(sp.Skeleton);
        this.playAct("移动");
        //---帧事件 监听
        this.anim.setEventListener((a, evt) => {

            if (evt.data.name == "gongji") {//爆踢==>NPC挨踢
                if (this.targetHurtNode != null)
                {
                    cc.director.emit("女鬼攻击", this.targetHurtNode, this.hurtNum);
                    AD.audioMng.playSfx("猛鬼攻击");
                }
            }
        });
        //---动作完毕监听
        // this.anim.setCompleteListener((a, evt) => {

        //     switch (a.animation.name) {

        //     }
        // });
    },
    playAct(_name) {
        switch (_name) {
            case "移动":
                if (this.anim.animation != "yidong") {
                    this.anim.setAnimation(0, "yidong", true);
                }
                break;
            case "攻击":
                if (this.anim.animation != "gongji") {
                    this.anim.setAnimation(0, "gongji", true);

                }
                break;
            case "攻击2":
                if (this.anim.animation != "gongji") {
                    this.anim.setAnimation(0, "gongji", false);
                    AD.audioMng.playSfx("猛鬼攻击");
                }
                break;
        }
    },
    update(dt) {
        if( !window.mengGuiSuShe.beginNow ){
            this.playAct("待机");
            return;
        }
        if (this.getDistance(this.arr[this.pointIndex], this.node.position) <= 5) {
            if (this.pointIndex < this.arr.length - 1)
                this.pointIndex++;
        }
        else {
            if (!this.hadDoor) {
                var _radian = this.getRadian(this.arr[this.pointIndex], this.node.position);

                this.node.x += -Math.sin(_radian) * this.speed;
                this.node.y += Math.cos(_radian) * this.speed;
            }

        }

    },
    getDistance(pos, pos2) {
        var distance = Math.sqrt(Math.pow(pos.x - pos2.x, 2) + Math.pow(pos.y - pos2.y, 2));
        return distance;
    },
    random(lower, upper) {
        return Math.floor(Math.random() * (upper - lower + 1)) + lower;
    },
    onCollisionStay(other, self) {
        if (other.tag != 100 && other.tag != 88) {
            this.hadDoor = true;
            this.playAct("攻击");
            this.targetHurtNode = other.node;//攻击目标
        }
    },
    onCollisionExit(other, self) {
        if (other.tag != 100 && other.tag != 88) {
            this.hadDoor = false;
            this.playAct("移动");

            this.targetHurtNode = null;//攻击目标
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
    getAngle(pos1, pos2) {//获得人物中心和鼠标坐标连线，与y轴正半轴之间的夹角
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
        return angle;//角度转弧度
    },
    //角度转弧度
    angleToRadian(angle) {
        return angle * Math.PI / 180;
    },
});
