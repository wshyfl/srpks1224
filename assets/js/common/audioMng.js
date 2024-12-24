

cc.Class({
    extends: cc.Component,

    properties: {
        bgmGame: cc.AudioClip,
        bgmMenu: cc.AudioClip,
        bgmGame_shengHua: cc.AudioClip,
        sfxArr: {
            default: [],
            type: [cc.AudioClip]
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        cc.game.addPersistRootNode(this.node);
        AD.audioMng = this;
        this.sfxId = -1;
    },

    start() {
        this.couldPlaySfx = true;
        this.durationPlay = [0, 0, 0, 0, 0, 0, 0];//音效播放间隔

        this.durationCoin = 0;
        this.valume = 0;
        this.audioIndex = -1;
        this.playBGM = false;
        this.bgmType = null;

        this.duration_fire = 0;
        this.duration_hit = 0;
        this.penHuoQiIndex = -1;
        this.penHuoQiIndex2 = -1;
    },
    // AD.audioMng.playSfx("吃鸡吃道具");
    playSfx(_name, ...index) {
        var _sfxIndex = -1;
        var _isLoop = false;
        var _volume = 1;
        switch (_name) {

            case "按钮":
                _sfxIndex = 0;
                break;
            case "游戏结束":
                _sfxIndex = 1;
                break;
            case "吃鸡吃道具":
                _sfxIndex = 2;
                break;
            case "吃鸡吃开火":
                if (this.duration_fire > 0) {

                    return;
                }
                this.duration_fire = 1;
                this.scheduleOnce(() => {
                    this.duration_fire = 0;
                }, 0.1)
                _sfxIndex = 3;
                break;
            case "碰到球":
                _sfxIndex = 4;
                break;
            case "开炮":
                _sfxIndex = 5;
                break;
            case "炮弹爆炸":
                _sfxIndex = 6;
                break;
            case "漂移":
                _sfxIndex = 7;
                break;
            case "发动机":
                _isLoop = true;
                _sfxIndex = 8;
                break;
            case "战船反弹":
                _sfxIndex = 9;
                break;
            case "刀子插入":
                _sfxIndex = 10;
                break;
            case "击中地鼠":
                _sfxIndex = 11;
                break;
            case "猛鬼效果音效":
                _sfxIndex = 12;
                break;
            case "猛鬼破门":
                _sfxIndex = 13;
                break;
            case "猛鬼建筑":
                _sfxIndex = 14;
                break;
            case "猛鬼开火":
                if (this.duration_fire > 0) {

                    return;
                }
                this.duration_fire = 1;
                this.scheduleOnce(() => {
                    this.duration_fire = 0;
                }, 0.1)
                _sfxIndex = 15;
                break;
            case "猛鬼攻击":
                if (this.duration_hit > 0) {

                    return;
                }
                this.duration_hit = 1;
                this.scheduleOnce(() => {
                    this.duration_hit = 0;
                }, 0.1)
                _sfxIndex = 16;
                break;
            case "发球":
                _sfxIndex = 17;
                break;
            case "合成球":
                _sfxIndex = 18;
                break;
            case "得分":
                _sfxIndex = 19;
                break;
            case "秒":
                _sfxIndex = 20;
                break;
            case "go":
                _sfxIndex = 21;
                break;
            case "导弹":
                _sfxIndex = 22;
                break;
            case "喷火器":
                _sfxIndex = 23;
                _isLoop = true;
                break;
            case "喷火器2":
                _sfxIndex = 23;
                _isLoop = true;
                break;
            case "胜利":
                _sfxIndex = 24;
                break;
            case "猛鬼失败":
                _sfxIndex = 25;
                break;
            case "大摆钟":
                _sfxIndex = 26;
                break;
            case "NPC死亡":
                _sfxIndex = 27;
                break;


        }
        if (_sfxIndex != -1) {
            var _id = cc.audioEngine.play(this.sfxArr[_sfxIndex], _isLoop, _volume);

            switch (_name) {
                case "":
                    // cc.audioEngine.setFinishCallback(_id, function () {
                    //     cc.director.emit("木头人开始");
                    // });
                    break;
                case "发动机":
                    this.faDongJiIndex = _id;
                    break;
                case "喷火器":
                    this.penHuoQiIndex = _id;
                    break;
                case "喷火器2":
                    this.penHuoQiIndex2 = _id;
                    break;
            }

            // cc.audioEngine.setFinishCallback(_id, function () {
            //     console.log("音效播放完毕");
            //     cc.director.emit("123木头人音效播放完毕");
            // });

        }
    },
    stopSfx(_name, ...index) {
        switch (_name) {
            case "发动机":
                cc.audioEngine.stop(this.faDongJiIndex);
                break;
            case "喷火器":
                cc.audioEngine.stop(this.penHuoQiIndex);
                break;
            case "喷火器2":
                cc.audioEngine.stop(this.penHuoQiIndex2);
                break;
        }
    },

    playMusic() {

        this.couldPlaySfx = true;
        if (this.playBGM) return;
        this.audioIndex = cc.audioEngine.playMusic(this.bgmMenu, true);
        console.log("播放背景音乐")
        this.valume = 0;
        this.playBGM = true;
        cc.audioEngine.setVolume(this.audioIndex, this.valume);
    },
    stopMusic() {
        this.playBGM = false;
        console.log("停止背景音乐")
        this.couldPlaySfx = false;
        cc.audioEngine.setVolume(this.audioIndex, 0);
    },

    update(dt) {
        if (this.jinBiDurationTemp > 0) {
            this.jinBiDurationTemp -= dt;
        }
        if (this.playBGM) {
            if (this.valume < 0.7) {
                this.valume += dt * 0.3
                if (this.valume >= 0.7)
                    this.valume = 0.7;
                cc.audioEngine.setVolume(this.audioIndex, this.valume);
            }
        }
        else {
            if (this.valume > 0) {
                this.valume -= dt * 0.5;
                if (this.valume <= 0) {
                    this.valume = 0;
                    // cc.audioEngine.stopMusic(this.bgmGame);
                    // cc.audioEngine.stopMusic(this.bgmMenu);

                }
                cc.audioEngine.setVolume(this.audioIndex, this.valume);
            }
        }
    },
});
