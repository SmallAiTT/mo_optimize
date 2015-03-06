module mo_audio{
    /**
     * 是否开启音效
     */
    export var audioEnabled = true;

    /** 默认的点击按键的音效id */
    export var audioIdOnClick = 101;

    export var _playingMusic:any;

    var musicVolume = 1;

    /**
     * 播放一个音效
     * @param audioPath
     * @param isBgMusic
     * @param cb
     * @param {Boolean|null} loop
     */
    export function playAudio(audioPath, loop?, isBgMusic?, cb?){
        if(!mo_audio.audioEnabled) return;
        if(loop == null) loop = false;
        res.getStatusRes(audioPath, function(audio){
            if(isBgMusic == true){
                audio.type = egret.Sound.MUSIC;
            }
            audio.play(loop);
            cb && cb(audio);
        }, null);
    }

    /**
     * 停止一个音效
     * @param audioPath
     */
    export function pauseAudio(audioPath){
        if(!mo_audio.audioEnabled) return;
        res.getStatusRes(audioPath, function(audio){
            audio.pause();
        }, null);
    }

    /**
     * 播放一个背景音乐
     * @param audioPath
     * @param loop
     */
    export function playMusic(audioPath, loop){
        if(!mo_audio.audioEnabled) return;
        playAudio(audioPath, loop ,true ,function(au){
            if(au != _playingMusic){
                au.setVolume(musicVolume);
                pauseMusic();
                _playingMusic = au;
            }
        });
    }

    /**
     * 暂停背景音乐
     */
    export function pauseMusic(){
        if(_playingMusic){
            _playingMusic.pause();
        }
    }
    /**
     * 恢复背景音乐
     */
    export function resumeMusic(){
        if(_playingMusic){
            _playingMusic.play();
        }
    }

    /**
     * 设置背景音乐音量
     * @param volume
     */
    export function setMusicVolume(volume){
        if(!mo_audio.audioEnabled) return;
        musicVolume = volume;

        if(_playingMusic){
            _playingMusic.setVolume(volume);
        }
    }

    export var playUIAudio:Function;
}