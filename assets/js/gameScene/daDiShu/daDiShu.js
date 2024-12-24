

cc.Class({
    extends: cc.Component,

    properties: {
        holesDown: cc.Node,
        holesUp: cc.Node,
        npcDown: cc.Node,
        npcUp: cc.Node,
        effectOut: cc.Node,
        effectIn: cc.Node,
        effectHit: cc.Node,
        effectHitOK: cc.Node,
    },
    // onLoad () {},

    start() {
        window.daDiShu = this;
        this.isAI = window.isAI;
        cc.director.on("倒计时结束", this.beginGame, this);
        this.scheduleOnce(() => {
            cc.director.emit("重置倒计时");
        }, 0.1);
    },

    createEffect(_type, _pos) {
        var _effect = null;
        switch (_type) {
            case "出现":
                _effect = cc.instantiate(this.effectOut);
                if (_pos.y > 0)
                    _effect.angle = 180;
                break;
            case "消失":
                _effect = cc.instantiate(this.effectIn);
                if (_pos.y > 0)
                    _effect.angle = 180;
                break;
            case "击打":
                _effect = cc.instantiate(this.effectHit);
                break;
            case "击中":
                _effect = cc.instantiate(this.effectHitOK);
                _pos = cc.v2(_pos.x, _pos.y + 30)
                break;
        }
        _effect.parent = this.node;
        _effect.active = true;
        _effect.position = _pos;
        this.scheduleOnce(() => {
            _effect.destroy();
        }, 1)
    },
    beginGame() {
        this.gameOverNow = false;
        this.lastHoleIndexDown = -1;
        this.lastHoleIndexUp = -1;
        this.frame = 0;
        //生成地鼠
        this.schedule(() => {
            this.frame++;
            if (this.scoreDown < 8) {
                if (this.frame % 2 == 0)
                    this.createNpc(true);
            }
            else
                this.createNpc(true);
            if (this.scoreUp < 8) {
                if (this.frame % 2 == 0)
                    this.createNpc(false);
            }
            else
                this.createNpc(false);
        }, 0.5);

        this.scoreDown = 0;
        this.scoreUp = 0;
        this.scoreSum = 15;
        cc.director.on("打中地鼠啦", (_isDown) => {

            AD.audioMng.playSfx("击中地鼠");
            if (_isDown) {
                this.scoreDown++;
                cc.director.emit("分数增加", true);
            }
            else {
                this.scoreUp++;
                cc.director.emit("分数增加", false);
            }
            this.checkOver();
        }, this);
        this.node.on("touchstart", (event) => {
            var _pos = this.node.convertToNodeSpaceAR(event.getLocation());
            this.createEffect("击打", _pos);
        }, this)
    },
    checkOver() {
        if (this.gameOverNow) return;
        if (this.scoreDown == this.scoreSum) {
            this.gameOverNow = true;
            cc.director.emit("游戏结束", true);
        }
        else if (this.scoreUp == this.scoreSum) {
            this.gameOverNow = true;
            cc.director.emit("游戏结束", false);
        }
    },
    createNpc(_isDown) {
        if (this.gameOverNow) return;
        var _holeIndex = this.getHoleIndex(_isDown);
        if (_holeIndex == -1) {
            console.warn("获取洞口index 失败");
            return;
        }
        if (_isDown) {
            var _npc = cc.instantiate(this.npcDown);
            _npc.parent = this.holesDown.children[_holeIndex];
            var _duration = 0.8 - this.scoreDown * 0.03;
            if (_duration < 0.2)
                _duration = 0.2;
            _npc.getComponent("daDiShu_npc").reset(_duration);
        }
        else {
            var _npc = cc.instantiate(this.npcUp);
            _npc.parent = this.holesUp.children[_holeIndex];
            var _duration = 0.8 - this.scoreUp * 0.03;
            if (_duration < 0.2)
                _duration = 0.2;
            if (this.isAI)
                _npc.getComponent("daDiShu_npc").reset(_duration, true);
            else
                _npc.getComponent("daDiShu_npc").reset(_duration);

        }
        _npc.active = true;
        if (_isDown)
            _npc.position = cc.v2(0, -30);
        else
            _npc.position = cc.v2(0, 30);
    },
    getHoleIndex(_isDown) {
        var _indexTarget = -1;
        var _arrIndex = new Array();
        if (_isDown) {
            var _holesParent = this.holesDown;
            var _lastIndex = this.lastHoleIndexDown;
        }
        else {
            var _holesParent = this.holesUp;
            var _lastIndex = this.lastHoleIndexUp;
        }
        for (var i = 0; i < 7; i++) {
            if (_holesParent.children[i].childrenCount == 0) {
                if (i != _lastIndex)
                    _arrIndex.push(i);
            }
        }

        if (_arrIndex.length > 0) {
            _arrIndex = this.getNewArr(_arrIndex, _arrIndex.length);
            _indexTarget = _arrIndex[0];

            if (_isDown) {
                this.lastHoleIndexDown = _indexTarget;
            }
            else {
                this.lastHoleIndexUp = _indexTarget;
            }
        }
        return _indexTarget;
    },
    // update (dt) {},
    getNewArr(Arr, num)	//传入2个参数，一个数组，要获取数组的长度 (目的 将一个数组打乱后重新返回)
    {
        var arr = new Array();  //这个数组的目的是把传入进来的数组复制一份
        for (var i in Arr) {
            arr.push(Arr[i]);
        }  //这个for 循环用来把传入的数组复制一份  

        var return_arr = new Array();  //存储随机数用的数组
        for (var i = 0; i < num; i++) 	//获取随机数
        {
            if (arr.length > 0) {
                var nums = Math.floor(Math.random() * arr.length);  //从arr里面随机一个地址并 赋给变量nums
                return_arr[i] = arr[nums];	//将arr地址里的值 给   return_arr[i];
                arr.splice(nums, 1);	//删除 地址上的数字，防止在随机出来重复的
            }
            else {
                break;
            }
        }
        return return_arr;		//返回获取的5个值
    },
});
