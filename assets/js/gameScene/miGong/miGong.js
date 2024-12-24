

cc.Class({
    extends: cc.Component,

    properties: {
        sfxArr: {
            default: [],
            type: [cc.AudioClip]
        },
        player0: cc.Node,
        player1: cc.Node,
        mapNode: cc.Node,
        roadPrefab: cc.Prefab,
        finishPointPrefab: cc.Prefab,

        keyPrefab: cc.Prefab,

        footPrintPrefab: cc.Prefab,
        gameOverTips: [cc.Prefab],
        effectPrefabArr: [cc.Prefab],



    },

    onLoad() {
        AD.gameScene = this;
        this.initCollision();
        this.lineArr0 = new Array();
        this.mapNode.children.forEach(element => {
            element.active = false;
        });
        this.modeType = "合作模式";
        this.maxHeight = 680;
        this.maxWidth = 1000;
        this.gameFinish = false;
        this.finishNum = 0;//几个人达到了终点
        this.finishFirstIndex = -1;//首先完成的人是?

        this.secondToOver = 2.5;
        //到达终点位置
        cc.director.on("到达终点", (_playerType) => {
            this.finishNum++;
            if (this.finishNum >= 2) {
                if (this.gameFinish) return;
                this.gameFinish = true;
                this.showTips("逃脱成功");
                this.scheduleOnce(function () {
                    cc.director.emit("显示单人胜利")
                }, this.secondToOver);
            }

        }, this);
    },
    playSfx(_name, ...index) {

        var _sfxIndex = -1;
        switch (_name) {

            case "获得道具":
                _sfxIndex = 0;
                break;
            case "跳跃":
                _sfxIndex = 1;
                break;
            case "穿越":
                _sfxIndex = 2;
                break;
            case "胜利点":
                _sfxIndex = 3;
                break;
        }
        if (_sfxIndex != -1) {
            cc.audioEngine.play(this.sfxArr[_sfxIndex], false);
        }
    },

    start() {
        cc.director.on("倒计时结束", this.beginGame, this);
        this.scheduleOnce(() => {
            cc.director.emit("重置倒计时");
        }, 0.1);

        this.loadMap();
        this.scheduleOnce(function () {
            this.createBarrierPrefab();
        }, 0.1);

        if (globalData.modeType.indexOf("双人") != -1)
            cc.director.emit("角色推荐双人");

        else
            cc.director.emit("角色推荐单人");
    },

    beginGame(){
        
        cc.director.emit("合作模式开始");
    },
    btnCallBack(event, type) {
    },
    loadMap() {
        //正式的
        var _level = globalData.miGongLevel;
        console.log("START 当前地图的level是 " + _level)
        var _modeName = null;
        _modeName = "doubleCooperate";
        // switch (globalData.modeType) {
        //     case "黑夜模式":
        //         _modeName = "nightMode";
        //         break;
        //     case "限时模式":
        //         _modeName = "timeMode";
        //         break;
        //     case "怪兽模式":
        //         _modeName = "monsterMode";
        //         break;
        //     case "双人对抗":
        //         _modeName = "doubleFight";
        //         break;
        //     case "双人合作":
        //         _modeName = "doubleCooperate";
        //         break;
        // }
        cc.find(_modeName, this.mapNode).active = true;
        cc.find(_modeName, this.mapNode).children.forEach(element => {
            element.active = false;
        });
        cc.find(_modeName, this.mapNode).children[_level].active = true;
        this.map = cc.find(_modeName, this.mapNode).children[_level].getComponent(cc.TiledMap);

        //获取地图基本道路属性
        var _mapSize = this.map.getMapSize();//多少格子
        var _tileSize = this.map.getTileSize();//每隔格子的大小
        //普通砖块
        this.brickNormalArr = new Array();
        let _groundObjArr = this.map.getObjectGroup("road").getObjects("road")
        for (let i = 0; i < _groundObjArr.length; i++) {
            this.brickNormalArr.push(_groundObjArr[i])
        }

        //根据地图大小对gameNode进行缩放处理
        this.mapWidth = _mapSize.width * _tileSize.width;
        this.mapHeight = _mapSize.height * _tileSize.height;
        var _scaleX = this.maxWidth / this.mapWidth;
        var _scaleY = this.maxHeight / this.mapHeight;
        if (_scaleX < _scaleY)
            cc.find("gameNode", this.node).scale = _scaleX;
        else
            cc.find("gameNode", this.node).scale = _scaleY;
        //确定玩家1 位置
        let _playerPosObj = this.map.getObjectGroup("pos").getObject("playerPos1");
        this.player0.position = cc.v2(_playerPosObj.x - this.mapWidth / 2 + _tileSize.width / 2, _playerPosObj.y - this.mapHeight / 2 - _tileSize.height / 2);
        globalData.modeType = "双人合作"
        //区分不同模式的处理  1确定玩家2位置 2隐藏/显示控制区域的显示/隐藏
        if (globalData.modeType == "双人合作" || globalData.modeType == "双人对抗") {
            this.player1.active = true;
            let _playerPosObj2 = this.map.getObjectGroup("pos").getObject("playerPos2");
            this.player1.position = cc.v2(_playerPosObj2.x - this.mapWidth / 2 + _tileSize.width / 2, _playerPosObj2.y - this.mapHeight / 2 - _tileSize.height / 2);
            cc.find("panel0", this.node).active = true;
            cc.find("panel1", this.node).active = true;

        }
        else {
            this.player1.active = false;
            cc.find("panel0", this.node).active = false;
            cc.find("panel1", this.node).active = false;
        }

        //生成结束点
        switch (globalData.modeType) {

            case "双人合作":
                //生成终点
                var _endPos = this.map.getObjectGroup("pos").getObject("endPos");
                var _posTarget = cc.v2(_endPos.x - this.mapWidth / 2 + _tileSize.width / 2, _endPos.y - this.mapHeight / 2 - _tileSize.height / 2);
                this.createTargetNode(_posTarget);

                //终点
                this.finishPoint.active = false;//默认隐藏
                cc.director.on("显示终点", () => {
                    this.finishPoint.active = true;
                }, this)

                //生成钥匙
                var _posKeys = this.map.getObjectGroup("Posprop").getObjects("propPos");
                for (var i = 0; i < _posKeys.length; i++) {
                    
                    var _posKey = cc.v2(_posKeys[i].x - this.mapWidth / 2 + _tileSize.width / 2, _posKeys[i].y - this.mapHeight / 2 - _tileSize.height / 2);
                    this.createKey(_posKey);
                }

                //现有的钥匙数量
                this.keyNumSum = 0;
                break;
        }
    },

    createBarrierPrefab() {
        for (let i = 0; i < this.brickNormalArr.length; i++) {
            var _barrier = cc.instantiate(this.roadPrefab);
            _barrier.parent = this.map.node;
            _barrier.width = this.brickNormalArr[i].width;
            _barrier.height = this.brickNormalArr[i].height;
            _barrier.angle = this.brickNormalArr[i].rotation;

            if (_barrier.angle != 0) {
                var _offX = -Math.cos(Tools.angleToRadian(90 - _barrier.angle)) * _barrier.height / 2;
                var _offY = Math.sin(Tools.angleToRadian(90 - _barrier.angle)) * _barrier.height / 4;
                _barrier.x = this.brickNormalArr[i].x - this.mapWidth / 2 + _offX;
                _barrier.y = this.brickNormalArr[i].y - this.mapHeight / 2 - this.brickNormalArr[i].height / 2 + _offY;
            }
            else {
                _barrier.x = this.brickNormalArr[i].x - this.mapWidth / 2;
                _barrier.y = this.brickNormalArr[i].y - this.mapHeight / 2 - this.brickNormalArr[i].height / 2;
            }

            let collider = _barrier.getComponent(cc.BoxCollider);
            collider.size.width = this.brickNormalArr[i].width;
            collider.size.height = this.brickNormalArr[i].height;
            _barrier.x += this.brickNormalArr[i].width / 2;

        }
    },

    //生成终点
    createTargetNode(_pos) {
        this.finishPoint = cc.instantiate(this.finishPointPrefab);
        this.finishPoint.position = _pos;
        this.finishPoint.parent = this.mapNode;
        this.finishPoint.getComponent("finishPoint").reset(-1);

    },
    //生成终点(双人对抗模式)
    createTargetNodeForFight(_pos, _playerType) {
        var _finishPoint = cc.instantiate(this.finishPointPrefab);
        _finishPoint.position = _pos;
        _finishPoint.parent = this.mapNode;
        _finishPoint.getComponent("finishPoint").reset(_playerType);
    },
    //生成怪物
    createMonster(_pos) {

    },
    //生成钥匙
    createKey(_pos) {
        var _key = cc.instantiate(this.keyPrefab);
        _key.position = _pos;
        _key.parent = this.mapNode;
    },
    //生成道具
    createProp(_pos) {

    },
    //生成炸弹
    createMissile(_player, _playerType) {

    },
    //生成特效---爆炸 
    createEffect(_propName, _player) {

        var _effect = null;;
        switch (_propName) {
            case "爆炸":
                _effect = cc.instantiate(this.effectPrefabArr[0]);
                break;
            case "交换烟雾":
                _effect = cc.instantiate(this.effectPrefabArr[1]);
                break;
            case "获得道具":
                _effect = cc.instantiate(this.effectPrefabArr[2]);
                break;
        }
        _effect.zIndex = 999;
        _effect.position = _player.position;
        _effect.parent = this.mapNode.parent;
        this.scheduleOnce(function () {
            _effect.destroy();
        }, 1)

    },
    //生成脚印
    createFootprint(_pos, _direction) {
        var _footPrint = cc.instantiate(this.footPrintPrefab);
        _footPrint.position = _pos;
        _footPrint.parent = this.mapNode;
        _footPrint.zIndex = 0;
        var _angle = 0;
        switch (_direction) {
            case "前":
                _angle = 180;
                break;
            case "后":
                _angle = 0;
                break;
            case "左":
                _angle = 90;
                break;
            case "右":
                _angle = 270;
                break;
        }
        _footPrint.angle = _angle;
    },
    showTips(_name) {
        var _tips = null;
        switch (_name) {
            case "逃脱成功":
                _tips = cc.instantiate(this.gameOverTips[0]);
                break;
            case "逃脱失败":
                break;
        }
        if (_tips == null) return;
        _tips.parent = this.node;
        _tips.opacity = 0;
        cc.tween(_tips)
            .to(0.2, { opacity: 255 })
            .delay(2)
            .to(0.2, { opacity: 0 })
            .call(() => {
                this.gameOverFunc();
            })
            .start();
    },
    gameOverFunc() {
        var _mapArr = cc.find("doubleCooperate", this.mapNode);
        globalData.miGongLevel++;
        if (globalData.miGongLevel >= _mapArr.length)
            globalData.miGongLevel = 0;
        cc.director.emit("合作模式结束","双人迷宫");
    },
    initCollision() {
        //重力碰撞初始化
        // cc.director.getCollisionManager().enabled = true;
        // cc.director.getPhysicsManager().enabled = true;
        // cc.director.getPhysicsManager().gravity = cc.v2(0, 0);//重力速度  -640代表 每秒移动640像素

        //普通碰撞初始化
        var manager = cc.director.getCollisionManager();
        manager.enabled = true;
        // manager.enabledDebugDraw = true;
    },
    // update (dt) {},
});
