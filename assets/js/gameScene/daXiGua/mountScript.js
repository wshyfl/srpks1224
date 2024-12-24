

cc.Class({
    extends: cc.Component,

    properties: {
        coinPre: cc.Prefab,
        lianJiPre: cc.Prefab,
        zhaDanEff: cc.Prefab,
        ballSkin1: [cc.SpriteFrame],
        ballSkin2: [cc.SpriteFrame],
        ballSkin3: [cc.SpriteFrame],
        ballSkin4: [cc.SpriteFrame],
        ballSkin5: [cc.SpriteFrame],
        ballSkin6: [cc.SpriteFrame],
        fruitBoom1Pre: [cc.Prefab],
        fruitBoom2Pre: [cc.Prefab],
    },


    onLoad() {
        // cc.game.addPersistRootNode(this.node);
        AD.mount = this;
        this.ballSkin = [this.ballSkin1, this.ballSkin2, this.ballSkin3, this.ballSkin4, this.ballSkin5, this.ballSkin6,];
        this.fruitEffZoom = [0.3, 0.4, 0.6, 1, 1.2, 1.4, 1.6, 1.8, 2]

    },

    start() {

    },

    // update (dt) {},
    /**金币
     * @param {* 父节点} _parent 
     * @param {* 开始坐标} _startPos 
     * @param {* 目标坐标} _targetPos 
     * @param {* 金币的价值} cost 
     */
    onCreatCoin(_parent, _startPos, _targetPos, cost) {
        for (let i = 0; i < 10; i++) {
            var coin = cc.instantiate(this.coinPre);
            coin.parent = _parent;
            coin.position = _startPos;
            coin.cost = cost;
            coin.getComponent("coin").init(_targetPos);
        }
    },
    /**水果爆炸特效
     * 
     * @param {* 父节点} _parent 
     * @param {* 初始坐标} _pos 
     * @param {* 预制体索引} _index 
     */
    onCreatFruitBoomEff(_parent1, _parent2, _pos, _index) {
        if(_index == -1){
            _index = 0;
        }
        let eff1 = cc.instantiate(this.fruitBoom1Pre[_index]);
        eff1.parent = _parent1;
        eff1.position = _pos;
        eff1.angle = this.random(0,360);
        eff1.scale = this.fruitEffZoom[_index];
        let eff2 = cc.instantiate(this.fruitBoom2Pre[_index]);
        eff2.parent = _parent2;
        eff2.position = _pos;
        eff2.scale = this.fruitEffZoom[_index];
        this.scheduleOnce(() => {
            eff1.destroy();
            eff2.destroy();
        }, 0.85);
    },
    
    random(lower, upper) {
        return Math.floor(Math.random() * (upper - lower + 1)) + lower;
    },
    /**连击特效
     * @param {* } _parent 父节点
     * @param {* } _num 连击次数
     */
    onCreatLianJiEff(_parent, _num, _pos) {
        // AD.sound.playSfx("失败球爆炸");
        let lianji = cc.instantiate(this.lianJiPre);
        lianji.parent = _parent;
        lianji.position = _pos;
        lianji.getChildByName("New Node").getChildByName("yxn_dk_lianJi").getChildByName("text").getComponent(cc.Label).string = _num;
        this.scheduleOnce(() => {
            lianji.destroy()
        }, 0.8)
    },
    /**炸弹爆炸
     * 
     * @param {*} _parent
     * @param {*} _pos 
     */
    onCreatZhaDanEff(_parent,_pos){
        let boom = cc.instantiate(this.zhaDanEff);
        boom.parent = _parent;
        boom.position = _pos;
        this.scheduleOnce(() => {
            boom.destroy()
        }, 0.8)
    }
});
