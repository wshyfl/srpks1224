

cc.Class({
    extends: cc.Component,

    properties: {

        mengGuiSuShe_itemBg_child: cc.Prefab,
        bgPosUp: cc.Node,
        bgPosDown: cc.Node,
        nvGuiDown: cc.Node,
        nvGuiUp: cc.Node,
        nvGuiParent: cc.Node,
        btPrefab: cc.Node,
        btParent: cc.Node,
        guide: cc.Node,
        paoItemUp: cc.Prefab,
        effectParent: cc.Node,
        effectBeHit: cc.Prefab,
        effectFire: cc.Prefab,
        effectNvGuiZhuaHen: cc.Prefab,
        effectYanWu: cc.Prefab,
    },

    onLoad() {
        this.guide.active = false;
        window.mengGuiSuShe = this;
        window.mengGuiSuShe.btPool = new cc.NodePool();
        window.mengGuiSuShe.effectFirePool = new cc.NodePool();
        window.mengGuiSuShe.effectYanWuPool = new cc.NodePool();
        window.mengGuiSuShe.effectHitPool = new cc.NodePool();
        window.mengGuiSuShe.effectZhuaHenPool = new cc.NodePool();
        this.initData();
        this.initCollision();
        this.nvGuiDown.active = this.nvGuiUp.active = false;


        this.durationArr = [0, 0, 0, 0];
        if (window.isAI) {
            cc.find("btnWeiXiuUp", this.node).active = false;
        }
    },
    start() {
        cc.director.on("倒计时结束", this.beginGame, this);
        this.scheduleOnce(() => {
            cc.director.emit("重置倒计时", true);
        }, 0.1);
        window.mengGuiSuShe.beginNow = false;
        // this.beginGame();
        cc.director.on("角色受到攻击", (_isDown) => {
            this.beginNow = false;
            this.scheduleOnce(() => {
                cc.director.emit("游戏结束", !_isDown);
            }, 2)
        }, this)
    },
    btnCallBack(event, type) {
        AD.audioMng.playSfx("按钮");
        switch (type) {
            case "维修下":
                cc.director.emit("维修", true);
                var _cd = event.target.children[0];
                _cd.active = true;
                var _spr = _cd.getComponent(cc.Sprite);
                _spr.fillRange = 1;
                cc.tween(_spr)
                    .to(20, { fillRange: 0 })
                    .call(() => {
                        _cd.active = false;
                    })
                    .start();
                break;
            case "维修上":
                cc.director.emit("维修", false);
                break;
        }
    },
    beginGame() {
        this.guide.active = true;
        AD.audioMng.playSfx("猛鬼效果音效");
        this.schedule(() => {
            if (this.random(0, 1) == 1 && this.beginNow)
                AD.audioMng.playSfx("猛鬼效果音效");
        }, 5)

        this.beginNow = true;
        this.npcLevel = 0;
        this.npcNum = 0;
        var _duration = 8;
        if (window.isHeZuo) {
            _duration = 3;
            this.scheduleOnce(() => {
                cc.director.emit("合作模式开始");
            }, 1)
        }
        this.scheduleOnce(() => {
            //生成女鬼
            this.createNvGui();
            this.schedule(() => {
                this.createNvGui();

            }, _duration)
            //AI功能
            if (window.isAI) {
                this.schedule(() => {
                    this.AIFunc();
                }, 1)
            }
        }, 11)

    },

    AIFunc() {
        if (!this.beginNow) return
        //生成炮
        var _paoPosArr = new Array();
        for (var i = 0; i < this.bgPosUp.children.length; i++) {
            if (this.bgPosUp.children[i].children[0].scale == 1) {
                _paoPosArr.push(this.bgPosUp.children[i]);
            }
        }
        if (_paoPosArr.length > 0) {
            _paoPosArr = this.getNewArr(_paoPosArr, _paoPosArr.length);
            if (this.getCoinNum(false) >= 8) {
                this.createPao(_paoPosArr[0]);
                this.setCoinNum(-8, false);
            }
            return;
        }
        //升级炮
        for (var i = 0; i < this.bgPosUp.children.length; i++) {
            var _paoJS = cc.find("paoUp", this.bgPosUp.children[i]).getComponent("mengGuiSuShe_pao");
            if (_paoJS.doorLevel < 3) {
                _paoPosArr.push(_paoJS);
            }
        }
        if (_paoPosArr.length > 0) {
            _paoPosArr = this.getNewArr(_paoPosArr, _paoPosArr.length);
            var _level = _paoPosArr[0].doorLevel;
            var _index = _paoPosArr[0].index;
            var _cast = this.data.paoData.castNum[_level];
            if (this.getCoinNum(false) >= _cast) {
                this.setCoinNum(-_cast, false);
                cc.director.emit("炮升级了", false, _index);
            }
            return;
        }
    },
    createPao(_paoDi) {
        if (!this.beginNow) return

        var _pao = cc.instantiate(this.paoItemUp);
        _paoDi.children[0].scale = 0;
        _pao.parent = _paoDi;
        _pao.position = cc.v2(0, 0);

    },
    initData() {
        this.paoIndex = 0;
        this.data = {
            coinNumDown: 0,
            coinNumUp: 0,
            bedData: {
                castNum: [0, 50, 100, 200],
                createCoinNum: [2, 4, 8, 16]
            },
            doorData: {
                castNum: [0, 16, 32, 64],
                hpNum: [50, 100, 150, 200],
            },
            paoData: {
                castNum: [8, 16, 32, 64],
                hurtNum: [4, 8, 16, 32],
                hurtDistance: [4, 4.5, 5, 5.5],
            },
        }

    },
    createNvGui() {
        if (!this.beginNow) return
        if (!window.isHeZuo) {
            var _npc2 = cc.instantiate(this.nvGuiUp);
            _npc2.parent = this.nvGuiParent;
            _npc2.active = true;
            _npc2.getComponent("mengGuiSuShe_nvGui").reset(this.npcLevel);
        }
        var _npc = cc.instantiate(this.nvGuiDown);
        _npc.parent = this.nvGuiParent;
        _npc.active = true;
        _npc.getComponent("mengGuiSuShe_nvGui").reset(this.npcLevel);
        this.npcNum++;
        if (this.npcNum % 3 == 0)
            this.npcLevel++;

    },

    createBt(_pos, _angle, _hurtNum) {
        var _bt = null;
        if (window.mengGuiSuShe.btPool.size() > 0)
            _bt = window.mengGuiSuShe.btPool.get();
        else
            _bt = cc.instantiate(this.btPrefab);
        _bt.parent = this.btParent; _bt.active = true;
        _bt.position = _pos;
        _bt.getComponent("mengGuiSuShe_bt").reset(_angle, _hurtNum);
    },
    createEffect(_type, _pos) {
        var _effect = null;
        var _duration = 1;
        switch (_type) {
            case "女鬼被攻击":
                var _index = 0;
                if (this.durationArr[_index] > 0) return;
                this.durationArr[_index] = 1;
                this.scheduleOnce(() => {
                    this.durationArr[_index] = 0;
                }, 0.1)

                if (window.mengGuiSuShe.effectHitPool.size() > 0)
                    _effect = window.mengGuiSuShe.effectHitPool.get();
                else
                    _effect = cc.instantiate(this.effectBeHit);
                _effect.children[0].getComponent(cc.ParticleSystem).resetSystem();
                _effect.children[1].getComponent(cc.ParticleSystem).resetSystem();
                _effect.children[2].getComponent(cc.ParticleSystem).resetSystem();
                _duration = 0.5;
                break;
            case "开火":
                var _index = 1;
                if (this.durationArr[_index] > 0) return;
                this.durationArr[_index] = 1;
                this.scheduleOnce(() => {
                    this.durationArr[_index] = 0;
                }, 0.05)
                if (window.mengGuiSuShe.effectFirePool.size() > 0)
                    _effect = window.mengGuiSuShe.effectFirePool.get();
                else
                    _effect = cc.instantiate(this.effectFire);
                _effect.children[0].getComponent(cc.ParticleSystem).resetSystem();
                _duration = 0.2;
                break;
            case "女鬼抓痕":
                var _index = 2;
                if (this.durationArr[_index] > 0) return;
                this.durationArr[_index] = 1;
                this.scheduleOnce(() => {
                    this.durationArr[_index] = 0;
                }, 0.5)
                if (window.mengGuiSuShe.effectZhuaHenPool.size() > 0)
                    _effect = window.mengGuiSuShe.effectZhuaHenPool.get();
                else
                    _effect = cc.instantiate(this.effectNvGuiZhuaHen);
                _effect.children[0].getComponent(cc.Animation).play();
                _duration = 0.5;
                break;
            case "烟雾":
                var _index = 3;
                if (this.durationArr[_index] > 0) return;
                this.durationArr[_index] = 1;
                this.scheduleOnce(() => {
                    this.durationArr[_index] = 0;
                }, 0.05)
                if (window.mengGuiSuShe.effectYanWuPool.size() > 0)
                    _effect = window.mengGuiSuShe.effectYanWuPool.get();
                else
                    _effect = cc.instantiate(this.effectYanWu);
                _effect.children[0].getComponent(cc.ParticleSystem).resetSystem();
                _duration = 0.5;
                break;
        }
        if (_effect != null) {
            _effect.parent = this.effectParent;
            _effect.position = _pos;
            this.scheduleOnce(() => {
                switch (_type) {
                    case "女鬼被攻击":
                        window.mengGuiSuShe.effectHitPool.put(_effect);
                        break;
                    case "开火":
                        window.mengGuiSuShe.effectFirePool.put(_effect);
                        break;
                    case "女鬼抓痕":
                        window.mengGuiSuShe.effectZhuaHenPool.put(_effect);
                        break;
                    case "烟雾":
                        window.mengGuiSuShe.effectYanWuPool.put(_effect);
                        break;
                }
            }, _duration)
        }

    },
    getCoinNum(_isDown) {
        if (_isDown)
            return this.data.coinNumDown;
        else
            return this.data.coinNumUp;
    },
    setCoinNum(_add, _isDown) {
        if (_isDown) {
            if (this.data.coinNumDown + _add >= 0) {
                this.data.coinNumDown += _add;
            }
        }
        else {
            if (this.data.coinNumUp + _add >= 0) {
                this.data.coinNumUp += _add;
            }
        }
        cc.director.emit("猛鬼金币数量变化", _isDown);
    },
    initCollision() {
        //重力碰撞初始化
        cc.director.getCollisionManager().enabled = true;
        cc.director.getPhysicsManager().enabled = true;
        cc.director.getPhysicsManager().gravity = cc.v2(0, 0);//重力速度  -640代表 每秒移动640像素

        //     cc.director.getPhysicsManager().debugDrawFlags = cc.PhysicsManager.DrawBits.e_aabbBit |
        // cc.PhysicsManager.DrawBits.e_pairBit |
        // cc.PhysicsManager.DrawBits.e_centerOfMassBit |
        // cc.PhysicsManager.DrawBits.e_jointBit |
        // cc.PhysicsManager.DrawBits.e_shapeBit
        // ;

        //普通碰撞初始化
        var manager = cc.director.getCollisionManager();
        manager.enabled = true;
        // manager.enabledDebugDraw = true;
    },
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
    random(lower, upper) {
        return Math.floor(Math.random() * (upper - lower + 1)) + lower;
    },
    // update (dt) {},
});
